import { Goal } from '@/app/types'
import BodyText from '@/app/_ui_components/layout/BodyText'
import GoalDisplay from '@/app/_ui_components/object_display/GoalDisplay'
import StudentGoalDisplay from '@/app/(pages)/students/[id]/_components/StudentGoalDisplay'
import React from 'react'

function GoalsList({goals, onUpdate, onDelete, isStudentView}: {goals?: Goal[], onUpdate?: (g: Goal)=>void, onDelete?: (id: string)=>void, isStudentView?: boolean}) {
    if (goals && goals.length == 0) {
        return <BodyText className="font-light">No goals yet</BodyText>
    }
    return (
        <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
            {goals?.map(g => {
                if (isStudentView) {
                    return <StudentGoalDisplay key={g.id} goal={g} />
                } else if (onUpdate && onDelete) {
                    return <GoalDisplay key={g.id} goal={g} onDelete={onDelete} onUpdate={onUpdate} />
                }
            })}
        </ul>
    )
    
}

export default GoalsList