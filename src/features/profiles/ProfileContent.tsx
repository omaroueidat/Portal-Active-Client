import { Tab } from "semantic-ui-react";
import ProfilePhoto from "./ProfilePhoto";
import { Profile } from "../../app/models/profile";

interface Props {
    profile: Profile;
}

export default function ProfileContent({profile}: Props) {
    const panes = [
        {menuItem: 'About', render: () => <Tab.Pane>About Content</Tab.Pane>},
        {menuItem: 'Photos', render: () => <ProfilePhoto profile={profile} />},
        {menuItem: 'Events', render: () => <Tab.Pane>Event Content</Tab.Pane>},
        {menuItem: 'Followers', render: () => <Tab.Pane>Followes Content</Tab.Pane>},
        {menuItem: 'Following', render: () => <Tab.Pane>Following Content</Tab.Pane>},
    ]

    return (
        <Tab 
            menu={{fluid: true, vertical: true}}
            menuPosition="right"
            panes={panes}
        />
    )
}