import BodyText from '@/app/_ui_components/layout/BodyText'
import { PrimaryLinkButton } from '@/app/_ui_components/layout/Buttons'
import GlassDiv from '@/app/_ui_components/layout/GlassDiv'
import PageTitle from '@/app/_ui_components/layout/PageTitle'
import SmallPageWrapper from '@/app/_ui_components/layout/SmallPageWrapper'
import SubHeading from '@/app/_ui_components/layout/SubHeading'
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