import BodyText from '@/app/_ui_components/layout/BodyText'
import GlassDiv from '@/app/_ui_components/layout/GlassDiv'
import PageTitle from '@/app/_ui_components/layout/PageTitle'
import SmallPageWrapper from '@/app/_ui_components/layout/SmallPageWrapper'
import React from 'react'

function SuccessPage() {
  return (
    <SmallPageWrapper>
        <PageTitle>Account Created</PageTitle>
        <GlassDiv className='min-h-[200px] grid place-items-center'>
            <BodyText className='text-center'>
                Check your email for your validation link to get started!
            </BodyText>
        </GlassDiv>
    </SmallPageWrapper>
  )
}

export default SuccessPage