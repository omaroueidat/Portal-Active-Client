import { observer } from 'mobx-react-lite'
import {Segment, Header, Comment, Loader} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup'
import { formatDistanceToNow } from 'date-fns';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({activityId} : Props) {
    const {commentStore} = useStore();

    useEffect(() => {
        // Check for the activity Id since we dont want to create a connection if we dont have one
        if (activityId){
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment clearing>

                <Formik
                        onSubmit={(values: {body: string, activityId?: string}, {resetForm}) => {
                            commentStore.addComment(values).then(() => resetForm())
                        }}

                        initialValues={{body: ''}}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                    >

                    {({isSubmitting, isValid, handleSubmit}) => (
                        <Form className='ui form'>
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{position: 'relative'}}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, Shift + Enter for new line)'
                                            rows={2}
                                            {...props.field}
                                            onKeyPress={e => {
                                                if(e.key === 'Enter' && e.shiftKey){
                                                    return;
                                                }

                                                if (e.key === 'Enter' && !e.shiftKey){
                                                    // Prevent the normal behaviour of new line
                                                    e.preventDefault();

                                                    // Check if valid and then send the data
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}

                    </Formik>

                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src='/assets/user.png'/>
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{whiteSpace: 'pre-wrap'}}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    

                    

                    
                </Comment.Group>
            </Segment>
        </>

    )
})
