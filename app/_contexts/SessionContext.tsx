'use client'

import { createContext } from "react";

export type PracticeSession = {start_time: string, log_id: string, journal?: string, journal_prompt?: string} | null

export type SessionType = {
    startSession: ()=>void,
    stopSession: (journal: string, prompt: string)=>void,
    cancelSession: ()=>void,
    session: PracticeSession
}

export const initialSessionContext: SessionType = {
    startSession: ()=>{return},
    stopSession: (journal: string, prompt: string)=>{console.log(journal, prompt)},
    cancelSession: ()=>{return},
    session: null
}

export const SessionContext = createContext<SessionType>(initialSessionContext);