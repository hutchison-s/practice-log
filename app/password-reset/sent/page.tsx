import BodyText from '@/app/ui/components/BodyText'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
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