import { act, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Header, List, ListItem } from 'semantic-ui-react';

function App() {

  const [activites, setActivities] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5066/api/activities')
      .then(res => {
        setActivities(res.data)
      })
  }, [])

  return (
    <div>
      <Header as='h2' icon='users' content='Activities'/>
      <List>
        {activites.map((activity:any) => (
          <List.Item key={activity.id} >{activity.title}</List.Item>
        ))}
      </List>
    </div>
  )
}

export default App
