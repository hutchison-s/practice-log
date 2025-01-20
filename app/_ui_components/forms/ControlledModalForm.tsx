'use client'

import React, { FormEvent, FormEventHandler, useEffect, useRef } from 'react'

function ControlledModalForm({isOpen, handleSubmit, children, formClassName}: {isOpen: boolean, handleSubmit: FormEventHandler<HTMLFormElement>, children: React.ReactNode, formClassName?: string}) {
    const modalRef = useRef<HTMLDialogElement>(null)

    useEffect(()=>{
            if (isOpen) {
                modalRef.current?.showModal();
            } else {
                modalRef.current?.close();
            }
        }, [isOpen])

    const onSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        handleSubmit(e);
        e.currentTarget.reset();
    }

  return (
    <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
        <form onSubmit={onSubmit} className={`grid gap-4 bg-transparent ${formClassName ? formClassName : ''}`}>
            {children}
        </form>
    </dialog>
  )
}

export default ControlledModalForm