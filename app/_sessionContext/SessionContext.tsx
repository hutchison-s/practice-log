'use client'

import { createContext } from "react";

export type PracticeSession = {start_time: string, log_id: string} | null

export type SessionType = {
    startSession: ()=>void,
    stopSession: (journal: string)=>void,
    session: PracticeSession
}

export const initialSessionContext: SessionType = {
    startSession: ()=>{return},
    stopSession: (journal: string)=>{console.log(journal)},
    session: null
}

export const SessionContext = createContext<SessionType>(initialSessionContext);