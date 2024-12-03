'use client'

import { useContext, useEffect, useState } from "react"
import { useUser } from "../_usercontext/useUser";
import { PracticeSession, SessionContext } from "./SessionContext";




export default function SessionProvider({children}: {children: React.ReactNode}) {
    const [session, setSession] = useState<PracticeSession>(null);
    const {user} = useUser();

    const startSession = () => {
        console.log('started session')
        const existing = localStorage.getItem(`${user.id}_current_log`);
        if (existing) {
            console.log('Cannot start a session when a current session is in progress.')
            return;
        }
        fetch(`/api/students/${user.id}/logs`, {method: 'POST'})
            .then(res => res.json())
            .then(response => {
                console.log(response.data, 'received from post')
                window.localStorage.setItem(`${user.id}_current_log`, JSON.stringify(response.data));
                setSession({start_time: response.data.start_time, log_id: response.data.log_id})
            }).catch(err => {
                console.error(err)
            })
    }

    const stopSession = (journal: string) => {
        console.log('stopping session')
        const existing = localStorage.getItem(`${user.id}_current_log`);
        if (!existing) {
            console.log('Cannot stop a session that does not exist.')
            return;
        }
        fetch(`/api/students/${user.id}/logs`, {
            method: 'PATCH', 
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify({log_id: JSON.parse(existing).log_id, journal: journal})})
        .then(res => res.json())
        .then(() => {
            window.localStorage.removeItem(`${user.id}_current_log`);
            setSession(null)
        }).catch(err => {
            console.error(err)
        })
        
    }

    useEffect(()=>{
        const existing = localStorage.getItem(`${user.id}_current_log`);
        if (existing) {
            setSession(JSON.parse(existing))
        }
    }, [user])
    

    return (
        <>
            <SessionContext.Provider value={{startSession, stopSession, session}}>
                {children}
            </SessionContext.Provider>
        </>
    )
}

export const useSession = ()=>useContext(SessionContext)