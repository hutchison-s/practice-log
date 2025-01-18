'use client'

import { simpleTimeString } from '@/app/_functions/dates'
import { Enrollee } from '@/app/types'
import { useRouter } from 'next/navigation';

function LessonBlock({student, onClick}: {student: Enrollee, onClick?: (student_id: string)=>void}) {
  const router = useRouter();
  return (
    <button onClick={
      onClick ? ()=>onClick(student.id) : ()=>{router.push(`/teachers/${student.teacher_id}?student=${student.id}`)}
    }
        className='w-full rounded-lg p-1 border-[1px] border-white/25 text-txtprimary shadow-[0_0_20px_#00000055_inset,0_0_4px_#00000085_inset]'
        style={{flex: 30 / 15, backgroundImage: `linear-gradient(135deg, ${student.group_color}, ${student.group_color}33)`}}>
        <div className="text-xs flex gap-1 justify-between w-full"><p className='shrink-0 text-nowrap text-left flex-1/2'>{simpleTimeString(student.time_of_day)}</p><p className='text-right shrink truncate flex-1/2'>{student.subject}</p></div>
        <h4 className='text-center text-sm text-light'>{student.name.substring(0, 10)}{student.name.length > 7 ? '...' : ''}</h4>
    </button>
  )
}

export default LessonBlock