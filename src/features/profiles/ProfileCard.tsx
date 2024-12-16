import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Props{
    profile: Profile;
}

export default observer(function ProfileCard({profile} : Props){

    // A function with simple logic to cut the bio if it exceeds 40 characters
    function truncate(str: string | undefined){
        if (str){
            return str.length > 40 ? str.substring(0, 40) + '...' : str;
        }
    }

    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>
                    {profile.displayName}
                </Card.Header>

                <Card.Description>
                    {profile.bio ? truncate(profile.bio) : `Hey, I'm Using Portal Active`}
                </Card.Description>

                <Card.Content extra>
                    <Icon name='user' />
                    {profile.followersCount} followers
                </Card.Content>

                <FollowButton profile={profile} />
            </Card.Content>
        </Card>
    )
})