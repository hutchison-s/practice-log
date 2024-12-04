'use client'

import { utcToTimeZone } from "@/app/_functions/dates";
import { logRow } from "@/app/types";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

function LogDisplay({log}: {log: logRow}) {
    const [isOpen, setIsOpen] = useState(false);

    if (log.seconds == 0) return null;
    const timestamp = utcToTimeZone(log.start, 'day, month, year, date, hour, minute');
    return (
        <div className="relative px-4 py-2 pr-8 border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm">
            <div onClick={()=>setIsOpen(!isOpen)}>
                <p>{`${log.seconds >= 60 ? (Math.floor(log.seconds / 60))+" min and " : ""} ${(log.seconds % 60)+" sec"}`}</p>
                <p className="block text-xs font-light">{`${log.name}, ${timestamp}`}</p>
                <div className="absolute top-1/2 right-1 -translate-y-1/2">{isOpen ? <ChevronsDownUp size={20}/> : <ChevronsUpDown size={20}/>}</div>
            </div>
            {isOpen &&
                <div className="w-full text-netural-300 py-2 rounded-b text-sm" onClick={()=>setIsOpen(!isOpen)}>
                    <p className="text-lighter">Practice Journal:</p>
                    <p className="text-xs font-light">{log.journal}</p>
                </div>
                
            }
        </div>
    )
}

export default LogDisplay;