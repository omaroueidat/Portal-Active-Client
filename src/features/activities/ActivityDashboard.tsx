import { Grid } from 'semantic-ui-react';
import ActivityList from './dashboard/ActivityList';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import ActivityFilters from './dashboard/ActivityFilters';


export default observer(function ActivityDashboard() {
    
    const {activityStore} = useStore();
    const {loadActivities, activityRegistry, groupedActivities} = activityStore;



    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities();
    }, [loadActivities, activityRegistry.size, groupedActivities])
  
  
    if (activityStore.loadingInitial)
      return(
        <LoadingComponent 
          content='Loading App'
        />
      ) 

    return(
        <Grid>
            <Grid.Column width='10' >
                <ActivityList />
            </Grid.Column>

            <Grid.Column width='6'>
              <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})