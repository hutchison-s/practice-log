'use client'

import { AlertCircle, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import PieChart from './PieChart';
import { fetchCurrentWeekTotal } from '@/app/(pages)/teachers/[id]/actions';

function CurrentWeekPieChart({student_id, size}: {student_id: string, size: number}) {
    const [percent, setPercent] = useState(0)
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        fetchCurrentWeekTotal(student_id)
            .then(data => {
                if (data.length == 0) {
                    setIsLoading(false);
                    return;
                }
                const {weekly_goal, weekly_total} = data[0];
                setPercent((Math.floor(parseInt(weekly_total) / (weekly_goal * 60) * 100)))
                setIsLoading(false);
            })
            .catch(reason => {
                console.error(reason)
                setHasError(true)
                setIsLoading(false)

            })
    }, [])
  return (
    isLoading
        ?   <Loader className='spinner' size={size}/>
        :   hasError
            ?   <AlertCircle color='black' size={size} />
            :   <div className="flex items-center justify-end align-center gap-2 w-full">
                    <PieChart aria-label="Pie Chart" percent={percent} size={size}/>
                    <span className="text-sm font-light">
                        {percent}%
                    </span>
                </div>
            
  )
}

export default CurrentWeekPieChart