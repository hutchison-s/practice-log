import BodyText from '@/app/_ui_components/layout/BodyText'
import { PrimaryLinkButton } from '@/app/_ui_components/layout/Buttons'
import GlassDiv from '@/app/_ui_components/layout/GlassDiv'
import PageTitle from '@/app/_ui_components/layout/PageTitle'
import SmallPageWrapper from '@/app/_ui_components/layout/SmallPageWrapper'
import SubHeading from '@/app/_ui_components/layout/SubHeading'
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