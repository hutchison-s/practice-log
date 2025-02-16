'use client'
import { Group } from '@/app/types'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Loader, Plus } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import { Groups } from '@/app/api/_controllers/tableControllers'
import ControlledModalForm from '@/app/_ui_components/forms/ControlledModalForm'

function NewGroupButton({teacher_id, onCreate}: {teacher_id: string, onCreate: (g: Group)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        e.preventDefault();
        const fd = new FormData(e.currentTarget)
        const newGroup = await Groups(teacher_id).createOne({
            name: fd.get('group_name') as string, 
            color: fd.get('color') as string
        })
        if (!newGroup) {
            alert('Error occurred while attempting to create group.');
            return;
        }
        onCreate(newGroup);
        setIsOpen(false);
        setIsSubmitting(false);
    }

  return (
    <>
        <button className='bg-transparent border-[1px] border-white/25 grid place-items-center p-1 rounded' onClick={()=>setIsOpen(true)}>
            <Plus className='text-txtprimary' aria-label="Add new group"/>
        </button>
        <ControlledModalForm handleSubmit={handleSubmit} isOpen={isOpen} formClassName="grid gap-4">
                {isSubmitting 
                    ? <Loader size={80} className='text-teal-500 mx-auto my-4 animate-spin'/> 
                    : <>
                        <label className="relative mt-8 block w-full rounded group">
                            <span className="bg-transparent">Group Name:</span>
                            <input
                                type='text'
                                name='group_name'
                                placeholder='Choose a name for your group...'
                                required
                                className='w-full p-2 border-2 border-teal-500 rounded bg-transparent focus:outline-none focus:bg-background'
                            />
                        </label>
                        <div className="w-full">
                            <label className='flex gap-2 items-center w-fit cursor-pointer'>
                                <span>Choose a Color:</span>
                                <input
                                    type="color"
                                    name='color'
                                    aria-label='Choose a group color'
                                    defaultValue='#000000'
                                    className='bg-background rounded size-12 border-[1px] border-white/25 inline-block cursor-pointer'/>
                            </label>
                        </div>
                        <div className="flex gap-4 justify-evenly items-center">
                            <PrimaryButton type='submit' className='text-sm px-4' onClick={()=>null}>Create</PrimaryButton>
                            <SecondaryButton type='button' className='text-sm px-4' onClick={()=>setIsOpen(false)}>Cancel</SecondaryButton>
                        </div>
                </>
            }
            </ControlledModalForm>
    </>
  )
}

export default NewGroupButton