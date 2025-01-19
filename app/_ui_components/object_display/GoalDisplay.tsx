'use client'

import { Goal } from '@/app/types'
import React from 'react'
import GoalCheck from './GoalCheck'
import { useUser } from '@/app/_hooks/useUser'
import { CheckCircle, Trash } from 'lucide-react'

function GoalDisplay({goal, onUpdate, onDelete}: {goal: Goal, onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
    const {user} = useUser();

    async function handleDelete() {
        fetch(`/api/students/${goal.student_id}/goals/${goal.id}`, {method: 'DELETE', credentials: 'include'})
        .then(res => {
            if (res.ok) {
                onDelete(goal.id);
            }
        }).catch(err => {
            console.error(err);
        })
    }
  return (
    <li 
        className='relative w-full grid grid-cols-[2rem_1fr_2rem] items-center px-4 py-2 bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded shadow-sm'
        style={{opacity: goal.is_complete ? '0.3' : '1', filter: goal.is_complete ? 'brightness(50%)' : 'brightness(100%)'}}
    > 
        <div className="grid place-items-center justify-start">
            {user.id != goal.student_id  ? <GoalCheck goal={goal} onUpdate={onUpdate}/> : <CheckCircle aria-label='Empty Checkbox'/>}
        </div>
        <div>
            <h4>{goal.goal_title}</h4>
            {!goal.is_complete && <p className='text-zinc-400 font-light'>{goal.goal_content}</p>}
        </div>
        {user.id != goal.student_id && 
        <button className='grid place-items-center' onClick={handleDelete}>
            <Trash aria-label="Trash Can"  className='brightness-90 cursor-pointer transition-all hover:scale-105 hover:brightness-105'/>
        </button>}
    </li>
  )
}

export default GoalDisplay