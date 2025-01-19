import { SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import SubHeading from '@/app/_ui_components/layout/SubHeading'
import { Loader } from 'lucide-react'
import React from 'react'

function StudentRecordsSkeleton() {
  return (
    <>
        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Recent Logs</SubHeading>
        <Loader className='spinner mx-auto' size={40}/>
        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Goals</SubHeading>
        <Loader className='spinner mx-auto' size={40}/>
        <SecondaryButton disabled onClick={()=>null} className='relative flex justify-between items-center mx-auto px-4 my-4 min-w-48 opacity-50'>Add Goal</SecondaryButton>
        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Resources</SubHeading>
        <SecondaryButton disabled onClick={()=>null} className='relative flex justify-between items-center mx-auto px-4 my-4 min-w-48 opacity-50'>Add Resource</SecondaryButton>
        <Loader className='spinner mx-auto' size={40}/>
    </>
  )
}

export default StudentRecordsSkeleton