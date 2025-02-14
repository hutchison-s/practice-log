'use client'

import PopupMenu from './PopupMenu'
import { UserRoundPlus } from 'lucide-react'
import { LibraryResource } from '@/app/types'
import {  PrimaryButton } from '@/app/_ui_components/layout/Buttons'
import { useState } from 'react'
import AssignResourceModal from './AssignResourceModal'



function AssignResourceButton({resource}: {resource: LibraryResource}) {
    const [isChosen, setIsChosen] = useState<'students' | 'groups' | null>(null);
    
  return (
    <>
        <PopupMenu clickable={<UserRoundPlus />}>
            <PrimaryButton size='sm' className='text-sm min-w-60 my-1' onClick={()=>setIsChosen('students')}>Share with Student(s)</PrimaryButton>
            <PrimaryButton size='sm' className='text-sm min-w-60 my-1' onClick={()=>setIsChosen('groups')}>Share with Group(s)</PrimaryButton>
        </PopupMenu>
        <AssignResourceModal resource={resource} assignTo={isChosen} closeModal={()=>setIsChosen(null)}/>
    </>
    
  )
}

export default AssignResourceButton