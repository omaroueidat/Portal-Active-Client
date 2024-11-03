import { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';


export default observer(function ActivityList() {

    const [target, setTarget] = useState('');

    const {activityStore} = useStore();

    const {selectActivity, deleteActivity, loading, activitiesByDate} = activityStore;


    const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venu}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue' />
                                <Button floated='right' content='Delete' color='red' loading={target === activity.id && loading} name={activity.id} onClick={(e) => handleActivityDelete(e, activity.id)} />
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})