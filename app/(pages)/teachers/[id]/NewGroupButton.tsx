'use client'
import { Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/ui/components/Buttons'
import { Plus } from 'lucide-react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function NewGroupButton({teacher_id, onCreate}: {teacher_id: string, onCreate: (g: Group)=>void}) {
    const modalRef = useRef<HTMLDialogElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget)
        fetch(`/api/teachers/${teacher_id}/groups`, {
            method: 'POST', 
            headers: {'content-type': 'application/json'}, 
            body: JSON.stringify({
                group_name: fd.get('group_name') as string, 
                color: fd.get('color') as string
            })})
            .then(res => res.json())
            .then(json => {
                onCreate(json.data);
                formRef.current?.reset();
                setIsOpen(false)
            })
            .catch(err => {
                console.error(err);
                setError('Could not create group.')
            })
    }

    const handleCancel = ()=>{
        formRef.current?.reset();
        setIsOpen(false);
    }

    useEffect(()=>{
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen])
  return (
    <>
        <button className='bg-transparent border-[1px] border-white/25 grid place-items-center p-1 rounded' onClick={()=>setIsOpen(true)}>
            <Plus className='text-txtprimary' aria-label="Add new group"/>
        </button>
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form onSubmit={handleSubmit} ref={formRef} className="grid gap-4">
            <label className="relative mt-8 block w-full rounded group">
        <span 
            className="bg-transparent"
        >
            Group Name:
        </span>
        <input
            type='text'
            name='group_name'
            placeholder='Choose a name for your group...'
            required
            className='w-full p-2 border-2 border-teal-500 rounded bg-transparent focus:outline-none focus:bg-background'/>
    </label>
    <div className="w-full">
        <label className='flex gap-2 items-center w-fit cursor-pointer'>
            <span>Choose a Color:</span>
            <input
                type="color"
                name='color'
                aria-label='Choose a group color'
                className='bg-background rounded size-12 border-[1px] border-white/25 inline-block cursor-pointer'/>
        </label>
    </div>
    {error && <p className='text-center text-sm my-2'>{error}</p>}
                <div className="flex gap-4 justify-evenly items-center">
                    <PrimaryButton type='submit' className='text-sm px-4' onClick={()=>null}>Create</PrimaryButton>
                    <SecondaryButton type='button' className='text-sm px-4' onClick={handleCancel}>Cancel</SecondaryButton>
                </div>
            </form>
        </dialog>
    </>
  )
}

export default NewGroupButton