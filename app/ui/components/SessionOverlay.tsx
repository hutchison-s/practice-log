'use client'

import PracticeButton from "@/app/(pages)/students/[id]/log/PracticeButton";
import { useSession } from "@/app/_sessionContext/SessionProvider"
import { useEffect, useState } from "react";

function timeFormatFromSeconds(total: number) {
    let min = Math.floor(total/60).toString();
    if (min.length < 2) {
        min = `0${min}`
    }
    let sec = (total % 60).toString();
    if (sec.length < 2) {
        sec = `0${sec}`
    }
    return `${min}:${sec}`
}

function SessionOverlay() {
    const {session} = useSession();
    const [elapsed, setElapsed] = useState(0);

    useEffect(()=>{
        console.log(session)
        const interval = session ? setInterval(()=>{
            const start = new Date(session.start_time);
            const now = new Date();
            console.log(start.toTimeString(), now.toTimeString())
            const seconds = Math.round((now.getTime() - start.getTime()) / 1000);
            setElapsed(seconds)
        }, 1000) : 0;

        return ()=>{
            clearInterval(interval)
        }
    }, [session])

  return (
    session && <>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-primary text-background flex flex-wrap justify-center gap-4 align-center md:flex-nowrap">
            <h2 className="text-txtprimary text-xl my-auto">Session in progress: {timeFormatFromSeconds(elapsed)}</h2>
            <PracticeButton />
        </div>
    </>
  )
}

export default SessionOverlay