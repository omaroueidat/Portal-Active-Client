import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button, Divider } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";
import FacebookLogin, { FailResponse, SuccessResponse } from "@greatsumini/react-facebook-login";

export default observer(function HomePage() {
    const {modalStore, commonStore: {token}, userStore} = useStore();

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
                            <Divider horizontal inverted>Or</Divider>
                            <FacebookLogin
                                appId='2405141839823132'
                                onSuccess={(res: SuccessResponse) => {
                                    userStore.facebookLogin(res.accessToken);

                                    // TOREMOVE Testing logger
                                    console.log('Login Success!');
                                }}
                                onFail={(res: FailResponse) => {
                                    console.log('Login failed', res)
                                }}
                                className={`ui button facebook huge inverted ${userStore.fbLoading && 'loading'}`}
                            />
                         </>
                    )
                }
            </Container>
        </Segment>
    )
})