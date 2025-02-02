'use client'

import { Goals } from '@/app/api/_controllers/tableControllers';
import { Goal } from '@/app/types'
import { CheckCircle, Circle, Loader } from 'lucide-react';
import React, { useState } from 'react'

function GoalCheck({goal, onUpdate}: {goal: Goal, onUpdate: (g: Goal)=>void}) {
    const [isChanging, setIsChanging] = useState(false);

    async function toggleCheck() {
        setIsChanging(true);
        Goals(goal.student_id).updateOne(goal.id, {
            ...goal,
            is_complete: !goal.is_complete
        }).then(updated => {
            onUpdate(updated)
        }).catch(err => {
            console.error(err);
        }).finally(()=>{
            setIsChanging(false);
        })
    }

  return (
    isChanging 
        ? <Loader aria-label="Loader" className='animate-spin'/>
        : goal?.is_complete
                ? <CheckCircle aria-label='Check Mark' role='checkbox' tabIndex={0} onClick={toggleCheck} onKeyUp={(e)=>{if(e.key == 'Enter') {toggleCheck()}}} className='text-teal-500 cursor-pointer rounded-full transition-all hover:bg-white/10' />
                : <Circle aria-label="Empty Checkbox"role='checkbox' tabIndex={0} onClick={toggleCheck} onKeyUp={(e)=>{if(e.key == 'Enter') {toggleCheck()}}} className='text-white/50 cursor-pointer rounded-full transition-all hover:bg-white/10' />
          
    )
}

export default GoalCheck