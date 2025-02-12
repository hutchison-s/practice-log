'use client'
import { Enrollee } from '@/app/types'
import { Check } from 'lucide-react';

function AssigneeDisplay({student, isAssigned}: {student: Enrollee, isAssigned: boolean}) {

    // TODO
    // Add toggleAssignment as funciton to accept as parameter and change span to toggle on click
  return (
    <li className='hover:bg-indigo-950 p-1 rounded my-1 flex justify-between'>
        <span>{student.name}</span>
        <span className={`${isAssigned ? 'bg-teal-500' : 'bg-none'} border-[1px] border-white/25 rounded p-1 grid place-items-center size-6`}>{isAssigned && <Check size={12}/>}</span>
    </li>
  )
}

export default AssigneeDisplay