'use client'

import { simpleTimeString } from '@/app/_utils/dates'
import { Enrollee, weeklyTotal } from '@/app/types'
import DeleteStudentButton from '@/app/(pages)/teachers/[id]/_components/DeleteStudentButton'
import EditStudentButton from '@/app/(pages)/teachers/[id]/_components/EditStudentButton'
import Elipsis from '@/app/_ui_components/layout/Elipsis'
import UnreadMessageNotification from '@/app/_ui_components/UnreadMessageNotification'
import { EllipsisVertical, QrCode } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { fetchGroup, fetchWeekHistory } from '../actions'
import BarGraph from './BarGraph'

function StudentDetailsHeader({student, onUpdate, onDelete}: {student: Enrollee, onUpdate: (s: Enrollee)=>void, onDelete: (s: Enrollee)=>void}) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const popup = useRef<HTMLDivElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const groupName = useRef('No Group Assigned')
  const weekHistory = useRef<weeklyTotal[]>([])

  useEffect(()=>{
    if (student.group_id == null) return;
    setIsLoading(true)
    fetchGroup(student.teacher_id, student.group_id)
      .then(group => groupName.current = group.name)
      .catch(err => console.error(err))
      .finally(()=>setIsLoading(false))
    fetchWeekHistory(student.id)
      .then(history => weekHistory.current = history.slice(0, 5))
      .catch(err => console.error(err))
  }, [student])

  function togglePopup(){
    setIsOpen(o => !o)
  }

  const handleEdit = (s: Enrollee)=>{
    onUpdate(s);
    student = s;
    togglePopup();
  }
  const handleDelete = ()=>{
    onDelete(student);
    togglePopup();
  }

  useEffect(()=>{
    const outsideClick = (e: MouseEvent)=>{
        const target = e.target as HTMLElement;
        if (container.current !== target && !container.current?.contains(target)) {
            setIsOpen(false)
        }
      }
      window.addEventListener('click', outsideClick)

      return ()=>window.removeEventListener('click', outsideClick)
  }, [])

  return (
    <>
    <div className="flex gap-2 justify-between items-start mb-4" id='detailsHeader'>
      <h3 className="font-golos font-bold text-lg grid md:text-2xl">
        <span>{student.name}</span>
        <span className="text-sm font-inter font-light md:text-xl">
          {student.subject} - {student.duration} min
        </span>
      </h3>
      <div className="flex gap-2">
        <Link
          href={`/students/${student.id}/messages`}
          className="text-teal-500"
        >
            <UnreadMessageNotification
              student_id={student.id}
              size={40}
            />
        </Link>
        <Link
          href={`/students/${student.id}/qr_code?code=${student.code}&time=${new Date(student.created_at).getTime()}`}
          className="text-teal-500"
        >
          <QrCode
            size={40}
            className="transition-all hover:text-teal-300 hover:scale-105"
          />
        </Link>
        <div ref={container} className='relative -mx-1' >
          <button onClick={togglePopup}>
            <EllipsisVertical aria-label='Options' size={40} className='text-txtprimary transition-all hover:text-white hover:scale-105' />
          </button>
          <div ref={popup} className="absolute right-3/4 bottom-3/4 w-[54px] h-[98px] grid gap-2 p-2 rounded-xl transition-all origin-bottom-right bg-background/90 shadow-xl border-[1px] border-white/25" style={{scale: isOpen ? 1 : 0}}>
            <EditStudentButton onUpdate={handleEdit} onCancel={()=>togglePopup()} student={student}/>
            <DeleteStudentButton student={student} onDelete={handleDelete} onCancel={()=>togglePopup()} />
          </div>
        </div>
      </div>
    </div>
    <div className="w-full text-zinc-400 font-light font-inter flex justify-between mb-2">
      <span>{days[parseInt(student.day_of_week)]}s at {simpleTimeString(student.time_of_day)}</span>
      <span>{isLoading ? <Elipsis /> : groupName.current}</span>
    </div>
    {weekHistory.current.length > 0 && <BarGraph data={[...weekHistory.current.map(week => parseInt(week.weekly_total))]} labels={[...weekHistory.current.map(week => week.lesson_week_start.substring(5, 10))]} data_labels={[...weekHistory.current.map(week => Math.floor(parseInt(week.weekly_total) / 60)+'m')]}/>}

    </>
  )
}

export default StudentDetailsHeader