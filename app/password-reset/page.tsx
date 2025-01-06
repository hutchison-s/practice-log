import SmallPageWrapper from '../ui/components/SmallPageWrapper'
import PageTitle from '../ui/components/PageTitle'
import GlassDiv from '../ui/components/GlassDiv'

import PasswordResetForm from '../ui/components/PasswordResetForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Request a password reset code and get back to motivating and monitoring student progress.",
  };

function RequestReset() {

  return (
    <SmallPageWrapper>
        <PageTitle>Request Password Reset</PageTitle>
        <GlassDiv>
            <PasswordResetForm />
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default RequestReset