import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore{
    selectedActivity: Activity | undefined = undefined;
    activityRegistry = new Map<string, Activity>();
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.predicate.keys(), 
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((_, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        
        switch(predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate'){
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })
        return params;
    }


    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
            a.date!.getTime() - b.date!.getTime()
        )
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string] : Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try{
            const result = await agent.Activities.list(this.axiosParams);
            
            
            result.data.forEach(act => {
                this.setActivity(act);
            });

            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
            
            

        } catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        } finally{
            runInAction(() => this.loading = false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadActivity = async (id: string) => {
        this.setLoadingInitial(true);
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            this.setLoadingInitial(false);
            return activity;
        }
        else{
            try{
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
            } catch(err){
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        // Get the user from the store
        const user = store.userStore.user;

        // Set the activity attributes from the user
        if (user) {
            // Search the username of the user to check if his name is among the attendees of the activity
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )

            // Check if the user is the host of the activity
            activity.isHost = activity.hostUsername === user.username;

            // Get the host of the activity
            activity.host = activity.attendees?.find(
                u => u.username === activity.hostUsername
            );
        }

        activity.date = new Date(activity.date!);

        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    } 

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }


    createActivity = async (activity: ActivityFormValues) => {
        activity.id = uuid();
        
        // Add the current user as an attendee (to the client side)
        const user = store.userStore.user;
        const attendee = new Profile(user!);

        try{
            await agent.Activities.create(activity);

            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);

            runInAction( () => {
                this.selectedActivity = newActivity;
            })
        } catch(err){
            console.log(err);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try{
            await agent.Activities.update(activity);

            runInAction(() => {
                if (activity.id){
                    // Get the original information and combine them
                    let updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
                
                
            })
        } catch(err) {
            console.log(err);
            runInAction(() => {this.loading = false})
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        
        try{
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id);
                 

                this.loading = false;
            })
        } catch(err) {
            console.log(err);
            runInAction(() => {this.loading = false});
       }

    }

    updateAttendance = async() => {
        // Get the user
        const user = store.userStore.user;
        this.loading = true;

        try{
            // Send the request to attend the activity
            await agent.Activities.attend(this.selectedActivity!.id);

            runInAction(() => {
                // Filter out the attendee if he joined and requested to cancel
                if (this.selectedActivity?.isGoing){
                    // Filter out the user
                    this.selectedActivity.attendees = this.selectedActivity
                        .attendees?.filter(u => u.username !== user?.username);
                    
                    // Set the selected activity isGoing to false to update the state
                    this.selectedActivity.isGoing = false;
                } else{
                    // Add the user to the list of profiles
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                // Set the activity registry with the updated registry
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        } catch(err){
            console.log(err);
        } finally{
            runInAction(() => this.loading = false);
        }

    }

    cancelActivityToggle = async () => {
        // Set the loading animation
        this.loading = true;

        try{
            // Send the request to cancel the attendace
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                // Toggle the cancellation
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;

                // Update the activity in the memoery
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (err){
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}
