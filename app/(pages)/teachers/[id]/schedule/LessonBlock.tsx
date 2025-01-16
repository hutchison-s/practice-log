'use client'

import { simpleTimeString } from '@/app/_functions/dates'
import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import { useRouter } from 'next/navigation';

function LessonBlock({student, onClick}: {student: EnrolleeWithCurrentWeekPractice, onClick?: (s:EnrolleeWithCurrentWeekPractice)=>void}) {
  const router = useRouter();
  return (
    <button onClick={
      onClick ? ()=>onClick(student) : ()=>{router.push(`/teachers/${student.teacher_id}?student=${student.id}`)}
    }
        className='w-full p-1 rounded-lg border-[1px] border-white/25 text-txtprimary shadow-[0_0_20px_#00000055_inset,0_0_4px_#00000085_inset]'
        style={{flexGrow: 30 / 15, backgroundImage: `linear-gradient(135deg, ${student.group_color}, ${student.group_color}33)`}}>
        <p className="text-xs pl-1 pt-1">{simpleTimeString(student.time_of_day)}</p>
        <h4 className='text-center'>{student.name}</h4>
    </button>
  )
}

export default LessonBlock