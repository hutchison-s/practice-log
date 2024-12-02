'use client'

import { Goal } from '@/app/types'
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import React, { useState } from 'react'

function GoalCheck({goal, onUpdate}: {goal: Goal, onUpdate: (g: Goal)=>void}) {
    const [isChanging, setIsChanging] = useState(false);

    async function toggleCheck() {
        setIsChanging(true);
        fetch(`/api/goals/${goal.id}`, {
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
                ? <CheckCircle onClick={toggleCheck}/>
                : <Circle onClick={toggleCheck}/>
          
    )
}

export default GoalCheck