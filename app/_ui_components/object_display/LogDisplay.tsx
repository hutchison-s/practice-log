'use client'

import DeleteLogButton from "@/app/(pages)/teachers/[id]/_components/DeleteLogButton";
import { utcToTimeZone } from "@/app/_utils/dates";
import { logRow } from "@/app/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function LogDisplay({log, onDelete}: {log: logRow, onDelete?: (log: logRow)=>void}) {
    const [isOpen, setIsOpen] = useState(false);
    const seconds = parseInt(log.total_time)

    if (seconds == 0) return null;
    const timestamp = utcToTimeZone(log.start_time, 'day, month, year, date, hour, minute');
    return (
        <li className="w-full glass border-[1px] border-slate-600 border-l-4 border-l-txtprimary rounded shadow-sm grid grid-cols-[1fr_40px]" onClick={()=>setIsOpen(!isOpen)}>
            <button className="px-4 py-2 pr-8 pb-1 text-left w-full">
                <div className="flex-3">
                    <p className="font-golos">{`${seconds >= 60 ? (Math.floor(seconds / 60))+" min and " : ""} ${(seconds % 60)+" sec"}`}</p>
                    <p className="block text-xs font-light text-zinc-400">{`${log.name}, ${timestamp}`}</p>
                </div>
                <div className="w-full text-netural-300 rounded-b text-sm overflow-hidden transition-opacity pt-2" style={{height: isOpen ? 'fit-content' : '0', opacity: isOpen ? 1 : 0}}>
                    <p className="text-teal-500 font-bold font-golos">Practice Journal:</p>
                    <p className="text-xs font-light text-zinc-400">{log.journal_prompt}</p>
                    <p className="text-xs font-light text-white mt-1">{log.journal}</p>
                </div>
                
            </button>
            <div className="size-full flex justify-end items-start p-1">
                <DeleteLogButton log={log} onDelete={typeof onDelete == 'function' ? onDelete : (log: logRow)=>console.log(log)}/>
            </div>
            <div className="w-full col-span-2 flex justify-center cursor-pointer">{isOpen ? <ChevronUp size={20} aria-label="Collapse"/> : <ChevronDown size={20} aria-label="Expand"/>}</div>
        </li>
    )
}

export default LogDisplay;