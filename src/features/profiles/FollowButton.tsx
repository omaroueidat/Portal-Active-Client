import { Reveal, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent } from "react";

interface Props{
    profile: Profile;
}

export default function FollowButton({profile} : Props) {
    const {profileStore, userStore} = useStore();
    const {updateFollowing, loading} = profileStore;

    if (userStore.user?.username === profile.username) return null;

    function handleFollow(e : SyntheticEvent, username:string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return (
        <Reveal animated={loading ? undefined : "move" }>
            <Reveal.Content visible style={{width:'100%'}}>
                <Button 
                    fluid 
                    color='teal' 
                    content={profile.following ? 'Following' : 'Not following'} 
                />
            </Reveal.Content>

            <Reveal.Content hidden style={{width:'100%'}}>
                <Button 
                    fluid 
                    color={profile.following ? 'red' : 'green'} 
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
}