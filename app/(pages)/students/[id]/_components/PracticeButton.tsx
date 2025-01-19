'use client'

import {PrimaryButton, SecondaryButton} from "@/app/_ui_components/layout/Buttons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import randomPrompt from "../prompts";
import { useSession } from "@/app/_contexts/SessionProvider";

export default function PracticeButton() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();
    const {startSession, stopSession, session} = useSession();
    const [prompt, setPrompt] = useState('');

    useEffect(()=>{
        if (isSubmitting) {
            setPrompt(randomPrompt())
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isSubmitting])

    return (
        <>
        {session
            ?   <SecondaryButton 
                    size="sm"
                    onClick={()=>{
                        setIsSubmitting(true);
                    }}
                    className="bg-gradient-to-br from-indigo-800 to-indigo-950"
                >
                    {isSubmitting ? "Ending session..." : "Stop Practice Session"}
                </SecondaryButton>
            :   <PrimaryButton
                    size="lg"
                    onClick={startSession}
                    className="mx-auto"
                >
                        Start Practicing
                </PrimaryButton>
        }
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    stopSession(fd.get('journal') as string);
                    setIsSubmitting(false);
                    e.currentTarget.reset();
                    router.refresh();
                }}
                className="grid gap-4 text-center"
            >
                <label htmlFor="journal" className="w-full font-bold font-golos text-white text-center">{prompt}</label>
                <textarea name="journal" id="journal" className="size-full min-h-[300px] bg-background/50 text-zinc-400 font-inter font-light rounded border-white/25 border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
            </form>
        </dialog>
        </>
        
    )
}