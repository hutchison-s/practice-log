'use client'

import { Goal } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/_ui_components/layout/Buttons";
import { Loader, Plus } from "lucide-react";
import { FormEvent, useState } from "react"
import { Goals } from "@/app/api/_controllers/tableControllers";
import LibraryGoalChooser from "./LibraryGoalChooser";
import ControlledModalForm from "@/app/_ui_components/forms/ControlledModalForm";



function NewGoalButton({student_id, onCreate}: {student_id: string, onCreate: (g: Goal)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setIsSubmitting(true)
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        Goals(student_id).createOne({
            title: fd.get('title') as string,
            content: fd.get('content') as string,
            student_id
        })
        .then(res => {
            if (res) {
                fetch(`/api/teachers/${res.created_by}/library/goals`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({title: res.title, content: res.content})})
                    .then(()=>{
                        onCreate(res);
                    })
            } else {
                throw new Error('Post failed')
            }
        })
        .finally(()=>{
            setIsSubmitting(false);
            setIsOpen(false);
        })
        .catch(err => {
            console.error(err);
        })
        
    }

    return (
        <>

            <SecondaryButton
                onClick={async ()=>{
                    setIsOpen(!isOpen)
                }}
                size="sm" 
                className="relative flex justify-between items-center mx-auto px-4 my-4 min-w-48">
                    <span>Add Goal</span> <Plus aria-label="Plus Mark" />
            </SecondaryButton>
        
        <ControlledModalForm
                isOpen={isOpen}
                handleSubmit={handleSubmit}
                formClassName="grid gap-4"
            >
                {
                    isSubmitting ? <Loader size={80} className="text-teal-500 mx-auto my-6 animate-spin"/> :
                    <>
                        <LibraryGoalChooser student_id={student_id} onAssign={(g: Goal)=>{onCreate(g); setIsOpen(false)}}/>
                <p className="text-center">- or -</p>
                <p className="text-center font-inter font-light text-zinc-400">Create a new goal</p>
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

export default NewGoalButton