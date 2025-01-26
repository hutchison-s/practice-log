'use client'

import { parse12HourTime, parseDateString } from '@/app/_utils/dates'
import { StudentWeekReport } from '@/app/types'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import React, { ChangeEventHandler, useEffect, useState } from 'react'

const rowStyle = 'w-full grid grid-cols-[3fr_1fr_2fr_2fr_3fr_repeat(3,_1fr)_1.5fr] gap-1 py-1 px-2 divide-x divide-zinc-400/25'
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']



function LogReportTable({rows}: {rows: StudentWeekReport[]}) {
    const [sorted, setSorted] = useState(rows);
    const [orderBy, setOrderBy] = useState<{cat: string, order: 'ASC' | 'DESC'}>({cat: 'name', order: 'ASC'})
    const [filterCategory, setFilterCategory] = useState<string | null>(null)
    const [filterValue, setFilterValue] = useState('.')
    const [displayFilter, setDisplayFilter] = useState(false);

    const sorters: Record<string, (a: StudentWeekReport, b: StudentWeekReport)=>number> =  {
        day: (a: StudentWeekReport, b: StudentWeekReport) => days.indexOf(a.day) < days.indexOf(b.day) ? fixOrder(-1) : fixOrder(1),
        grade: (a: StudentWeekReport, b: StudentWeekReport) => fixOrder(a.grade - b.grade),
        name: (a: StudentWeekReport, b: StudentWeekReport) => a.name.toLowerCase() < b.name.toLowerCase() ? fixOrder(-1) : fixOrder(1),
        time: (a: StudentWeekReport, b: StudentWeekReport) => parse12HourTime(a.time) < parse12HourTime(b.time) ? fixOrder(-1) : fixOrder(1),
        week: (a: StudentWeekReport, b: StudentWeekReport) => parseDateString(a.week) < parseDateString(b.week) ? fixOrder(-1) : fixOrder(1),
        logs: (a: StudentWeekReport, b: StudentWeekReport) => fixOrder(a.logs - b.logs),
        mins: (a: StudentWeekReport, b: StudentWeekReport) => fixOrder(a.mins - b.mins),
        group: (a: StudentWeekReport, b: StudentWeekReport) => (a.group || ' ') < (b.group || ' ') ? fixOrder(-1) : fixOrder(1),
        goal: (a: StudentWeekReport, b: StudentWeekReport) => fixOrder((a.goal || 0) - (b.goal || 0))        
    }

    const fixOrder = (n: number) => {
        return orderBy.order == 'ASC' ? n : n * -1;
    }

    const resort = () => {
        if (!sorted || sorted.length < 2) return;
        if (Object.keys(sorters).includes(orderBy.cat)) {
            setSorted(prev => {
                if (!prev) return prev;
                return [...prev.sort(sorters[orderBy.cat])]
            })
            return;
        }
    }

    const toggleASC = () => {
        setOrderBy(prev => {
            return {
                ...prev,
                order: prev.order == 'ASC' ? 'DESC': 'ASC'
            }
        })
    }

    const sortBy = (k: string) => {
        if (orderBy.cat == k) {
            toggleASC();
            return;
        } else {
            setOrderBy(prev => {
            return {
                ...prev,
                order: 'ASC',
                cat: k
            }
        })
        }
    }

    const updateFilterValue: ChangeEventHandler<HTMLInputElement> = (e)=> {
        setFilterValue(e.target.value == '' ? '.' : e.target.value)
    }

    const updateFilterCategory: ChangeEventHandler<HTMLSelectElement> = (e) => {
        if (e.target.value == 'undefined') {
            setFilterCategory(null);
            return;
        }
        setFilterCategory(e.target.value)
    }

    useEffect(()=>{
        resort()
    }, [orderBy.cat, orderBy.order])
  return (
    <>
    <div className={'w-full flex justify-end items-center transition-all rounded border-2'} style={{borderColor: displayFilter ? '#14b8a6' : 'transparent'}}>
        <div
            className='overflow-hidden flex gap-2 py-1 transition-all'
            style={{flex: displayFilter ? '1' : '0', paddingInline: displayFilter ? '1rem' : '0'}}>
                <div style={{flex: displayFilter ? '1' : '0'}} className='flex flex-wrap lg:flex-nowrap gap-2 md:gap-1 items-center'>
                    <div  className='flex gap-2 items-center flex-[100%] lg:flex-none lg:flex-shrink-1'>
                        <label htmlFor="filterKey">Filter&nbsp;by: </label>
                        <select id='filterKey' name='filterKey' onChange={updateFilterCategory} className='bg-background/50 p-1 rounded border-[1px] border-white/25 text-zinc-400'>
                            <option value={'undefined'}> </option>
                            {Object.keys(rows[0]).map((k) => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div>includes</div>
                        <label htmlFor="filterKey" className='hidden'>Filter Value</label>
                        <input type='text' id='filterKey' name='filterKey' onInput={updateFilterValue} className='bg-background/50 p-1 rounded border-[1px] border-white/25 text-zinc-400 w-40 lg:w-80'/>
                    </div>
                </div>
        </div>
        <button 
            className='border-[1px] border-white/25 rounded p-1 w-[35px]' 
            onClick={()=>setDisplayFilter(df => !df)}>
                <Filter aria-label='filter'/>
        </button>
        
    </div>
        <section className='w-full overflow-x-auto'>
            <table className='w-[1000px] text-left rounded-xl'>
                    <thead >
                        <tr className={rowStyle+' bg-gradient-to-br from-indigo-800 to-indigo-950 text-center border-2 border-zinc-400/25 rounded-xl mb-2'}>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('name')}>
                                    Name
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'name' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('day')}>
                                    Day
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'day' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('time')}>
                                    Time
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'time' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('group')}>
                                    Group
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'group' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('week')}>
                                    Week of
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'week' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('logs')}>
                                    Logs
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'logs' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('goal')}>
                                    Goal
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'goal' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('mins')}>
                                    Mins
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'mins' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                            <th className='px-2'>
                                <button className='relative w-[90%]' onClick={()=>sortBy('grade')}>
                                    Grade
                                    <span className='absolute top-1/2 left-full -translate-y-1/2 text-xs'>
                                        {orderBy.cat == 'grade' && (orderBy.order == 'ASC' ? <ChevronDown size={14} aria-label='ascending' /> : <ChevronUp size={14} aria-label='descending' />)}
                                    </span>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-zinc-400/50'>
                        {(filterCategory && displayFilter
                            ? sorted.filter(row => {
                                    const val = row[filterCategory as keyof StudentWeekReport];
                                    return new RegExp(filterValue.toLowerCase()).test(String(val).toLowerCase())
                                }) 
                            : sorted
                        ).map((row, idx) => {
                            return (
                                <tr key={idx} className={rowStyle}>
                                    <td className='px-1 truncate'>{row.name}</td>
                                    <td className='px-1'>{row.day.substring(0, 3)}</td>
                                    <td className='px-1'>{row.time[0] == '0' ? row.time.substring(1) : row.time}</td>
                                    <td className='px-1'>{row.group}</td>
                                    <td className='px-1'>{row.week}</td>
                                    <td className='px-1 text-center'>{row.logs}</td>
                                    <td className='px-1 text-center'>{row.goal}</td>
                                    <td className='px-1 text-center'>{row.mins}</td>
                                    <td className='text-right'>{row.grade}%</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
        </section>
    </>
  )
}

export default LogReportTable