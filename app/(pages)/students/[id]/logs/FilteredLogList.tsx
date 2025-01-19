'use client'
import { utcToDateInput } from '@/app/_utils/dates';
import { logRow, weeklyTotal } from '@/app/types'
import BodyText from '@/app/_ui_components/layout/BodyText';
import { PrimaryButton } from '@/app/_ui_components/layout/Buttons';
import PracticeLogList from '@/app/_ui_components/object_display/PracticeLogList'
import { TotalPractice } from '@/app/(pages)/students/[id]/_components/TotalPractice';
import WeekSummary from '@/app/_ui_components/WeekSummary';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

const deselected = 'linear-gradient(-45deg, #171717, #171717)'
const selected = 'linear-gradient(-45deg, #1e1b4b, #3730a3)'

function FilteredLogList({weekly_goal, logs, weeks}: {weekly_goal: number, logs: logRow[], weeks: weeklyTotal[]}) {
    const [dateRange, setDateRange] = useState<Record<string, string>>({start: `${new Date().getFullYear()}-01-01`, end: new Date().toISOString().substring(0, 10)})
    const [filteredLogs, setFilteredLogs] = useState<logRow[]>(logs);
    const [filteredWeeks, setFilteredWeeks] = useState<weeklyTotal[]>(weeks);
    const [isLogsSelected, setIsLogsSelected] = useState(true)
    const [error, setError] = useState('')

    function validateDateChoice(payload: {key: string, value: string}) {
        const payloadDate = new Date(payload.value);
        if (payload.key == 'start' && payloadDate > new Date(dateRange.end)) return false;
        if (payload.key == 'end' && payloadDate < new Date(dateRange.start)) return false;
        return true;
    }
    function handleChange(payload: {key: string, value: string}) {
        if (!validateDateChoice(payload)) {
            setError('Starting date cannot be later than ending date.');
            return;
        }
        setDateRange(prev => {
            return {
                ...prev,
                [payload.key]: payload.value
            }
        })
    }

    function handleResetDates() {
        setDateRange({start: `${new Date().getFullYear()}-01-01`, end: new Date().toISOString().substring(0, 10)})
    }
    function filterDates(log: logRow) {
        const logDate = new Date(utcToDateInput(log.start_time));
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return logDate >= startDate && logDate <= endDate;
    }
    function filterWeeks(w: weeklyTotal) {
        const weekStart = new Date(utcToDateInput(w.lesson_week_start));
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return weekStart >= startDate && weekStart <= endDate;
    }

    useEffect(()=>{
        setFilteredLogs(logs.filter(filterDates))
        setFilteredWeeks(weeks.filter(filterWeeks))
    }, [dateRange])

    useEffect(()=>{
        if (error) {
            setTimeout(()=>setError(''), 3000)
        }
    }, [error])
    return (
    <>
            <div className="flex w-full gap-4 justify-center flex-wrap">
                <label htmlFor="startDate" className='glass min-w-[250px] py-2 px-4 rounded-xl flex items-center text-txtprimary font-inter cursor-pointer'>Starting: 
                    <input 
                        className='ml-2 bg-transparent rounded accent-teal-500 cursor-pointer' 
                        type="date" 
                        name="startDate" 
                        id="startDate" 
                        value={dateRange.start}
                        onInput={(e)=>handleChange({key: 'start', value: e.currentTarget.value})}/>
                </label>
                <PrimaryButton onClick={handleResetDates} size='sm' className='px-2'><RotateCcw size={16}/></PrimaryButton>
                <label htmlFor="endDate" className='glass min-w-[250px] py-2 px-4 rounded-xl flex justify-center items-center text-txtprimary font-inter cursor-pointer'>Ending: 
                    <input 
                        className='ml-2 bg-transparent rounded accent-teal-500 cursor-pointer' 
                        type="date" 
                        name='endDate' 
                        id='endDate' 
                        value={dateRange.end}
                        onInput={(e)=>handleChange({key: 'end', value: e.currentTarget.value})}/>
                </label>
                
            </div>
            {error && <p className='text-center text-teal-500 text-sm font-inter my-2'>{error}</p>}
            <TotalPractice logs={filteredLogs || []}/>
            <div className="flex justify-evenly w-full max-w-[400px] rounded border-[1px] border-white/25">
                        <button 
                            role='button' 
                            onClick={(e)=>{e.preventDefault(); setIsLogsSelected(true)}} 
                            className='flex-1 py-2' 
                            style={{
                                backgroundImage: isLogsSelected ? selected : deselected
                            }}>
                            Logs
                        </button>
                        <button 
                            role='button' 
                            onClick={(e)=>{e.preventDefault(); setIsLogsSelected(false)}} 
                            className='flex-1 py-2' 
                            style={{
                                backgroundImage: isLogsSelected ? deselected : selected
                            }}>
                            Weeks
                        </button>
                    </div>
        {isLogsSelected
            ? filteredLogs.length > 0 
                ? <PracticeLogList logs={filteredLogs} /> 
                : <BodyText className='mt-2 text-center'>No Logs in this timeframe</BodyText>
            : filteredWeeks.length > 0
                ? <div className="flex flex-wrap gap-2 max-w-[600px] mx-auto">
                    {filteredWeeks.map(w => 
                        <WeekSummary key={w.lesson_week_start} startDate={w.lesson_week_start} totalSeconds={parseInt(w.weekly_total)} goal={weekly_goal}/>)
                    }
                  </div>
                : <BodyText className='mt-2 text-center'>No lesson weeks start in this timeframe</BodyText>
        }
    </>
  )
}

export default FilteredLogList