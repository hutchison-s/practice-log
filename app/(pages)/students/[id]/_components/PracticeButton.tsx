'use client'

import {PrimaryButton, SecondaryButton} from "@/app/_ui_components/layout/Buttons";
import { FormEventHandler, useEffect, useState } from "react";
import randomPrompt from "../prompts";
import { useSession } from "@/app/_contexts/SessionProvider";
import ControlledModalForm from "@/app/_ui_components/forms/ControlledModalForm";
import { useRouter } from "next/navigation";

export default function PracticeButton() {
    const [isJournalOpen, setIsJournalOpen] = useState(false);
    const {startSession, stopSession, cancelSession, session} = useSession();
    const [prompt, setPrompt] = useState('Thinking of a question...');
    const router = useRouter();

    useEffect(()=>{
        setPrompt(randomPrompt())
    }, [])

    const onSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        const journal = e.currentTarget.journal.value;
        stopSession(journal, prompt);
        setIsJournalOpen(false);
        router.refresh();
    }

    const onCancel = ()=>{
        const isConfirmed = confirm('Are you sure? None of the current practice time will be saved if you click yes.')
        if (!isConfirmed) return;
        cancelSession()
        setIsJournalOpen(false);
    }

    const onContinue = () =>{
        setIsJournalOpen(false);
    }

    return (
        <>
        {session
            ?   <SecondaryButton 
                    size="sm"
                    onClick={()=>{
                        setIsJournalOpen(true);
                    }}
                    className="bg-gradient-to-br from-indigo-800 to-indigo-950"
                >
                    {isJournalOpen ? "Ending session..." : "Stop Practice Session"}
                </SecondaryButton>
            :   <PrimaryButton
                    size="lg"
                    onClick={startSession}
                    className="mx-auto"
                >
                        Start Practicing
                </PrimaryButton>
        }
        <ControlledModalForm handleSubmit={onSubmit} isOpen={isJournalOpen}>
                <label htmlFor="journal" className="w-full font-bold font-golos text-white text-center">{prompt}</label>
                <textarea name="journal" id="journal" className="size-full min-h-[300px] bg-background/50 text-zinc-400 font-inter font-light rounded border-white/25 border-[1px] resize-none p-3"></textarea>
                <PrimaryButton size="md" type="submit" onClick={undefined}>Submit</PrimaryButton>
                <div className="flex w-full justify-evenly gap-2">
                    <SecondaryButton size="sm" type="button" className="px-2" onClick={onContinue}>Keep Practicing</SecondaryButton>
                    <SecondaryButton size="sm" type="button" className="px-2 hover:bg-red-950 hover:border-white/25" onClick={onCancel}>Delete Session</SecondaryButton>
                </div>
                
            </ControlledModalForm>
        </>
        
    )
}