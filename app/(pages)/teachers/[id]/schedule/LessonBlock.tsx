'use client'

import { simpleTimeString } from '@/app/_utils/dates'
import { Enrollee } from '@/app/types'
import { useRouter } from 'next/navigation';

function LessonBlock({flex, student, onClick}: {flex: number, student: Enrollee, onClick?: (student_id: string)=>void}) {
  const router = useRouter();
  return (
    <button onClick={
      onClick ? ()=>onClick(student.id) : ()=>{router.push(`/teachers/${student.teacher_id}?student=${student.id}`)}
    }
        className='w-full h-full grid grid-rows-[16px_1fr] rounded-lg p-[0.15rem] border-[1px] border-white/25 text-txtprimary shadow-[0_0_20px_#00000055_inset,0_0_4px_#00000085_inset]'
        style={{gridRow: `span ${flex}`, backgroundImage: `linear-gradient(135deg, ${student.group_color}, ${student.group_color}33)`, boxSizing: 'border-box'}}>
        <div className="text-xs flex gap-1 justify-between w-full">
          <p className='shrink-0 text-nowrap text-left flex-1/2'>{simpleTimeString(student.time_of_day)}</p>
          <p className='text-right shrink truncate flex-1/2'>{student.name}</p>
        </div>
        <h4 className='text-center text-xs text-light grid place-items-center h-full -mt-[0.1rem]'>{student.subject}</h4>
    </button>
  )
}

export default LessonBlock