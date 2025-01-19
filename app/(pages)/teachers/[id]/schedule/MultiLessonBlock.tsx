'use client'

import { simpleTimeString } from '@/app/_utils/dates'
import { Enrollee } from '@/app/types'
import React, { useEffect, useRef, useState } from 'react'
import LessonBlock from './LessonBlock';
import { ChevronsLeft, ChevronsRight, XCircle } from 'lucide-react';
import EmptyBlock from './EmptyBlock';

function MultiLessonBlock({students, onClick}: {students: Enrollee[], onClick?: (student_id: string)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null)
    function toggleOpen() {
        setIsOpen(o => !o);
    }
    useEffect(()=>{
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen])
  return (
    <>
        <button className='w-full bg-black rounded border-[1px] border-teal-500 p-1' style={{flexGrow: 2}} onClick={toggleOpen}>
            <p className='text-xs'>{simpleTimeString(students[0].time_of_day)}</p>
            <p className='text-center flex items-center justify-center gap-2'><ChevronsLeft /> {students.length}X <ChevronsRight /></p>
        </button>
        <dialog ref={modalRef} className='modalStyle border-[1px] border-white/25 rounded-xl'>

            <div className="w-[300px] min-h-[400px] relative flex flex-col gap-2 px-4 py-8 relative">
                <EmptyBlock flex={1} />
                <button className='absolute top-2 right-2' onClick={toggleOpen}>
                    <XCircle aria-label='Close' color='#ffffff88'/>
                </button>
                {students.map(s => <LessonBlock key={s.id} student={s} onClick={onClick}/>)}
                <EmptyBlock flex={1} />
            </div>
        </dialog>
    </>
  )
}

export default MultiLessonBlock