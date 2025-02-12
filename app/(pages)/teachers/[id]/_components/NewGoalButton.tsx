'use client'

import { Goal } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/_ui_components/layout/Buttons";
import { Plus } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react"
import { Goals } from "@/app/api/_controllers/tableControllers";



function NewGoalButton({student_id, onCreate}: {student_id: string, onCreate: (g: Goal)=>void}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(()=>{
        if (isSubmitting) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isSubmitting])

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        Goals(student_id).createOne({
            title: fd.get('title') as string,
            content: fd.get('content') as string,
            student_id
        })
        .then(res => {
            if (res) {
                setIsSubmitting(false);
                return onCreate(res)
            } else {
                throw new Error('Post failed')
            }
        })
        .catch(err => {
            console.error(err);
            formRef.current?.reset();
        })
        
    }

    return (
        <>

            <SecondaryButton
                onClick={async ()=>{
                    setIsSubmitting(!isSubmitting)
                }}
                size="sm" 
                className="relative flex justify-between items-center mx-auto px-4 my-4 min-w-48">
                    <span>Add Goal</span> <Plus aria-label="Plus Mark" />
            </SecondaryButton>
        
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form
                ref={formRef} 
                onSubmit={handleSubmit}
                className="grid gap-4"
            >
                <p className="text-center font-inter font-light text-zinc-400">Create a new goal</p>
                <label htmlFor="title" className="w-full font-bold text-center font-golos text-white -mb-2">Goal Title</label>
                <input type="text" name="title" id="title" maxLength={120} className="size-full bg-background/50 rounded border-white/25 border-[1px] resize-none p-2"/>
                <label htmlFor="content" className="w-full font-bold text-center font-golos text-white -mb-2">Goal Content</label>
                
                <textarea name="content" id="content" className="size-full min-h-[300px] bg-background/50 rounded border-white/25 border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" className="mx-auto" onClick={undefined}>Submit</PrimaryButton>
                <SecondaryButton size="sm" type="reset" className="py-0 mx-auto" onClick={()=>setIsSubmitting(false)}>Cancel</SecondaryButton>
            </form>
        </dialog>
        </>
        
    )
}

export default NewGoalButton