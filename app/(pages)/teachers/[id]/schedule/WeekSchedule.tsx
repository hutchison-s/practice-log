'use client'
import { Enrollee } from '@/app/types'
import React from 'react'
import ResponsiveDaySchedule from './ResponsiveDaySchedule';
import EmptyDay from './EmptyDay';

function WeekSchedule({studentList}: {studentList: Enrollee[]}) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const hours = [...studentList.map(s => parseInt(s.time_of_day.substring(0, 2)))]
    const minHour = Math.min(...hours) - 1;
    const maxHour = Math.max(...hours) + 2;
    const rows = {start: (minHour * 4), end: (maxHour * 4)}
  return (
    <>
        <section className='w-full flex flex-wrap gap-2 md:gap-0 md:flex-nowrap md:h-[600px] border-[1px] border-white/25 border-l-transparent border-top-transparent rounded font-inter'>
            {days.map((dayTitle, index) => {
                const filtered = studentList.filter(s => parseInt(s.day_of_week) == index);
                return filtered.length == 0 ? <EmptyDay dayTitle={dayTitle} key={index}/> : <ResponsiveDaySchedule key={index} rows={rows} dayTitle={dayTitle} students={filtered} onSelect={undefined}/>
            })}
        </section>
    </>
  )
}

export default WeekSchedule