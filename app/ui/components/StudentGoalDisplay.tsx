'use client'

import { Goal } from '@/app/types'
import React from 'react'
import { CheckCircle, Circle } from 'lucide-react'

function StudentGoalDisplay({goal}: {goal: Goal}) {

  return (
    <li 
        className='relative w-full grid grid-cols-[2rem_1fr] items-center px-4 py-2 bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded shadow-sm'
        style={{opacity: goal.is_complete ? '0.5' : '1'}}
    > 
        <div className="grid place-items-center justify-start">
            {goal.is_complete ? <CheckCircle /> : <Circle aria-label="Empty Checkbox"/>}
        </div>
        <div>
            <h4>{goal.goal_title}</h4>
            {!goal.is_complete && <p className='text-txtsecondary font-light'>{goal.goal_content}</p>}
        </div>
    </li>
  )
}

export default StudentGoalDisplay