'use client'

import React, {Children} from 'react'

function DropDown({title, children}: {title: string, children: React.ReactNode}) {

  return (
    <div className='group relative z-20'>
        <div className='rounded-t-md text-center text-txtprimary p-2 border-[1px] border-b-0 border-transparent group-hover:border-t-zinc-400 group-hover:border-x-zinc-400 transition-all select-none group-hover:bg-white/10 group-hover:backdrop-blur'>{title}</div>
        <div className='transition-all absolute top-full left-0 w-full text-transparent border-[1px] border-t-0 border-transparent flex flex-col h-0 rounded-b-md group-hover:h-fit group-hover:bg-background group-hover:backdrop-blur group-hover:border-b-zinc-400 group-hover:border-x-zinc-400 group-hover:text-zinc-400'>
            {Children.map(children, (child)=>{
                return <div className='transition-all duration-400 overflow-hidden py-0 opacity-0 group-hover:opacity-100 group-hover:py-2 hover:bg-white/5'>{child}</div>
            })}
        </div>

    </div>
  )
}

export default DropDown