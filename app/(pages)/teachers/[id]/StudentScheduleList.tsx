'use client'
import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import React from 'react'
import ResponsiveDaySchedule from './schedule/ResponsiveDaySchedule';

function StudentScheduleList({studentList, onSelect}: {studentList: EnrolleeWithCurrentWeekPractice[], onSelect: (s: EnrolleeWithCurrentWeekPractice)=>void}) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return (
    <>
        <section className='w-full flex flex-wrap max-w-[600px] gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none md:gap-0 md:flex-nowrap md:h-[600px] font-inter'>
            {days.map((dayTitle, index) => {
                const filtered = studentList.filter(s => parseInt(s.day_of_week) == index);
                return filtered.length != 0 && <ResponsiveDaySchedule key={index} dayTitle={dayTitle} students={filtered} onSelect={onSelect}/>
            })}
        </section>
    </>
  )
}

export default StudentScheduleList