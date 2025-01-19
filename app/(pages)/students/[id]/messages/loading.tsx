import Elipsis from '@/app/_ui_components/layout/Elipsis'
import FeaturedText from '@/app/_ui_components/layout/FeaturedText'
import PageTitle from '@/app/_ui_components/layout/PageTitle'
import React from 'react'

function MessagesLoading() {
  return (
    <>
        <PageTitle>Messages</PageTitle>
        <section className="w-full max-w-[600px] h-[60vh] py-4 px-2 rounded border-2 border-secondary overflow-auto text-center pt-12 md:px-8">
            <FeaturedText>Loading Messages<Elipsis /></FeaturedText>
        </section>
    </>
  )
}

export default MessagesLoading