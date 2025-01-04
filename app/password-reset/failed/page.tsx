import BodyText from '@/app/ui/components/BodyText'
import { PrimaryLinkButton } from '@/app/ui/components/Buttons'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
import SubHeading from '@/app/ui/components/SubHeading'
import React from 'react'

async function PasswordResetFailed({searchParams}: {searchParams: Promise<{reason: string}>}) {
    const {reason} = await searchParams;
  return (
    <SmallPageWrapper>
        <PageTitle>Error</PageTitle>
        
        <GlassDiv className='grid place-items-center gap-4'>
            <SubHeading className='text-center'>Password Reset Failed</SubHeading>
            <BodyText className='text-center my-8'>{decodeURIComponent(reason)}</BodyText>
            <PrimaryLinkButton href='/login'>Back to Sign In</PrimaryLinkButton>
            </GlassDiv>
            </SmallPageWrapper>
  )
}

export default PasswordResetFailed