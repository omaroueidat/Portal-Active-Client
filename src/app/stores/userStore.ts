import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { store } from "./store";

export default class UserStore{
    // User that we will store
    user: User | null = null;
    fbLoading = false;
    refreshTokenTimeout? : number;

    
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

        this.startRefreshTokenTimer(user);

        // Store the user
        runInAction(() => this.user = user);

        // Go to activities
        router.navigate('/activities');

        // Close the Modal Form
        store.modalStore.closeModal();
    }

    register = async(creds: UserFormValues) => {
        
        // Send the request
        await agent.Account.register(creds);

        // Go to the activities
        router.navigate(`/account/registerSuccess?email=${creds.email}`);

        // Close the Modal Form
        store.modalStore.closeModal();
        
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }


    getUser = async () => {
        try{
            const user = await agent.Account.current();
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
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

    setDisplayName = (name: string) => {
        if (this.user) this.user.displayName = name;
    }

    facebookLogin = async (accessToken: string) => {
        this.fbLoading = true;
        try{
            // Send the request for facebook login to the api
            const user = await agent.Account.fbLogin(accessToken);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);

            runInAction(() => {
                this.user = user;
            })

            router.navigate('/activities');
        } catch (err){
            console.log(err);
        } finally {
            this.fbLoading = false;
        }
    }

    refreshToken = async() => {
        this.stopRefreshTokenTimer();

        try{
            const user = await agent.Account.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: User){
        // Get the part of the token which is about expiry date
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));

        const expires = new Date(jwtToken.exp * 1000);

        // Time out is 30 seconds before the timwout of the token
        const timeout = expires.getTime() - Date.now() - (30 * 1000);


        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);

        // TOREMOVE Log Testing
        console.log({refreshTimeOut: this.refreshTokenTimeout});
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}