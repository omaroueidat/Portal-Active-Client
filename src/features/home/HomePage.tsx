import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function HomePage() {
    const {modalStore, commonStore: {token}} = useStore();

    return(
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBotton: '12'}}/>
                </Header>

                {
                    // Check if the user is logged in or not
                    token ?(
                    <>
                        <Header as='h2' inverted content='Welcome to Protal Active'/>
                        <Button as={Link} to='/activities' size='huge' inverted content='Go to Activities!'/>
                    </>
                    ) : (
                        <>
                            <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted content='Login'/>
                            <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted content='Register'/>
                         </>
                    )
                }
            </Container>
        </Segment>
    )
})