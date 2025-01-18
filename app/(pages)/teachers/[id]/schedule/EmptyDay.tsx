'use client'

import React, { useState, useEffect } from 'react'

function EmptyDay({dayTitle}: {dayTitle: string}) {
  const [windowWidth, setWindowWidth] = useState(400);
  
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
  windowWidth > 768
  ? <div className='relative w-full border-[1px] border-white/25 flex flex-col h-[400px] md:h-full'>
      <p className='text-lg py-2 text-center glass font-golos font-bold text-txtprimary'>{dayTitle[0].toUpperCase()}{dayTitle[1]}</p>
    </div>
  : <div className='relative w-full border-[1px] border-white/25 flex flex-col h-fit md:h-full'>
      <p className='text-md py-2 text-center glass font-golos font-bold text-txtprimary'>{dayTitle} <span className='font-inter font-light'>- 0</span></p>
    </div>
)
}

export default EmptyDay