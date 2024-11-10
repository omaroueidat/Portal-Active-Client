import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { NavLink } from 'react-router-dom';


export default function NavBar(){

    const {activityStore} = useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }}/>Portal Active
                </Menu.Item>

                <Menu.Item as={NavLink} to='/activities' name="Actvities" />

                <Menu.Item as={NavLink} to='/errors' name="Errors" />

                <Menu.Item as={NavLink} to='/createActivity'>
                    <Button positive content='Create Activity' onClick={() => activityStore.openForm()} />
                </Menu.Item>
            </Container>
        </Menu>
    )
}