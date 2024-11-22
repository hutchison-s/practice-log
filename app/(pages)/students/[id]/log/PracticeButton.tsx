'use client'

import {PrimaryButton, SecondaryButton} from "@/app/ui/components/Buttons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";



async function handleStart(id: string): Promise<string | undefined> {
    
    const url = `/api/students/${id}/logs`
    let session;
    await fetch(url, {method: 'POST'})
        .then(res => res.json())
        .then(response => {
            window.localStorage.setItem(id+"_current_log", response.data.log_id);
            session = response.data.log_id;
        })
    return session;
}

function handleStop(id: string, journal: string) {
    
    const url = `/api/students/${id}/logs`
    fetch(url, {method: 'PATCH', headers: {"Content-type": "application/json"}, body: JSON.stringify({log_id: window.localStorage.getItem(id+"_current_log"), journal: journal})})
        .then(res => res.json())
        .then(() => {
            window.localStorage.removeItem(id+"_current_log");
        })
    
}

export default function PracticeButton({id}: {id: string}) {
    const [session, setSession] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    useEffect(()=>{
        const s = window.localStorage.getItem(id+"_current_log") || undefined;
        setSession(s);
    }, [id])

    useEffect(()=>{
        if (isSubmitting) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isSubmitting])

    return (
        <>
        {session
            ?   <SecondaryButton 
                    size="lg"
                    onClick={()=>{
                        setIsSubmitting(true);
                    }}
                >
                    {isSubmitting ? "Ending session..." : "Stop Practice Session"}
                </SecondaryButton>
            :   <PrimaryButton
                    size="lg"
                    onClick={async ()=>{
                        const session = await handleStart(id);
                        setSession(session);
                    }}
                >
                        Start Practice Session
                </PrimaryButton>
        }
        <dialog ref={modalRef} className="bg-transparent fixed">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    handleStop(id, fd.get('journal') as string);
                    setSession(undefined);
                    setIsSubmitting(false);
                    e.currentTarget.reset();
                    router.refresh();
                }}
                className="w-[100vw] h-[100vh] max-w-[400px] max-h-[600px] grid gap-4 bg-background border-2 border-txtprimary shadow-lg rounded-lg p-8 text-txtprimary"
            >
                <label htmlFor="journal" className="w-full font-bold text-center">What did you practice?</label>
                <textarea name="journal" id="journal" className="w-full h-full min-h-[300px] bg-black/50 rounded border-secondary border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
            </form>
        </dialog>
        </>
        
    )
}