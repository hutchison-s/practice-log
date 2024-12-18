'use client'
import React, { useEffect, useRef, useState, PointerEvent } from 'react'

function MetronomeControl({setTempo}: {setTempo: (t: number)=>void}) {
  const [isMoving, setIsMoving] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
          const slider = sliderRef.current;
          if (!slider) return;
          slider.addEventListener('touchstart', handleTouchStart);
          slider.addEventListener('touchmove', handleMove);
          window.addEventListener('pointerup', stopMoving);
          window.addEventListener('touchend', stopMoving);
  
          return ()=>{
              window.removeEventListener('pointerup', stopMoving)
              window.removeEventListener('touchend', stopMoving)
              slider.removeEventListener('touchstart', handleTouchStart);
              slider.removeEventListener('touchmove', handleMove);
          }
      }, [sliderRef.current])
      const stopMoving = ()=>{
          setIsMoving(false)
      }
  
      const handleMove = (e: PointerEvent<HTMLDivElement> | TouchEvent)=>{
          if (isMoving) {
              const target = e.currentTarget as HTMLDivElement;
              const {bottom} = target.parentElement!.getBoundingClientRect();
              const clickY = 'touches' in e ? e.touches[0].pageY : e.pageY;
              const offset = (bottom + window.scrollY) - clickY;
              const centerOffset = target.clientHeight / 2;
              let newY = offset - centerOffset;
              newY = Math.max(0, newY);
              newY = Math.min(240, newY);
              target.style.bottom = `${newY}px`
              const percent = (newY / 240)
              const newTempo = Math.round(percent * 200) + 40
              setTempo(newTempo)
          }
      }
  
      const handleTouchStart = (e: TouchEvent) => {
          e.preventDefault()
          setIsMoving(true)
      }
  return (
    <div className='h-[300px] w-8 relative bg-background rounded'>
        <div
            ref={sliderRef} 
            className='absolute w-10 h-16 bottom-0 -left-1 bg-primary border-2 border-txtprimary outline outline-2 outline-primary rounded'
            style={{bottom: '100px'}}
            onPointerDown={()=>setIsMoving(true)}
            onPointerMove={(e)=>handleMove(e)}
            onTouchEnd={stopMoving}
        >

        </div>
    </div>
  )
}

export default MetronomeControl