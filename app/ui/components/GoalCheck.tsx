'use client'

import { Goal } from '@/app/types'
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import React, { useState } from 'react'

function GoalCheck({goal, onUpdate}: {goal: Goal, onUpdate: (g: Goal)=>void}) {
    const [isChanging, setIsChanging] = useState(false);

    async function toggleCheck() {
        setIsChanging(true);
        fetch(`/api/students/${goal.student_id}/goals/${goal.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(
                {
                    ...goal,
                    is_complete: !goal.is_complete
                }

            )
        }).then(res => {
            if (!res.ok) {
                throw new Error('Bad response from server')
            }
            return res.json();
        }).then(json => {
            onUpdate(json.data)
        }).catch(err => {
            console.error(err);
        }).finally(()=>{
            setIsChanging(false);
        })
    }

  return (
    isChanging 
        ? <Loader2 className='animate-spin'/>
        : goal?.is_complete
                ? <CheckCircle onClick={toggleCheck} className='text-teal-500 cursor-pointer rounded-full transition-all hover:bg-white/10' />
                : <Circle onClick={toggleCheck} className='text-white/50 cursor-pointer rounded-full transition-all hover:bg-white/10' />
          
    )
}

export default GoalCheck