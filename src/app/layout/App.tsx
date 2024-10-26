import { act, Fragment, useEffect, useState } from 'react'
import 'semantic-ui-css/semantic.min.css';
import { Container, Header, List, ListItem } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { ActivityDashboard } from '../../features/activities/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activites, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent
      .Activities
      .list()
      .then(res => {
        // Remove the time from the date that we are recieving from the api
        // That is because in the edit we will not be able to edit our date since it is being viewed
        
        res.forEach(act => {
          act.date = act.date.split('T')[0];
        });

        setActivities(res);
        setLoading(false);
      })
  }, [])

  const handleSelectedActivity = (id: string) => {
    // Find and set the activity to the selected one
    setSelectedActivity(activites.find(act => act.id == id));
  }

  const handleCancleSelectedActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectedActivity(id) : handleCancleSelectedActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  const handleCreateOrEditActivity = (activity: Activity) => {
    // Set the loading animation while submitting the request
    setSubmitting(true);

    // Check if the id exist ? => updating : => creating
    if (activity.id){
      // Updating an activity
      agent
        .Activities
        .update(activity)
        .then(() => {
          // Update the local Activities in the state
          setActivities([...activites.filter(act => act.id != activity.id), activity]);
          setSelectedActivity(activity);

          // Turn off the Edit Mode and Loading for the submitting
          setEditMode(false);
          setSubmitting(false);
        })
    }
    else{
      // Creating new Activity
      // Add a new Guid
      activity.id = uuid();

      agent
        .Activities
        .create(activity)
        .then(() => {
          // Add the activity to the local activities state
          setActivities([...activites, activity]);
          setSelectedActivity(activity);

          // Turn off the Edit Mode and Loading for the submitting
          setEditMode(false);
          setSubmitting(false);
        })
    }

    
    
  }

  const handleDeleteActivity = (id: string) => {  
    // Turn on the loading on the delete button
    setSubmitting(true);

    // Send the request to the api
    agent
      .Activities
      .delete(id)
      .then(() => {
        // Update the local Activities state
        setActivities([...activites.filter(act => act.id != id)]);

        setSubmitting(false);
      });

    
  }

  if (loading)
    return(
      <LoadingComponent 
        content='Loading App'
      />
    ) 
  else
    return (
      <>
        
        <NavBar 
          openForm={handleFormOpen}
        />
        
        <Container style={{margin: '7em'}}>
          <ActivityDashboard
            activities={activites}
            selectedActivity={selectedActivity}
            selectActivity={handleSelectedActivity}
            cancelActivity={handleCancleSelectedActivity}
            editMode={editMode}
            openForm={handleFormOpen}
            closeForm={handleFormClose}
            createOrEdit={handleCreateOrEditActivity}
            deleteActivity={handleDeleteActivity}
            submitting={submitting}
            />
        </Container>
      </>
    )
}

export default App
