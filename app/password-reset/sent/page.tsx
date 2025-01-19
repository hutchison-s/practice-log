import BodyText from '@/app/_ui_components/layout/BodyText'
import GlassDiv from '@/app/_ui_components/layout/GlassDiv'
import PageTitle from '@/app/_ui_components/layout/PageTitle'
import SmallPageWrapper from '@/app/_ui_components/layout/SmallPageWrapper'
import React from 'react'

async function SentResetLinkPage() {
  return (
    <SmallPageWrapper>
        <PageTitle>Sent Reset Link</PageTitle>
        <GlassDiv className='min-h-60 grid place-items-center'>
            <BodyText className='text-center'>Check your email for the link to reset your password</BodyText>
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default SentResetLinkPage