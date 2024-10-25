import { act, Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Container, Header, List, ListItem } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { ActivityDashboard } from '../../features/activities/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {

  const [activites, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<Activity[]>('http://localhost:5066/api/activities')
      .then(res => {
        setActivities(res.data)
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
    activity.id 
    ? setActivities([...activites.filter(act => act.id != activity.id), activity]) 
    : setActivities([...activites, {...activity, id: uuid()}]);
    
    setEditMode(false);
    setSelectedActivity(activity);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activites.filter(act => act.id != id)]);
  }

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
          />
      </Container>
    </>
  )
}

export default App
