'use client'
import { Enrollee } from '@/app/types'
import React from 'react'
import ResponsiveDaySchedule from '../schedule/ResponsiveDaySchedule';

function StudentScheduleList({students, disabled, onSelect}: {students: Enrollee[], disabled?: boolean, onSelect: (student_id: string)=>void}) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const hours = [...students.map(s => parseInt(s.time_of_day.substring(0, 2)))]
    const minHour = Math.min(...hours);
    const maxHour = Math.max(...hours) + 2;
    const rows = {start: (minHour * 4) - 1, end: (maxHour * 4)}
  return (
    <>
        <section className='w-full lg:col-span-3 flex flex-wrap gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none md:gap-0 md:flex-nowrap md:h-full font-inter'>
            {days.map((dayTitle, index) => {
                const filtered = students.filter(s => parseInt(s.day_of_week) == index);
                return filtered.length != 0 && <ResponsiveDaySchedule key={index} rows={rows} dayTitle={dayTitle} students={filtered} onSelect={(student_id: string)=>{if (!disabled) onSelect(student_id)}}/>
            })}
        </section>
    </>
  )
}

export default StudentScheduleList