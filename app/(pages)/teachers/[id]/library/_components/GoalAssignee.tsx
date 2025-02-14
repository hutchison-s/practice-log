'use client'
import { Enrollee } from '@/app/types'
import { Check, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

function AssigneeDisplay({student, isAssigned}: {student: Enrollee, isAssigned: boolean}) {
  const [isChecked, setIsChecked] = useState<boolean | undefined>();

  useEffect(()=>{
    setIsChecked(isAssigned)
  }, [isAssigned])

  return (
    <label className='hover:bg-indigo-800 p-1 rounded my-1 flex justify-between'>
        <span>{student.name}</span>
        <input type="checkbox" name={student.id+'-assignee'} value={student.id} id={student.id+'-assignee'} className='hidden' onChange={(e)=>setIsChecked(e.currentTarget.checked)} checked={isChecked}/>
        <span className={`${isChecked ? 'bg-teal-700' : 'bg-none'} border-[1px] border-white/25 rounded p-1 grid place-items-center size-6`}>
          {isAssigned == undefined ? <Loader className='animate-spin'/> : isChecked && <Check size={12} strokeWidth={4} color='white'/>}
        </span>
    </label>
  )
}

export default AssigneeDisplay