'use client'

import { Goal } from '@/app/types'
import React from 'react'
import GoalCheck from './GoalCheck'
import { useUser } from '@/app/_usercontext/useUser'
import { CheckCircle, Trash } from 'lucide-react'

function GoalDisplay({goal, onUpdate, onDelete}: {goal: Goal, onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
    const {user} = useUser();

    async function handleDelete() {
        fetch(`/api/goals/${goal.id}`, {method: 'DELETE', credentials: 'include'})
        .then(res => {
            if (res.ok) {
                onDelete(goal.id);
            }
        }).catch(err => {
            console.error(err);
        })
    }
  return (
    <div 
        className='relative w-full grid grid-cols-[2rem_1fr_2rem] items-center px-4 py-2 border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm'
        style={{opacity: goal.is_complete ? '0.5' : '1'}}
    > 
        <div className="grid place-items-center justify-start">
            {user.id != goal.student_id  ? <GoalCheck goal={goal} onUpdate={onUpdate}/> : <CheckCircle />}
        </div>
        <div>
            <h4>{goal.goal_title}</h4>
            {!goal.is_complete && <p className='text-txtsecondary font-light'>{goal.goal_content}</p>}
        </div>
        {user.id != goal.student_id && 
        <div className='grid place-items-center'>
            <Trash onClick={handleDelete}/>
        </div>}
    </div>
  )
}

export default GoalDisplay