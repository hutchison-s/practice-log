'use client'

import React, { useEffect, useRef } from 'react'

function ControlledModal({isOpen, children}: {isOpen: boolean, children: React.ReactNode}) {
    const modalRef = useRef<HTMLDialogElement>(null)

    useEffect(()=>{
            if (isOpen) {
                modalRef.current?.showModal();
            } else {
                modalRef.current?.close();
            }
        }, [isOpen])

  return (
    <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            {children}
    </dialog>
  )
}

export default ControlledModal