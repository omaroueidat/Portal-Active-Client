import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { Activity } from '../../app/models/activity';
import ActivityList from './dashboard/ActivityList';
import ActivityDetails from './details/ActivityDetails';
import ActivityForm from './form/ActivityForm';

interface Props{
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelActivity: () => void;
    editMode : boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit:(activity: Activity) => void;
    deleteActivity: (id:string) => void;
}

export function ActivityDashboard({activities, selectedActivity, selectActivity, cancelActivity, editMode, openForm, closeForm, createOrEdit, deleteActivity}: Props) {

    return(
        <Grid>
            <Grid.Column width='10' >
                <ActivityList 
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                />
            </Grid.Column>

            <Grid.Column width='6'>
                {
                    selectedActivity  
                    &&
                    !editMode
                    &&
                    <ActivityDetails 
                        activity={selectedActivity}
                        cancelActivity={cancelActivity} 
                        openForm={openForm}
                    />
                }

            {
                editMode 
                &&

            
                <ActivityForm 
                    closeForm={closeForm}
                    activity={selectedActivity}
                    createOrEdit={createOrEdit}
                />
            }

            </Grid.Column>
        </Grid>
    )
}