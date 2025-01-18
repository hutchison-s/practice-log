'use client'

import { simpleTimeString } from '@/app/_functions/dates'
import { Enrollee } from '@/app/types'
import DeleteStudentButton from '@/app/(pages)/teachers/[id]/_components/DeleteStudentButton'
import EditStudentButton from '@/app/(pages)/teachers/[id]/_components/EditStudentButton'
import Elipsis from '@/app/ui/components/Elipsis'
import UnreadMessageNotification from '@/app/ui/components/UnreadMessageNotification'
import { Delete, EllipsisVertical, QrCode } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { fetchGroup } from '../actions'

function StudentDetailsHeader({student, onUpdate, onDelete}: {student: Enrollee, onUpdate: (s: Enrollee)=>void, onDelete: (s: Enrollee)=>void}) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const popup = useRef<HTMLDivElement>(null)
  const groupName = useRef('No Group Assigned')

  useEffect(()=>{
    if (student.group_id == null) return;
    setIsLoading(true)
    fetchGroup(student.teacher_id, student.group_id)
      .then(group => groupName.current = group.name)
      .catch(err => console.error(err))
      .finally(()=>setIsLoading(false))
  }, [student])

  function togglePopup(){
    setIsOpen(o => !o)
  }

  const handleEdit = ()=>{
    onUpdate(student);
    togglePopup();
  }
  const handleDelete = ()=>{
    onDelete(student);
    togglePopup();
  }
  return (
    <>
    <div className="flex gap-2 justify-between items-start mb-4">
      <h3 className="font-golos font-bold text-lg grid md:text-2xl">
        <span>{student.name}</span>
        <span className="text-sm font-inter font-light md:text-xl">
          {student.subject}
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
        <div className='relative -mx-1' >
          <button onClick={togglePopup}>
            <EllipsisVertical aria-label='Options' size={40} className='text-txtprimary transition-all hover:text-white hover:scale-105' />
          </button>
          <div ref={popup} className="absolute right-3/4 bottom-3/4 w-fit h-fit grid gap-2 p-2 rounded-xl transition-all origin-bottom-right bg-background/90 shadow-xl border-[1px] border-white/25" style={{scale: isOpen ? 1 : 0}}>
            <EditStudentButton onUpdate={handleEdit} onCancel={()=>togglePopup()} student={student}/>
            <DeleteStudentButton student={student} onDelete={handleDelete} onCancel={()=>togglePopup()} />
          </div>
        </div>
      </div>
    </div>
    <div className="w-full text-zinc-400 font-light font-inter flex justify-between">
      <span>{days[parseInt(student.day_of_week)]}s at {simpleTimeString(student.time_of_day)}</span>
      <span>{isLoading ? <Elipsis /> : groupName.current}</span>
    </div>
    </>
  )
}

export default StudentDetailsHeader