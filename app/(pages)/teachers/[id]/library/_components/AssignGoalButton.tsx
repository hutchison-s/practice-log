'use client'

import PopupMenu from './PopupMenu'
import { UserRoundPlus } from 'lucide-react'
import { LibraryGoal } from '@/app/types'
import {  PrimaryButton } from '@/app/_ui_components/layout/Buttons'
import { useState } from 'react'
import AssignGoalModal from './AssignGoalModal'



function AssignGoalButton({goal}: {goal: LibraryGoal}) {
    const [isChosen, setIsChosen] = useState<'students' | 'groups' | null>(null);
    
  return (
    <>
        <PopupMenu clickable={<UserRoundPlus />}>
            <PrimaryButton size='sm' className='text-sm min-w-60 my-1' onClick={()=>setIsChosen('students')}>Assign to Student(s)</PrimaryButton>
            <PrimaryButton size='sm' className='text-sm min-w-60 my-1' onClick={()=>setIsChosen('groups')}>Assign to Group(s)</PrimaryButton>
        </PopupMenu>
        <AssignGoalModal goal={goal} assignTo={isChosen} closeModal={()=>setIsChosen(null)}/>
    </>
    
  )
}

export default AssignGoalButton