import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
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
}