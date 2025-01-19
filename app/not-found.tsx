import React from 'react'
import PageTitle from './_ui_components/layout/PageTitle'
import { PrimaryLinkButton } from './_ui_components/layout/Buttons'
import FeaturedText from './_ui_components/layout/FeaturedText'

function NotFound() {
  return (
    <main className="w-full min-h-full flex flex-col justify-center items-center gap-4 px-8 pt-[85px] pb-8 md:px-20">
      <PageTitle>Ope!</PageTitle>
      <div className='my-12'>
        <FeaturedText>This page does not exist</FeaturedText>
      </div>
      <PrimaryLinkButton href={'/'}>Return to Home</PrimaryLinkButton>
    </main>
  )
}

export default NotFound