import { Header, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { ActivityListItem } from './ActivityListItem';
import { Fragment } from 'react/jsx-runtime';


export default observer(function ActivityList() {


    const {activityStore} = useStore();

    const {groupedActivities} = activityStore;



    return (

        <>
            {groupedActivities.map(([group, activities]) => (

                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>

                    <Segment> 
                        <Item.Group divided>
                            {activities.map(activity => {
                                return(
                                <ActivityListItem activity={activity} key={activity.id}/>
                            )})}
                        </Item.Group>
                    </Segment>
                </Fragment>
            ))}
        </>
    )
})

