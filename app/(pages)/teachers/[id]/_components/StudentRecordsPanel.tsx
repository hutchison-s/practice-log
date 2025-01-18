'use client'

import { AssociatedStudentRecords } from '@/app/_reducers/studentBrowserReducer'
import { Goal, Resource, StateController } from '@/app/types'
import FeaturedText from '@/app/ui/components/FeaturedText'
import { AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import LogManager from './LogManager'
import GoalsManager from './GoalsManager'
import ResourcesManager from './ResourcesManager'
import { fetchStudentRecords } from '../actions'
import NewResourceButton from '@/app/ui/components/NewResourceButton'
import NewGoalButton from '@/app/ui/components/NewGoalButton'
import SubHeading from '@/app/ui/components/SubHeading'
import StudentRecordsSkeleton from './StudentRecordsSkeleton'

function StudentRecordsPanel({student_id, records, recordsController, goalController, resourceController}: {student_id: string, records: AssociatedStudentRecords | null, recordsController: {set: (rec: AssociatedStudentRecords)=>void, clear: ()=>void}, goalController: StateController<Goal>, resourceController: StateController<Resource>}) {
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        setIsLoading(true);
        fetchStudentRecords(student_id, 3)
            .then(recs => {
                recordsController.set(recs);
            })
            .catch(err => {
                console.error(err);
                setHasError(true);
            })
            .finally(()=>setIsLoading(false))
    }, [student_id])

    const handleGoalDelete = (gid: string) => {
        setIsLoading(true)
        const targetGoal = records?.goals.find(g => g.id == gid);
        if (!targetGoal) return;
        goalController.delete(targetGoal);
        setIsLoading(false);
    }
    const handleResourceDelete = (rid: string) => {
        setIsLoading(true)
        const targetResource = records?.resources.find(r => r.id == rid);
        if (!targetResource) return;
        resourceController.delete(targetResource);
        setIsLoading(false);
    }
    if (!records) return null;
    return (
        isLoading
            ? <StudentRecordsSkeleton />
            : hasError
                ?   <>
                        <FeaturedText className='text-center'>Could not load info</FeaturedText>
                        <AlertCircle size={80} className='mx-auto my-4'/>
                    </>
                :   <>
                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Recent Logs</SubHeading>
                        <LogManager logs={records.logs}/>
                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Goals</SubHeading>
                        <GoalsManager goals={records.goals} onDelete={handleGoalDelete} onUpdate={goalController.update}/>
                        <NewGoalButton student_id={student_id} onCreate={goalController.add} />
                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Resources</SubHeading>
                        <ResourcesManager resources={records.resources} onDelete={handleResourceDelete}/>
                        <NewResourceButton student_id={student_id} onCreate={resourceController.add} />
                    </>
    )
}

export default StudentRecordsPanel