import React, { act, ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, HtmlInputrops, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props{
    activity: Activity | undefined;
    closeForm: () => void;
    createOrEdit: (activity : Activity) => void;
    submitting: boolean;
}

export default function ActivityForm({activity : selectedActivity, closeForm, createOrEdit, submitting} : Props) {

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        category :'',
        city: '',
        venu: ''
    }

    const [activity, setActivity] = useState(initialState);

    const handleSubmit = () => {
        createOrEdit(activity)
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        
        const {name, value} = event?.target;

        setActivity(prevInitialState => ({
            ...prevInitialState,
            [name]: value 
        }))

    }

    // useEffect(() => {
    //     console.log(activity)
    // }, [activity])

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input placeholder='Date' value={activity.date} name='date' type='date' onChange={handleInputChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input placeholder='Venue' value={activity.venu} name='venu' onChange={handleInputChange}/>

                <Button floated='right' positive type='submit' content='Submit' loading={submitting}/>
                <Button floated='right' type='button' content='Cancel' onClick={closeForm}/>
                
            </Form>
        </Segment>
    )
}