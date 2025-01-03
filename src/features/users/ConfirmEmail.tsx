import { useEffect, useRef, useState } from "react";
import { useStore } from "../../app/stores/store";
import useQuery from "../../app/util/hooks";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import LoginForm from "./LoginForm";

export default function ConfirmEmail() {
    const effectRan = useRef(false); // Track if effect has run
    const {modalStore} = useStore();
    const email = useQuery().get('email') as string;
    const token = useQuery().get('token') as string;

    const Status = {
        Verifying: 'Verfying',
        Failed: 'Failed',
        Success: 'Success'
    }

    const [status, setStatus] = useState(Status.Verifying);

    function handleConfrimEmailResend() {
        agent.Account.resendEmailConfirm(email).then(() => {
            toast.success('Verification email resent - please check your email');
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        if (effectRan.current) return; // Skip if effect has already run

        effectRan.current = true; // Mark as run for strict mode to not run useeffect twice here

        agent.Account.verifyEmail(token, email)
            .then(() => setStatus("Success"))
            .catch(() => setStatus("Failed"));
    }, [Status.Success, Status.Failed, token, email]);

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return(
                    <div>
                        <p>Verification Failed. You can try resending the verify link to your email</p>
                        <Button primary onClick={handleConfrimEmailResend} size="huge" content="Resend Email" />
                    </div>
                )
            case Status.Success:
                return (
                    <div>
                        <p>Email has been verified - you can now login</p>
                        <Button primary onClick={() => modalStore.openModal(<LoginForm />)} size="huge" content="Login"/>
                    </div>
                )
        }
    }

    return(
        <Segment placeholder textAlign="center">
            <Header icon>
                <Icon name="envelope" />
                Email Verification
            </Header>
            <Segment.Inline>
                {getBody()}
            </Segment.Inline>
        </Segment>
    )
}