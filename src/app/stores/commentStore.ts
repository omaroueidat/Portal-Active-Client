import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor(){
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity){
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5066/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect() // Reconnect the user if he lost connection
                .configureLogging(LogLevel.Information)
                .build();

            // Start the connection
            this.hubConnection.start().catch(error => console.log('Error establishing the connection', error));
            
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    // Append the Z at the end of the date to insure the time is displayed as UTC
                    // That is beacuse the EF CORE doesn't return the time with Z at the end
                    // Which creates a problem by displaying the date wrong
                    comments.forEach(comment => comment.createdAt = comment.createdAt + 'Z') 
                    console.log(comments)
                    this.comments = comments
                });
            });

            // When we recive a comment update the list
            this.hubConnection.on('RecieveComment', (comment: ChatComment) => {
                runInAction(() => this.comments.unshift(comment))
            })
        }
    }

    // Stopping the connection
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(err => console.log('Error Stopping Connection!', err))
    }

    // Clean the comments when we move out from the activity
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: {body:string, activityId?: string}) => {
        values.activityId = store.activityStore.selectedActivity?.id;

        try{
            await this.hubConnection?.invoke('SendComment', values);
        } catch(err){
            console.log(err);
        }
    }
    
}