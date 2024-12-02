'use client'

import { Goal } from '@/app/types'
import React from 'react'
import { CheckCircle, Circle } from 'lucide-react'

function StudentGoalDisplay({goal}: {goal: Goal}) {

  return (
    <div 
        className='relative w-full grid grid-cols-[2rem_1fr] items-center px-4 py-2 border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm'
        style={{opacity: goal.is_complete ? '0.5' : '1'}}
    > 
        <div className="grid place-items-center justify-start">
            {goal.is_complete ? <CheckCircle /> : <Circle />}
        </div>
        <div>
            <h4>{goal.goal_title}</h4>
            {!goal.is_complete && <p className='text-txtsecondary font-light'>{goal.goal_content}</p>}
        </div>
    </div>
  )
}

export default StudentGoalDisplay