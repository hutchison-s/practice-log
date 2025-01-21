import React from 'react'

function BarGraph({data, labels, data_labels}: {data: number[], labels: string[], data_labels: (string | number)[]}) {
    const max = Math.max(...data);
  return (
    <div className='flex gap-1 w-full h-[140px] border-[1px] border-white/25 rounded p-1 items-end'>
        {data.map((each, index)=>(
            <div key={index} className='grid gap-1 flex-1'>
                <div style={{height: ((each / max) * 100)+'px'}} className='bg-gradient-to-br from-cyan-500 to-teal-800 w-full grid place-items-center rounded-lg'>
                    <span className='text-md text-shadow'>{data_labels[index]}</span>
                </div>
                <span className='text-sm font-inter font-light text-white w-full text-center'>{labels[index]}</span>
            </div>
        ))}
    </div>
  )
}

export default BarGraph