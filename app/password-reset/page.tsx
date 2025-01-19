import SmallPageWrapper from '../_ui_components/layout/SmallPageWrapper'
import PageTitle from '../_ui_components/layout/PageTitle'
import GlassDiv from '../_ui_components/layout/GlassDiv'

import PasswordResetForm from '../_ui_components/forms/PasswordResetForm'
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