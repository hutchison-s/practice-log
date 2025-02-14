'use client'
import { Enrollee } from '@/app/types'
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

function AssigneeDisplay({student, isAssigned}: {student: Enrollee, isAssigned: boolean}) {
  const [isChecked, setIsChecked] = useState(isAssigned);

  useEffect(()=>{
    setIsChecked(isAssigned)
  }, [isAssigned])

    // TODO
    // Add toggleAssignment as funciton to accept as parameter and change span to toggle on click
  return (
    <label className='hover:bg-indigo-800 p-1 rounded my-1 flex justify-between'>
        <span>{student.name}</span>
        <input type="checkbox" name={student.id+'-assignee'} value={student.id} id={student.id+'-assignee'} className='hidden' onChange={(e)=>setIsChecked(e.currentTarget.checked)} checked={isChecked}/>
        <span className={`${isChecked ? 'bg-teal-700' : 'bg-none'} border-[1px] border-white/25 rounded p-1 grid place-items-center size-6`}>
          {isChecked && <Check size={12} strokeWidth={4} color='white'/>}
        </span>
    </label>
  )
}

export default AssigneeDisplay