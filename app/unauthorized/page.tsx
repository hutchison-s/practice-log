import React from 'react'
import SmallPageWrapper from '../_ui_components/layout/SmallPageWrapper'
import PageTitle from '../_ui_components/layout/PageTitle'
import { PrimaryLinkButton } from '../_ui_components/layout/Buttons'
import FeaturedText from '../_ui_components/layout/FeaturedText'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unauthorized access attempt',
  description: 'Login to access this content'
}

function UnauthorizedPage() {
  return (
    <>
        <SmallPageWrapper>
            <PageTitle>Access Denied</PageTitle>
            <FeaturedText>You don&apos;t have access to this page.</FeaturedText>
            <PrimaryLinkButton href='/login' className='mx-auto my-6'>Login to continue</PrimaryLinkButton>
        </SmallPageWrapper>
    </>
  )
}

export default UnauthorizedPage