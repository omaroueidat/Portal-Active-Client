import { createBrowserRouter, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../features/activities/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import App from "../layout/App";

export const routes: RouteObject[] = [
    { 
        // Parent route
        path: '/', 
        element: <App />,
        children: [         // Children Routes that are contained in the parent
            {path: 'activities', element: <ActivityDashboard />},
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'createActivity', element: <ActivityForm key='create'/>},
            {path: 'manage/:id', element: <ActivityForm key='manage'/>},
            
        ]
    }
]

export const router = createBrowserRouter(routes)