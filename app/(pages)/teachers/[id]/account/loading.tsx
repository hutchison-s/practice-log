import PageTitle from '@/app/_ui_components/layout/PageTitle'
import { Loader } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <>
        <PageTitle>Account Settings</PageTitle>
        <Loader className='spinner' size={120} />
    </>
  )
}

export default loading