import PageTitle from '@/app/ui/components/PageTitle'
import SmallPageWrapper from '@/app/ui/components/SmallPageWrapper'
import { Loader } from 'lucide-react'
import React from 'react'

function LoadingPage() {
  return (
    <SmallPageWrapper>
        <PageTitle>Loading</PageTitle>
        <Loader aria-label="Loader" className='spinner' size={120}/>
    </SmallPageWrapper>
  )
}

export default LoadingPage