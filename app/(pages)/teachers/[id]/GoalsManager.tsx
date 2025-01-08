import { Goal } from '@/app/types';
import Elipsis from '@/app/ui/components/Elipsis';
import GoalDisplay from '@/app/ui/components/GoalDisplay';
import React from 'react'

function GoalsManager({goals, onUpdate, onDelete}: {goals?: Goal[], onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
  
  return (
    <>
        
        {!goals && <p>Loading <Elipsis/></p>}
        {goals && <ul className='grid gap-2'>{goals?.map(g => <GoalDisplay goal={g} key={g.id} onUpdate={onUpdate} onDelete={onDelete}/>)}</ul>}
        
    </>
  )
}

export default GoalsManager