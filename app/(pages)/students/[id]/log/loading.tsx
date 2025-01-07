import PageTitle from '@/app/ui/components/PageTitle'
import { Loader } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <>
        <PageTitle>Student Portal</PageTitle>
        <p>Loading profile...</p>
        <div className="spinner text-lighter">
            <Loader aria-label="Loader" size={120}/>
        </div>
    </>
  )
}

export default loading