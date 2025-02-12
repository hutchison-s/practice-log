'use client'

import React, { ChangeEventHandler, useEffect, useState } from 'react'
import PopupMenu from './PopupMenu'
import { UserRoundPlus } from 'lucide-react'
import { Enrollee, LibraryResource } from '@/app/types'
import { useStudents } from './StudentContext'
import { useGroups } from './GroupContext'
import RadioLabel from '@/app/_ui_components/RadioLabel'
import AssigneeDisplay from './GoalAssignee'

type viewType = 'students' | 'groups';

function AssignResourceButton({resource}: {resource: LibraryResource}) {
    const students = useStudents();
    const groups = useGroups();
    const [viewing, setViewing] = useState<viewType>('students');
    const [assignees, setAssignees] = useState<Enrollee[]>([]);

    const handleViewChange: ChangeEventHandler<HTMLInputElement> = (e)=>{
        setViewing(e.currentTarget.value as viewType)
    }
    useEffect(()=>{
        fetch(`/api/teachers/${resource.teacher_id}/library/resources/${resource.id}/assignee`).then(res => res.json()).then(json => setAssignees(json.data))
    }, [students])
    
  return (
    <PopupMenu clickable={<UserRoundPlus />}>
        <ul className='w-fit min-w-60'>
            <p className='text-zinc-400 my-2 text-center'>Assign {resource.type.split('/')[0]} &apos;{resource.title}&apos; to:</p>
            <div className="grid grid-cols-2 rounded">
                <RadioLabel label='students' name={`viewing-${resource.id}`} onChange={handleViewChange} value='students' defaultChecked/>
                <RadioLabel label='groups' name={`viewing-${resource.id}`} onChange={handleViewChange} value='groups' />
            </div>
            {viewing == 'students' 
                ? students.map(s => <AssigneeDisplay student={s} isAssigned={assignees.find(a => a.id == s.id) !== undefined} key={s.id} />)
                : groups.map(g => (
                    <li key={g.id} className='hover:bg-indigo-950 p-1 rounded my-1'>
                        {g.name}
                    </li>
                ))
            }
        </ul>
    </PopupMenu>
  )
}

export default AssignResourceButton