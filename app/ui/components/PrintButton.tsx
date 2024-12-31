'use client'
import { Printer } from "lucide-react"

export default function PrintButton() {
    return <button onClick={()=>window.print()} className="bg-gradient-to-br from-indigo-800 to-indigo-950 font-golos font-bold text-white items-center justify-center py-2 px-6 rounded border-[1px] border-white/25 flex gap-2 transition-all hover:scale-105 hover:brightness-110">Print All<Printer className="inline"/></button>
}