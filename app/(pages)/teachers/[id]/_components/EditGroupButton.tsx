'use client'
import { Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Pencil } from 'lucide-react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'

function EditGroupButton({teacher_id, groupId, onUpdate}: {teacher_id: string, groupId?: string, onUpdate: (g: Group)=>void}) {
    

    const modalRef = useRef<HTMLDialogElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [group, setGroup] = useState<Group>()
    const [isOpen, setIsOpen] = useState(false);

    

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget)
        const res = await fetch(`/api/teachers/${teacher_id}/groups/${groupId}`, {
            method: 'PATCH', 
            headers: {'content-type': 'application/json'}, 
            body: JSON.stringify({
                group_name: fd.get('group_name') as string, 
                color: fd.get('color') as string
            })})
        if (!res.ok) {
            return alert('Error occured while updating group.');
        }
        const json = await res.json();
        onUpdate(json.data);
        formRef.current?.reset();
        setIsOpen(false)
            

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

    useEffect(()=>{
        if (!groupId) return;
        fetch(`/api/teachers/${teacher_id}/groups/${groupId}`)
            .then(res => res.json())
            .then(json => setGroup(json.data))
    }, [groupId])

    if (!group) return <></>
  return (
    <>
        <button className='bg-transparent border-[1px] border-white/25 grid place-items-center p-1 rounded' onClick={()=>setIsOpen(true)}>
            <Pencil className='text-txtprimary' aria-label="Edit group details"/>
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
            defaultValue={group.name}
            required
            className='w-full p-2 border-2 border-teal-500 rounded bg-transparent focus:outline-none focus:bg-background'/>
    </label>
    <div className="w-full">
        <label className='flex gap-2 items-center w-fit cursor-pointer'>
            <span>Choose a Color:</span>
            <input
                type="color"
                name='color'
                defaultValue={group.color}
                aria-label='Choose a group color'
                className='bg-background rounded size-12 border-[1px] border-white/25 inline-block cursor-pointer'/>
        </label>
    </div>
                <div className="flex gap-4 justify-evenly items-center">
                    <PrimaryButton type='submit' className='text-sm px-4' onClick={()=>null}>Update</PrimaryButton>
                    <SecondaryButton type='button' className='text-sm px-4' onClick={handleCancel}>Cancel</SecondaryButton>
                </div>
            </form>
        </dialog>
    </>
  )
}

export default EditGroupButton