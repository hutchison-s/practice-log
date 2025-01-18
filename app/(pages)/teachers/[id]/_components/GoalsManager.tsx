import { Goal } from '@/app/types';
import React from 'react'
import GoalsList from '../../../../ui/components/GoalsList';
import Link from 'next/link';

function GoalsManager({goals, onUpdate, onDelete}: {goals?: Goal[], onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
  if (!goals) return <p>Loading Goals...</p>
  return (
    <>
        
        {goals && <GoalsList goals={goals} onDelete={onDelete} onUpdate={onUpdate} />}
        {goals.length > 2 && <Link href={`/students/${goals[0].student_id}/goals`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View All Goals</Link>}
        
    </>
  )
}

export default GoalsManager