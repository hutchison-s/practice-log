'use client'

import { Goal } from '@/app/types'
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function GoalCheck({goal}: {goal: Goal}) {
    const [checked, setChecked] = useState(goal.is_complete);
    const [isChanging, setIsChanging] = useState(false);
    const router = useRouter();

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
            if (res.ok) {
                setChecked(!checked);
                router.refresh();
            }
        }).catch(err => {
            console.error(err);
        }).finally(()=>{
            setIsChanging(false);
        })
    }

  return (
    isChanging 
        ? <Loader2 className='animate-spin'/>
        : checked
                ? <CheckCircle onClick={toggleCheck}/>
                : <Circle onClick={toggleCheck}/>
          
    )
}

export default GoalCheck