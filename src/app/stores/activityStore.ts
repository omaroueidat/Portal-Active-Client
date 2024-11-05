import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore{
    selectedActivity: Activity | undefined = undefined;
    activityRegistry = new Map<string, Activity>();
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => 
            Date.parse(a.date) - Date.parse(b.date))
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string] : Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try{
            const activities = await agent.Activities.list();
            
            
            activities.forEach(act => {
                act.date = act.date.split('T')[0];
                this.setActivity(act);
            });

            this.setLoadingInitial(false);
            
            

        } catch(error){
            console.log(error);
            this.setLoadingInitial(false);
        }
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
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    } 

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }


    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();

        try{
            await agent.Activities.create(activity);

            runInAction( () => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = true;
                this.selectedActivity = activity;
                this.loading = false;
            })
        } catch(err){
            console.log(err);
            runInAction(() => {this.loading = false})
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;

        try{
            await agent.Activities.update(activity);

            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
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

}
