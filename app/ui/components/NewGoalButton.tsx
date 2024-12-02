'use client'

import { Goal } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/ui/components/Buttons";
import { Plus } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react"



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
        fetch('/api/goals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: fd.get('title'),
                content: fd.get('content'),
                student_id
            })
        }).then(res => {
            if (res.ok) {
                setIsSubmitting(false);
                return res.json();
            } else {
                throw new Error('Post failed')
            }
        }).then(json => {
            onCreate(json.data)
        })
        .catch(err => {
            console.error(err);
            formRef.current?.reset();
        })
        
    }

    return (
        <>
        <div className="button-container relative">
            <button
                onClick={async ()=>{
                    setIsSubmitting(!isSubmitting)
                }} 
                className="relative bg-primary text-txtprimary text-md px-4 py-2 rounded shadow-md border-swirl disabled:brightness-50 flex justify-between mx-auto px-4 min-w-48">
                    <span>Add Goal</span> <Plus />
            </button>
        </div>
        
        <dialog ref={modalRef} className="size-full bg-transparent fixed max-w-[400px] max-h-[600px]">
            <form
                ref={formRef} 
                onSubmit={handleSubmit}
                className="size-full grid gap-4 items-center justify-items-center bg-secondary border-2 border-txtprimary shadow-lg rounded-lg p-8 text-txtprimary"
            >
                <label htmlFor="title" className="w-full font-bold text-center">Goal Title</label>
                <input type="text" name="title" id="title" maxLength={120} className="size-full bg-black/25 rounded border-txtsecondary border-[1px] resize-none p-2"/>
                <label htmlFor="content" className="w-full font-bold text-center">Goal Content</label>
                
                <textarea name="content" id="content" className="size-full min-h-[300px] bg-black/25 rounded border-txtsecondary border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
                <SecondaryButton size="md" type="reset" onClick={()=>setIsSubmitting(false)}>Cancel</SecondaryButton>
            </form>
        </dialog>
        </>
        
    )
}

export default NewGoalButton