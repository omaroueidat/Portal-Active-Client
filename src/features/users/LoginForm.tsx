import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function LoginForm(){

    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{email:'', password:'', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(err => setErrors(
                {error: err.response.data}))}
        >
            {
                ({handleSubmit, isSubmitting, errors}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                        <Header as='h2' content='Login to Protal Active' color='teal' textAlign="center" />
                        <MyTextInput placeholder="Email" name="email"/>
                        <MyTextInput placeholder="Passsword" name="password" type="password"/>
                        <ErrorMessage 
                            name='error'
                            render={() => <Label style={{marginBottom: '10px'}} basic color='red' content={errors.error} />}
                        />
                        <Button positive content='Login' type='submit' fluid loading={isSubmitting}/>
                    </Form>
                )
            }
        </Formik>
    )
})