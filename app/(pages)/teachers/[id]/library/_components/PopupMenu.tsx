'use client'

import { useEffect, useRef, useState } from "react"

function PopupMenu({children, clickable, className}: {children: React.ReactNode, clickable: React.ReactNode, className?: string}) {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(o => !o);
    const menuRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
        const outsideClick = (e: MouseEvent)=>{
            const target = e.target as HTMLElement;
            if (menuRef.current !== target && !menuRef.current?.contains(target)) {
                setIsOpen(false)
            }
        }
        window.addEventListener('click', outsideClick)

        return ()=>window.removeEventListener('click', outsideClick)
    }, [])

  return (

    <>
        <div ref={menuRef} onClick={toggle} className="relative" role="button" aria-roledescription="Popup menu toggle button">
            {clickable}
            <div className={`absolute sm:right-full -right-full bottom-full size-fit p-2 rounded bg-background border-[1px] border-teal-500 ${!isOpen ? 'hidden' : ''} ${className ?? ''}`}>
                {children}
            </div>
        </div>
        
    </>
  )
}

export default PopupMenu