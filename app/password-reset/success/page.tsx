import BodyText from '@/app/ui/components/BodyText'
import { PrimaryLinkButton } from '@/app/ui/components/Buttons'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
import SubHeading from '@/app/ui/components/SubHeading'
import React from 'react'

function ResetSuccess() {
  return (
    <SmallPageWrapper>
        <PageTitle>Success</PageTitle>
        
        <GlassDiv className='grid place-items-center gap-4'>
            <SubHeading className='text-center'>Your password has been reset successfully</SubHeading>
            <BodyText className='text-center my-8'>You may now sign in with your new password.</BodyText>
            <PrimaryLinkButton href='/login'>Sign In</PrimaryLinkButton>
            </GlassDiv>
            </SmallPageWrapper>
  )
}

export default ResetSuccess