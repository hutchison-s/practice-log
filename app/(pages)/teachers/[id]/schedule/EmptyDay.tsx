import React from 'react'

function EmptyDay({dayTitle}: {dayTitle: string}) {
  return (
    <div className='h-full w-20 border-[1px] border-white/25'>
        <p className='text-center'>{dayTitle[0].toUpperCase()}</p>
    </div>
  )
}

export default EmptyDay