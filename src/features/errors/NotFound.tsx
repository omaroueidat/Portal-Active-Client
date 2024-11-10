import { Link } from "react-router-dom";
import { Header, Segment, SegmentInline, Icon, Button } from "semantic-ui-react";

export default function NotFound(){
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' style={{marginTop: '10px'}}/>
                Oops - we've looked everywhere but could not find what you're looking for!
            </Header>

            <SegmentInline>
                <Button as={Link} to='/activities' color='green'>
                    Return to Activities
                </Button>
            </SegmentInline>
        </Segment>
    )
}