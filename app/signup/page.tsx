
import BodyText from "../ui/components/BodyText";
import PageTitle from "../ui/components/PageTitle";
import SignUpForm from "../ui/components/SignUpform";
import SmallPageWrapper from "../ui/components/SmallPageWrapper";


export default function Page() {

    

    return (
        <>
            <SmallPageWrapper>
                <PageTitle>Sign Up</PageTitle>
                <BodyText className="text-center text-sm">
                After signing up, you will receive an validation email at the email address you provide below.<br/>
                Click the link in the email to activate your account and get started with Practice HQ.
                </BodyText>
                <SignUpForm />
                
            </SmallPageWrapper>
        </>
    )
}