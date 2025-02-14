'use client'

import { Enrollee, Group, LibraryResource } from '@/app/types';
import React, { FormEventHandler, useEffect, useState } from 'react'
import AssigneeDisplay from './GoalAssignee';
import { useStudents } from './StudentContext';
import { useGroups } from './GroupContext';
import ControlledModalForm from '@/app/_ui_components/forms/ControlledModalForm';
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons';

function AssignResourceModal({resource, assignTo, closeModal}: {resource: LibraryResource, assignTo: 'students' | 'groups' | null, closeModal: ()=>void}) {
    
    const students = useStudents();
    const groups = useGroups();

    const handleAssignment: FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault()
        const fd = new FormData(e.currentTarget);
        const ids = Array.from(fd.values());
        console.log('shared with', ids);
        closeModal();
    }
    const handleGroupAssignment = (g: Group) => {
        console.log('shared with ', g.name);
        closeModal();
    }


    

    function AssignToStudents() {
        const [assignees, setAssignees] = useState<Enrollee[]>([])

        useEffect(()=>{
            fetch(`/api/teachers/${resource.teacher_id}/library/resources/${resource.id}/assignee`).then(res => res.json()).then(json => setAssignees(json.data))
        }, [students])

        return (

            <ul className='w-fit min-w-60 mx-auto max-h-[400px]'>
                    
                    {students.map(
                        s => <AssigneeDisplay 
                                student={s} 
                                isAssigned={assignees.find(a => a.id == s.id) !== undefined} 
                                key={s.id} />
                    )}
            </ul>
        )
    }

    function AssignToGroups() {

        return (

            <div className='w-fit min-w-60 mx-auto grid gap-2 max-h-[400px]'>
                    {groups.map(
                        g => <PrimaryButton key={g.id} type='button' onClick={()=>{handleGroupAssignment(g)}} >{g.name}</PrimaryButton>
                    )}
            </div>
        )
    }

    if (!assignTo) return null;
    return (
        <>   
            <ControlledModalForm isOpen={assignTo == 'students'} handleSubmit={handleAssignment}>
                <p className='text-zinc-400 my-2 text-center'>Share &apos;{resource.title}&apos; with:</p>
                <AssignToStudents />
                <div className="w-full flex gap-2 items-center">
                    <PrimaryButton type='submit' size='sm' className='h-full grow'>Save</PrimaryButton>
                    <SecondaryButton type='reset' onClick={closeModal} size='sm' className='h-full grow'>Cancel</SecondaryButton>
                </div>
            </ControlledModalForm>
            <ControlledModalForm isOpen={assignTo == 'groups'} handleSubmit={handleAssignment}>
                <p className='text-zinc-400 my-2 text-center'>Share &apos;{resource.title}&apos; with:</p>
                <AssignToGroups />
                <SecondaryButton type='reset' onClick={closeModal} className='w-fit mx-auto' size='sm'>Cancel</SecondaryButton>
            </ControlledModalForm>
        </>
    )

}

export default AssignResourceModal