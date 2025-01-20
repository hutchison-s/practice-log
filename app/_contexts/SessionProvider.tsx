'use client'

import { FormEventHandler, useContext, useEffect, useState } from "react"
import { useUser } from "../_hooks/useUser";
import { PracticeSession, SessionContext } from "./SessionContext";
import ControlledModalForm from "../_ui_components/forms/ControlledModalForm";
import BodyText from "../_ui_components/layout/BodyText";
import { PrimaryButton, SecondaryButton } from "../_ui_components/layout/Buttons";

type SessionTime = {
    start_string: string,
    now_string: string,
    total_time: number
}

function calculateTime(start_time: string): SessionTime {
    const start = new Date(start_time);
    const startMS = start.getTime();
    const now = new Date();
    const nowMS = now.getTime();
    return {
        start_string: start.toLocaleTimeString(),
        now_string: now.toLocaleTimeString(),
        total_time: Math.floor((nowMS - startMS) / 1000)
    }
}


export default function SessionProvider({children}: {children: React.ReactNode}) {
    const [session, setSession] = useState<PracticeSession>(null);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);
    const [sessionTimeInfo, setSessionTimeInfo] = useState<SessionTime | undefined>();
    const {user} = useUser();

    const startSession = () => {
        const existing = getStorage(`${user.id}_current_log`);
        if (existing) return;
        fetch(`/api/students/${user.id}/logs`, {method: 'POST'})
            .then(res => res.json())
            .then(response => {
                setStorage(response.data);
                setSession({start_time: response.data.start_time, log_id: response.data.log_id})
            }).catch(err => {
                console.error(err)
            })
    }

    const stopSession = (journal: string, prompt: string) => {
        const storedData = getStorage(`${user.id}_current_log`);
        if (!storedData) return;
        const calcTime = calculateTime(session?.start_time || '');
        setSession(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                journal: journal,
                journal_prompt: prompt
            }
        })
        // Require approval for practice logs less than 90 seconds or more than 90 minutes
        if (calcTime.total_time < 90 || calcTime.total_time > (60 * 90)) {
            console.log('unusual log detected')
            setSessionTimeInfo(calcTime)
            setIsApprovalOpen(true);
        } else {
            handleSessionEnd(true, journal, prompt)
        }
        
    }

    const handleSessionEnd = (isApproved: boolean, journal?: string, prompt?: string)=>{
        fetch(`/api/students/${user.id}/logs`, {
            method: 'PATCH', 
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify({log_id: session?.log_id, journal: journal, journal_prompt: prompt, is_approved: isApproved})})
        .then(res => res.json())
        .then(() => {
            clearStorage(`${user.id}_current_log`);
            setSession(null)
        }).catch(err => {
            console.error(err)
        })
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e)=>{
        const fd = new FormData(e.currentTarget);
        const reason = fd.get('reason');
        const time = parseInt(fd.get('time') as string);
        fetch(`/api/teachers/${user.teacher_id}/approval_requests`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            student_id: user.id,
            log_id: session?.log_id,
            estimated_time: time,
            reason: reason ? reason as string : 'No explanation provided'
        })}).then(res => {
            if (res.ok) {
                setIsApprovalOpen(false);
                handleSessionEnd(false, session?.journal, session?.journal_prompt);
            }
        })
    }

    const cancelSession = ()=>{
        fetch(`/api/students/${user.id}/logs/${session?.log_id}`, {method: 'DELETE'})
            .then(res => {
                if (!res.ok) throw new Error('Could not delete log');
                setIsApprovalOpen(false);
                setSession(null);
                clearStorage(`${user.id}_current_log`);
            })
    }

    const setStorage = (data: PracticeSession) => {
        window.localStorage.setItem(`${user.id}_current_log`, JSON.stringify(data));
    }
    const clearStorage = (storage_key: string) => {
        window.localStorage.removeItem(storage_key);
    }
    const getStorage = (storage_key: string): PracticeSession | null => {
        const existing = localStorage.getItem(storage_key);
        if (!existing) {
            return null;
        }
        const storedData: PracticeSession = JSON.parse(existing);
        if (!storedData) {
            return null
        }
        return storedData;
    }

    useEffect(()=>{
        const existing = getStorage(`${user.id}_current_log`);
        if (existing) {
            setSession(existing)
        }
    }, [user.id])
    

    return (
        <>
            <SessionContext.Provider value={{startSession, stopSession, cancelSession, session}}>
                {children}
                <ControlledModalForm isOpen={isApprovalOpen} handleSubmit={handleSubmit}>
                    <p className="text-center text-4xl font-black font-golos text-teal-500">Wow!</p>
                    <p className="text-center text-xl font-golos text-txtprimary">That was an unusual practice session.</p>
                    {sessionTimeInfo && <div>
                        <p className="text-sm text-center">Started: {sessionTimeInfo?.start_string}</p>
                        <p className="text-sm text-center">Ended: {sessionTimeInfo?.now_string}</p>
                        <p className="text-sm text-center">Total minutes logged: {Math.round(sessionTimeInfo?.total_time / 60)}</p>
                    </div>}
                    <BodyText className="text-center text-sm">
                        If this was a mistake and you didn&apos;t practice at all, you can simply click the delete button below.
                    </BodyText>
                    <SecondaryButton onClick={cancelSession} type="button" className="mx-auto px-4" size="sm">Delete</SecondaryButton>
                    <BodyText className="text-center text-sm">
                        Otherwise, please let your teacher know the details of the practice session below and click submit. It will show up as a valid practice log once they have approved it.
                    </BodyText>
                    <label htmlFor="time">How many minutes did you practice?</label>
                    <input type="number" name="time" id="time" min={1} max={240} step={1} required className="bg-background/50 text-zinc-400 py-1 px-2 rounded border-[1px] border-white/25"/>
                    <label htmlFor="">What happened?</label>
                    <textarea name="reason" id="reason" className="w-full min-h-40 bg-background/50 text-zinc-400 py-1 px-2 rounded border-[1px] border-white/25"></textarea>
                    <PrimaryButton onClick={()=>null} type="submit">Submit</PrimaryButton>
                </ControlledModalForm>
            </SessionContext.Provider>
        </>
    )
}

export const useSession = ()=>useContext(SessionContext)