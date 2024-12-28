import { Goal } from '@/app/types';
import Elipsis from '@/app/ui/components/Elipsis';
import GoalDisplay from '@/app/ui/components/GoalDisplay';
import SubHeading from '@/app/ui/components/SubHeading';
import React from 'react'

function GoalsManager({goals, onUpdate, onDelete}: {goals?: Goal[], onUpdate: (g: Goal)=>void, onDelete: (id: string)=>void}) {
  
  return (
    <>
        <SubHeading className="mb-1 mt-2">Goals</SubHeading>
        {!goals && <p>Loading <Elipsis/></p>}
        {goals?.map(g => <GoalDisplay goal={g} key={g.id} onUpdate={onUpdate} onDelete={onDelete}/>)}
        
    </>
  )
}

export default GoalsManager