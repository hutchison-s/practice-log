'use client'

import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import React, { useEffect, useState } from 'react'
import EmptyBlock from './EmptyBlock';
import LessonBlock from './LessonBlock';
import MultiLessonBlock from './MultiLessonBlock';
import { ChevronDown, ChevronUp } from 'lucide-react';

function ResponsiveDaySchedule({dayTitle, students, onSelect}: {dayTitle: string, students: EnrolleeWithCurrentWeekPractice[], onSelect?: (s:EnrolleeWithCurrentWeekPractice)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(400);
    const getHour = (idx: number) => Math.floor((idx * 15) / 60) + 7;
    const getMin = (idx: number) => (idx * 15) % 60;
    const formatTime = (idx: number): string => {
        const h = getHour(idx);
        const m = getMin(idx);
        return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}`: m}`
    }
    function Blocks() {
        const blocks = [];
        const rows = 55;
        let streak = false;
        let flex = 1;
        for (let i = 0; i < rows; i++) {
            const occupants = students.filter(s => s.time_of_day.startsWith(formatTime(i)))
            if (occupants.length == 0) {
                streak = true;
                flex++;
                continue;
            } else {
                if (occupants.length > 1) {
                    if (streak) {
                        blocks.push(<EmptyBlock key={i - 1} flex={flex} />);
                        streak = false;
                        flex = 1;
                    }
                    blocks.push(<MultiLessonBlock key={i} students={occupants} onClick={onSelect} />)
                    i++;
                    continue;
                } else {
                    if (streak) {
                        blocks.push(<EmptyBlock key={i - 1} flex={flex} />);
                        streak = false;
                        flex = 1;
                    }
                    blocks.push(<LessonBlock key={i} student={occupants[0]} onClick={onSelect}/>)
                    i++;
                    continue;
                }
            }
        }
        blocks.push(<EmptyBlock key={'final'} flex={flex} />);
        return blocks.map(b=>b)
    }

    function toggleOpen() {
        setIsOpen(o => !o);
    }

    useEffect(()=>{
        const adjustWidth = ()=> {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', adjustWidth);
        adjustWidth();

        return ()=>{
            window.removeEventListener('resize', adjustWidth)
        }

    }, [])
    
  return (
    isOpen || windowWidth > 768
    ? <div className='relative w-full border-[1px] border-white/25 flex flex-col h-[400px] md:h-full'>
        <ChevronUp className='absolute top-3 right-3 z-10 md:hidden' size={24} color='white' role='button' onClick={toggleOpen}/>
        <button onClick={toggleOpen} className='text-lg py-2 text-center glass font-golos font-bold text-txtprimary'>{dayTitle}</button>
        <Blocks />
      </div>
    : <div className='relative w-full border-[1px] border-white/25 flex flex-col h-fit md:h-full'>
        <ChevronDown className='absolute top-3 right-3 z-10' size={24} color='white' role='button' onClick={toggleOpen}/>
        <button onClick={toggleOpen} className='text-lg py-2 text-center glass font-golos font-bold text-txtprimary'>{dayTitle} <span className='font-inter font-light'>- {students.length}</span></button>
      </div>
  )
}

export default ResponsiveDaySchedule