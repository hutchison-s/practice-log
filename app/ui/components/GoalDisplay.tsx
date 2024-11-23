'use client'

import { Goal } from '@/app/types'
import React from 'react'
import GoalCheck from './GoalCheck'
import { useUser } from '@/app/_usercontext/useUser'

function GoalDisplay({goal}: {goal: Goal}) {
    const {user} = useUser();
  return (
    <div 
        className='relative w-full flex justify-between items-center px-4 py-2 border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm'
        style={{opacity: goal.is_complete ? '0.5' : '1'}}
    >
        <div>
            <h4>{goal.goal_title}</h4>
            {!goal.is_complete && <p className='text-txtsecondary font-light'>{goal.goal_content}</p>}
        </div>
        {user.id != goal.student_id && 
        <div>
            <GoalCheck goal={goal}/>
        </div>}
    </div>
  )
}

export default GoalDisplay