import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import * as yup from 'yup';
import ValidationError from "../errors/ValidationError";

export default observer(function RegisterForm(){

    const {userStore} = useStore();

    return (
        <Formik
            initialValues={{ displayName: '', username:'', email:'', password:'', error: null}}
            onSubmit={(values, {setErrors}) => userStore.register(values).catch(error => setErrors(
                {error: error}))}

            validationSchema={yup.object({
                displayName: yup.string().required(),
                username: yup.string().required(),
                email: yup.string().required(),
                password: yup.string().required(),
            })}
        >
            {
                ({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                    <Form className='ui form error' onSubmit={handleSubmit} autoComplete="off">
                        <Header as='h2' content='Sign up to Protal Active' color='teal' textAlign="center" />
                        <MyTextInput placeholder="Username" name="username"/>
                        <MyTextInput placeholder="Display Name" name="displayName"/>
                        <MyTextInput placeholder="Email" name="email"/>
                        <MyTextInput placeholder="Passsword" name="password" type="password"/>
                        <ErrorMessage 
                            name='error'
                            
                            render={() => {
                                console.log(errors); 
                                if (Array.isArray(errors.error)) {
                                    return <ValidationError errors={errors.error} />;
                                } 
                                return null;
                            }}
                        />
                        <Button 
                            disabled={!isValid || !dirty || isSubmitting}
                            positive 
                            content='Register' 
                            type='submit' 
                            fluid 
                            loading={isSubmitting}
                        />
                    </Form>
                )
            }
        </Formik>
    )
})