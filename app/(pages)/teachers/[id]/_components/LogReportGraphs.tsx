'use client'

import SubHeading from '@/app/_ui_components/layout/SubHeading';
import { Group, StudentWeekReport } from '@/app/types'
import React, { ChangeEventHandler, useEffect, useState } from 'react'
import BarGraph from './BarGraph';
import BodyText from '@/app/_ui_components/layout/BodyText';

type enrollment = {name: string, subject: string, group: string}
type rowCollection = {
    enrollment: enrollment,
    rows: StudentWeekReport[]
}[]

function StudentSection({name, subject, children}: {name: string, subject: string, children: React.ReactNode}) {
    return( 
        <div className='p-2 rounded-xl glass w-full student-graph max-w-[800px] print:max-w-full'>
            <SubHeading className='flex justify-between w-full items-end'>{name} <span className='font-light text-zinc-400 text-sm'>{subject}</span></SubHeading>
            {children}
        </div>
    )
}

function StudentGraph({rows}: {rows: StudentWeekReport[]}) {
    return (
        <>
            <BodyText className='text-left w-full mx-0'>Average weekly minutes: {Math.floor((rows.reduce((acc, val)=>acc + Number(val.mins), 0) / rows.length) * 10) / 10}</BodyText>
            <BarGraph data={rows.map(r => r.mins)} data_labels={rows.map(r => r.grade+"%")} labels={rows.map(r => r.week.split(',')[0])} />
        </>
    )
}

function LogReportGraphs({rows, groups}: {rows: StudentWeekReport[], groups: Group[]}) {
    const [collection, setCollection] = useState<rowCollection>([]);
    const [searchVal, setSearchVal] = useState<string>('.')
    const [groupVal, setGroupVal] = useState<string>('.')


    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e)=>{
        const val = e.target.value;
        setSearchVal(val !== '' ? val : '.')
    }

    const handleGroupFilter: ChangeEventHandler<HTMLSelectElement> = (e) => {
        setGroupVal(e.target.value);
    }

    useEffect(()=>{
        setCollection(prev => {
            const temp = [...prev]
           for (const row of rows) {
                if (!temp.find(ea => ea.enrollment.name == row.name && ea.enrollment.subject == row.subject)) {
                    temp.push({enrollment: {name: row.name, subject: row.subject, group: row.group || 'none'}, rows: rows.filter(r => r.name == row.name && r.subject == row.subject)})
                }
            }
            return temp; 
        })
        

    }, [])

    
  return (
    <div className='flex flex-wrap gap-4 justify-center'>
        <div className="w-full flex justify-start p-2 gap-2 flex-wrap max-w-[800px] md:flex-nowrap">
            <label className='w-full flex gap-2 items-center justify-start shrink-1 md:w-fit'>
                <span>Search for a student: </span>
                <input type="search" name="search" placeholder='Student Name...' onChange={handleSearchChange} className='grow-1 md:grow-0 flex-1 bg-background/50 p-1 rounded border-[1px] border-white/25 text-zinc-400 w-40 lg:w-80'/>
            </label>
            <label className='w-full flex gap-2 items-center justify-start shrink-1 md:w-fit'>
                <span>Filter by group: </span>
                <select name="groupFilter" onChange={handleGroupFilter} value={groupVal} className='grow-1 md:grow-0 flex-1 bg-background/50 p-1 rounded border-[1px] border-white/25 text-zinc-400 w-40 lg:w-80'>
                    <option value='.'>All Students</option>
                    {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                </select>
            </label>
        </div>
        {collection.filter(each => new RegExp(searchVal, 'gi').test(each.enrollment.name) && new RegExp(groupVal, 'gi').test(each.enrollment.group)).map((rc, i) => 
        <StudentSection key={i} name={rc.enrollment.name} subject={rc.enrollment.subject}>
            <StudentGraph rows={rc.rows} />
        </StudentSection>)}
    </div>
  )
}

export default LogReportGraphs