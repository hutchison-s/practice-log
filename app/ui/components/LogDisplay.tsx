'use client'

import { utcToTimeZone } from "@/app/_functions/dates";
import { logRow } from "@/app/types";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

function LogDisplay({log}: {log: logRow}) {
    const [isOpen, setIsOpen] = useState(false);
    const seconds = parseInt(log.total_time)

    if (seconds == 0) return null;
    const timestamp = utcToTimeZone(log.start_time, 'day, month, year, date, hour, minute');
    return (
        <li className="block glass px-4 py-2 pr-8 border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm">
            <div onClick={()=>setIsOpen(!isOpen)}>
                <p className="font-golos">{`${seconds >= 60 ? (Math.floor(seconds / 60))+" min and " : ""} ${(seconds % 60)+" sec"}`}</p>
                <p className="block text-xs font-light text-zinc-400">{`${log.name}, ${timestamp}`}</p>
                <div className="absolute top-1/2 right-1 -translate-y-1/2">{isOpen ? <ChevronsDownUp size={20} aria-label="Collapse"/> : <ChevronsUpDown size={20} aria-label="Expand"/>}</div>
            </div>
            {isOpen &&
                <div className="w-full text-netural-300 py-2 rounded-b text-sm" onClick={()=>setIsOpen(!isOpen)}>
                    <p className="text-teal-500 text-shadow font-bold font-golos">Practice Journal:</p>
                    <p className="text-xs font-light">{log.journal}</p>
                </div>
                
            }
        </li>
    )
}

export default LogDisplay;