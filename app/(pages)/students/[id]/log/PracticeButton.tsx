'use client'

import { useSession } from "@/app/_sessionContext/SessionProvider";
import {PrimaryButton, SecondaryButton} from "@/app/ui/components/Buttons";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PracticeButton() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();
    const {startSession, stopSession, session} = useSession();

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
                    onClick={startSession}
                >
                        Start Practice Session
                </PrimaryButton>
        }
        <dialog ref={modalRef} className="size-full bg-transparent fixed max-w-[400px] max-h-[600px]">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    stopSession(fd.get('journal') as string);
                    setIsSubmitting(false);
                    e.currentTarget.reset();
                    router.refresh();
                }}
                className="size-full grid gap-4 items-center justify-items-center bg-secondary border-2 border-txtprimary shadow-lg rounded-lg p-8 text-txtprimary"
            >
                <label htmlFor="journal" className="w-full font-bold text-center">What did you accomplish today?</label>
                <textarea name="journal" id="journal" className="size-full min-h-[300px] bg-black/25 rounded border-txtsecondary border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
            </form>
        </dialog>
        </>
        
    )
}