import React from 'react'
import PageTitle from './ui/components/PageTitle'
import { PrimaryLinkButton } from './ui/components/Buttons'
import FeaturedText from './ui/components/FeaturedText'

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