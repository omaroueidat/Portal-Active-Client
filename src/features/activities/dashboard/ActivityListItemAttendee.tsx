import { observer } from "mobx-react-lite";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props{
    attendees: Profile[];
}

// We will not directly access the Store but will make the function observale inorder to observe parent changes
export default observer(function ActivityListItemAttendee({attendees}: Props) {
    return(
        <List horizontal>
            {
                attendees.map(attendee => (
                    <Popup
                        hoverable
                        key={attendee.username}
                        trigger={
                            // Render the ListItem
                            <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                                <Image size='mini' circular src={attendee.image || '/assets/user.png'} />
                            </List.Item>
                        }
                    >
                        <Popup.Content>
                            <ProfileCard profile={attendee}/>
                        </Popup.Content>

                    </Popup>

                    
                ))
            }
            
        </List>
    )
})