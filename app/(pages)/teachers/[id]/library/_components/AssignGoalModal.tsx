'use client'

import { LibraryGoal, Enrollee, Group } from '@/app/types';
import React, { FormEventHandler, useEffect, useState } from 'react'
import AssigneeDisplay from './GoalAssignee';
import { useStudents } from './StudentContext';
import { useGroups } from './GroupContext';
import ControlledModalForm from '@/app/_ui_components/forms/ControlledModalForm';
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons';
import { Loader } from 'lucide-react';

function AssignGoalModal({goal, assignTo, closeModal}: {goal: LibraryGoal, assignTo: 'students' | 'groups' | null, closeModal: ()=>void}) {
    
    const students = useStudents();
    const groups = useGroups();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const handleAssignment: FormEventHandler<HTMLFormElement> = (e)=>{
        setIsProcessing(true);
        e.preventDefault()
        const fd = new FormData(e.currentTarget);
        const ids = Array.from(fd.values());
        fetch(`/api/teachers/${goal.teacher_id}/library/goals/${goal.id}/assignee`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({student_ids: ids, goal_template: goal})}
        )
            .then(res => res.json())
            .then(() => {
                closeModal();
            }).catch(err => {
                console.error('Post error occured:', err);
            }).finally(()=>{
                setIsProcessing(false);
            })
        
    }
    const handleGroupAssignment = (g: Group) => {
        setIsProcessing(true);
        fetch(`/api/teachers/${goal.teacher_id}/groups/${g.id}/assign_goal`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({goal_template: goal})}
        )
            .then(res => res.json())
            .then(() => {
                closeModal();
            })
            .catch(err => {
                console.error('Post error occured:', err);
            })
            .finally(()=>{
                setIsProcessing(false);
            })
    }


    

    function AssignToStudents() {
        const [assignees, setAssignees] = useState<Enrollee[]>([])

        useEffect(()=>{
            fetch(`/api/teachers/${goal.teacher_id}/library/goals/${goal.id}/assignee`).then(res => res.json()).then(json => setAssignees(json.data))
        }, [students])

        return (
            
            <div className='w-fit min-w-60 mx-auto px-2 max-h-[400px] overflow-y-auto grid gap-1 py-4 mask-y'>
                    
                    {students.map(
                        s => <AssigneeDisplay 
                                student={s} 
                                isAssigned={assignees.find(a => a.id == s.id) !== undefined} 
                                key={s.id} />
                    )}
            </div>
        )
    }

    function AssignToGroups() {

        return (

            <div className='w-fit min-w-60 mx-auto px-2 grid gap-2 max-h-[400px] overflow-y-auto py-4 mask-y'>
                    {groups.map(
                        g => <PrimaryButton key={g.id} type='button' onClick={()=>{handleGroupAssignment(g)}} >{g.name}</PrimaryButton>
                    )}
            </div>
        )
    }

    if (!assignTo) return null;
    return (
        <>   
            <ControlledModalForm isOpen={assignTo !== null} handleSubmit={assignTo == 'students' ? handleAssignment : ()=>null}>
                {isProcessing 
                    ? <Loader size={60} className='animate-spin text-teal-500 m-6 mx-auto'/>
                    : <>
                        <p className='text-zinc-400 my-2 text-center'>Assign &apos;{goal.title}&apos; to:</p>
                        {assignTo == 'students' ? <AssignToStudents /> : <AssignToGroups />}
                        <div className="w-full flex gap-2 items-center">
                            {assignTo == 'students' && <PrimaryButton type='submit' size='sm' className='h-full grow'>Save</PrimaryButton>}
                            <SecondaryButton type='reset' onClick={closeModal} size='sm' className='h-full grow'>Cancel</SecondaryButton>
                        </div>
                      </>
                }
                
            </ControlledModalForm>
        </>
    )

}

export default AssignGoalModal