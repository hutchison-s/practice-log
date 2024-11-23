'use client'

import { Goal } from '@/app/types'
import React from 'react'
import GoalCheck from './GoalCheck'
import { useUser } from '@/app/_usercontext/useUser'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

function GoalDisplay({goal}: {goal: Goal}) {
    const {user} = useUser();
    const router = useRouter();

    async function handleDelete() {
        fetch(`/api/goals/${goal.id}`, {method: 'DELETE', credentials: 'include'})
        .then(res => {
            if (res.ok) {
                router.refresh();
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
        {user.id != goal.student_id && 
            <div className="grid place-items-center justify-start">
                <GoalCheck goal={goal}/>
            </div>
        }
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