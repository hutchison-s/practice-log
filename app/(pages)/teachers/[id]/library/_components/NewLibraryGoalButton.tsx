'use client'

import { useUser } from '@/app/_hooks/useUser'
import ControlledModalForm from '@/app/_ui_components/forms/ControlledModalForm'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import { Loader, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler, useState } from 'react'

function NewLibraryGoalButton() {
    const {user} = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const title = fd.get('title') as string;
        const content = fd.get('content') as string;
        fetch(`/api/teachers/${user.id}/library/goals`, {method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify({title, content})})
            .then(()=>{
                router.refresh();
                setIsOpen(false)
            })
            .finally(()=>setIsSubmitting(false));
    }

  return (
    <>
        <SecondaryButton
                onClick={()=>setIsOpen(true)}
                size="sm" 
                className="text-sm relative flex justify-between items-center px-2 py-1 my-4 min-w-40">
                    <span>Create Goal</span> <Plus aria-label="Plus Mark" size={20} />
            </SecondaryButton>
        <ControlledModalForm isOpen={isOpen} handleSubmit={handleSubmit}>
            {isSubmitting
                ?   <Loader size={80} className='mx-auto text-teal-500 animate-spin'/>
                :   <>
                        <p className="text-center font-inter font-light text-zinc-400">Create a new goal for your library</p>
                        <label htmlFor="title" className="w-full font-bold text-center font-golos text-white -mb-2">Goal Title</label>
                        <input type="text" name="title" id="title" maxLength={120} className="size-full bg-background/50 rounded border-white/25 border-[1px] resize-none p-2"/>
                        <label htmlFor="content" className="w-full font-bold text-center font-golos text-white -mb-2">Goal Content</label>
                        
                        <textarea name="content" id="content" className="size-full min-h-[300px] bg-background/50 rounded border-white/25 border-[1px] resize-none p-3"></textarea>
                        <PrimaryButton size="md" type="submit" className="mx-auto" onClick={undefined}>Submit</PrimaryButton>
                        <SecondaryButton size="sm" type="reset" className="py-0 mx-auto" onClick={()=>setIsOpen(false)}>Cancel</SecondaryButton>
                    </>
            }
            
        </ControlledModalForm>
    </>
  )
}

export default NewLibraryGoalButton