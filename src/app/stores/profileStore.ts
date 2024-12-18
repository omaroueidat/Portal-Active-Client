import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { UserActivity } from "../models/userActivity";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab == 3 || activeTab == 4){
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else{
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab : number) => {
        this.activeTab = activeTab;
    }

    // Computed Attribute to check if the current profile is for the logged in user
    get isCurrentUser() {
        if (store.userStore.user && this.profile){
            return store.userStore.user.username === this.profile.username;
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try{
            const profile = await agent.Profiles.get(username);
            runInAction(() => this.profile = profile);

        } catch(err) {
            console.log(err);
            
        } finally{
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try{
            // Send the upload photo request
            const response = await agent.Profiles.uploadPhoto(file);

            // Get the photo response that contains the image details
            const photo = response.data;
            
            // React to the change in the API locally in frontend
            runInAction(() => {
                if (this.profile) {
                    // Add the photo to the list of photos of the user
                    this.profile.photos?.push(photo);
                    // Check if the photo is the main photo
                    if (photo.isMain && store.userStore.user) {
                        // Set the image of the user to the main photo
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                } 
            })
        } catch(err) {

        } finally {
            // Set the uploading status to false
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async(photo: Photo) => {
        this.loading = true;
        try{
            // Send the request to the API
            await agent.Profiles.setMainPhoto(photo.id);

            // Change the user main image
            store.userStore.setImage(photo.url);

            // Update the UI
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            })
        } catch(err) {
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true;
        try{
            // Send the request to the API
            const response = await agent.Profiles.deletePhoto(id);

            // Update the local Lists
            runInAction(() => {
                if (this.profile && this.profile.photos){
                    this.profile.photos = [...this.profile.photos.filter(p => p.id != id)];
                }
            })
        } catch(err) {
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;

        try{
            // Send the request to the API
            await agent.Profiles.updateProfile(profile);

            // Update the local data
            runInAction(() => {
                // Check if the display Name has changed
                if (profile.displayName && profile.displayName != store.userStore.user?.displayName)  {
                    store.userStore.setDisplayName(profile.displayName);
                }
                
                // Add the given attributes
                this.profile = {...this.profile, ...profile as Profile }
            })
        } catch(err) {
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try{
            // Send the reqeust to the API
            await agent.Profiles.updateFollowing(username);

            // Update the local data 
            store.activityStore.updateAttendeeFollowing(username);

            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username){
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username){
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
            })

        } catch(err) {
            console.log(err);
        } finally {
            runInAction(() => this.loading = false);
        }
    } 

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;

        try{
            // Send the reqeust to the API
            const followings = await agent.Profiles.listFollowigs(this.profile!.username, predicate);

            runInAction(() => {
                this.followings = followings;
            })

        } catch(err) {
            console.log(err);
        } finally {
            runInAction(() => this.loadingFollowings = false);
        }
    }

    loadActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;

        try{
            // Send the request
            const activities = await agent.Profiles.listActivities(username, predicate!)

            // Add the activities locally
            runInAction(() => {
                this.userActivities = activities;
            })
        } catch(err) {
            console.log(err);
        } finally {
            this.loadingActivities = false;
        }
    }
}