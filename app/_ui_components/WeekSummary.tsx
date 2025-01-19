import React from 'react'
import PieChart from './PieChart';

function WeekSummary({startDate, totalSeconds, goal}: {startDate: string, totalSeconds: number, goal: number}) {
    const start = new Date(startDate);
    start.setHours(start.getHours() + 12)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const percent = (totalSeconds / (goal * 60)) * 100;
    return (
        <div className="glass grid place-items-center gap-2 p-4 rounded-xl">
            <h3 className='font-bold font-golos'>Week of {start.getMonth() + 1}/{start.getDate()}</h3>
            <PieChart percent={percent} size={50}/>
            <p className='text-center text-txtsecondary'>{Math.floor(percent)}%</p>
            <p className='text-sm'>{minutes} min, {seconds} sec</p>
        </div>
    )
}

export default WeekSummary