import BodyText from '@/app/ui/components/BodyText'
import GlassDiv from '@/app/ui/components/GlassDiv'
import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
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