
import { Metadata } from "next";
import BodyText from "../_ui_components/layout/BodyText";
import PageTitle from "../_ui_components/layout/PageTitle";
import SignUpForm from "../_ui_components/forms/SignUpform";
import SmallPageWrapper from "../_ui_components/layout/SmallPageWrapper";

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up quickly for a Practice HQ account and get started motivating and monitoring student progress.",
  };

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