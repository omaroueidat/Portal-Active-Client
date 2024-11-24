import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/modalContainer';

function App() {
    const location = useLocation();

    const {userStore, commonStore} = useStore();

    useEffect(() => {
        if (commonStore.token){
            userStore.getUser();
            commonStore.setAppLoaded();
        } else{
            commonStore.setAppLoaded()
        }
    }, [commonStore, useStore])

    if (!commonStore.appLoaded){
        return <LoadingComponent content='Loading App...'/>
    }

    return (
      <>
        <ModalContainer />
        <ToastContainer position='bottom-right' theme='colored'  />
        {location.pathname === '/' ? <HomePage /> : (
            <>
                <NavBar />

                <Container style={{margin: '7em'}}>
                    <Outlet />
                </Container>
            </>
        )}
        </>
    )
}

export default observer(App);