import { Goal } from '@/app/types';
import React from 'react'
import GoalsList from '../../../../_ui_components/object_display/GoalsList';
import Link from 'next/link';

function GoalsManager({student_id, goals, onUpdate, onDelete}: {student_id: string, goals?: Goal[], onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
  if (!goals) return <p>Loading Goals...</p>
  return (
    <>
        
        {goals && <GoalsList goals={goals} onDelete={onDelete} onUpdate={onUpdate} />}
        {goals && <Link href={`/students/${student_id}/goals`} className='text-lighter underline block w-full text-right font-light text-sm p-2'>View All Goals</Link>}
        
    </>
  )
}

export default GoalsManager