import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";

export default class UserStore{
    // User that we will store
    user: User | null = null;

    
    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        // Send the request and recive the User as a response
        const user = await agent.Account.login(creds);

        // Set the token inside the commonStore
        store.commonStore.setToken(user.token);

        // Store the user
        runInAction(() => this.user = user);

        // Go to activities
        router.navigate('/activities');

        // Close the Modal Form
        store.modalStore.closeModal();

        // FOR TESTING PURPOSES 
        // TOREMOVE
        console.log(user)
    }

    register = async(creds: UserFormValues) => {
        // Send the request and 
        const user = await agent.Account.register(creds);

        // Set the token inisde the common Store
        store.commonStore.setToken(user.token);

        // Store the user
        runInAction(() => this.user = user);

        // Go to the activities
        router.navigate('/activities');

        // Close the Modal Form
        store.modalStore.closeModal();

        // FOR TESTING PURPOSES
        // TOREMOVE
        console.log(user);
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }


    getUser = async () => {
        try{
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch(err){
            console.log(err)
        }
    }

    setImage = (image: string) => {
        if (this.user){
            this.user.image = image;
        }
    } 
}