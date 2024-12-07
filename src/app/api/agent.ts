import axios, { AxiosError, AxiosResponse } from 'axios'
import { Activity, ActivityFormValues } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/user';
import { Photo, Profile } from '../models/profile';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5066/api';

axios.interceptors.response.use(async res =>{
    // Request successful
    await sleep(1000);
    return res;
       
}, (error: AxiosError) => {
    // Request Rejected
    const {data, status, config} = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modelStateErrors = [];
                for (const key in data.errors){
                    if (data.errors[key]){
                        modelStateErrors.push(data.errors[key]);
                    }
                }

                throw modelStateErrors.flat();
            } else{
                toast.error(data);
            }
            break;
        
        case 401:
            toast.error('Unauthorized');
            break;

        case 403:
            toast.error('Forbidden');
            break;

        case 404:
            router.navigate('/not-found');
            break;

        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;

        default:
            toast.error(`Error Code: ${status}. Try Again Later!`);
            break;
    }

    return Promise.reject(error);

})

// Add the token in the headers of the request
axios.interceptors.request.use(conf => {
    // Get the token from our store
    const token = store.commonStore.token;
    
    // Add the token to header using Bearer
    if (token && conf.headers) conf.headers.Authorization = `Bearer ${token}`;
    
    return conf;
})

const responseBody = <T> (respone : AxiosResponse<T>) => respone.data;

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => request.get<Activity[]>('/activities'),
    details: (id: string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>('/activities',activity),
    update: (activity: ActivityFormValues) => request.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.del<void>(`/activities/${id}`),
    attend: (id: string) => request.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => request.get<User>('/account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user),
}

const Profiles = {
    get: (username: string) => request.get<Profile>(`/profiles/${username}`), 
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-Type': 'multipart/form-data'} // Set the Content type to form 
        })
    },
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.del(`/photos/${id}`),
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;