import SubHeading from '@/app/_ui_components/layout/SubHeading';
import { StudentWeekReport } from '@/app/types'
import React from 'react'
import BarGraph from './BarGraph';
import BodyText from '@/app/_ui_components/layout/BodyText';

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

function LogReportGraphs({rows}: {rows: StudentWeekReport[]}) {
    const students = Array.from(new Set(rows.map(row => row.student_id)));
    
  return (
    <div className='flex flex-wrap gap-4 justify-center'>
        {students.map((id, i) => 
        <StudentSection key={i} name={rows.find(r => r.student_id == id)!.name} subject={rows.find(r => r.student_id == id)!.subject}>
            <StudentGraph rows={rows.filter(r => r.student_id == id)} />
        </StudentSection>)}
    </div>
  )
}

export default LogReportGraphs