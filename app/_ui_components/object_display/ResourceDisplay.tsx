'use client'

import { Resource } from "@/app/types"
import { Camera, File, Headphones, Link as LinkIcon, Trash, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Elipsis from "../layout/Elipsis"
import { useUser } from "@/app/_hooks/useUser"
import { Resources } from "@/app/api/_controllers/tableControllers"

function ResourceIcon({t}: {t: string}) {
    switch(true) {
        case t.includes('image'):
            return <Camera aria-label="Image"/>
        case t.includes('pdf'):
            return <File aria-label="File"/>
        case t.includes('video'):
            return <Video aria-label="Video"/>
        case t.includes('audio'):
            return <Headphones aria-label="Audio"/>
        default:
            return <LinkIcon aria-label="Link"/>
    }
}

async function handleDelete(student_id: string, resource_id: string, onDelete: (id: string)=>void) {
    await Resources(student_id).deleteOne(resource_id);
    console.log('deleted')
    onDelete(resource_id);
}


function ResourceDisplay({r, onDelete}: {r: Resource, onDelete?: (id: string)=>void}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const {user} = useUser();

  return (
    
        r && <li className="flex gap-4 justify-between align-items-center bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded p-2 w-full">
            <div className="flex-1 flex align-items-center">
                
                {isDeleting ? <div>Deleting <Elipsis /></div>: <Link href={r.url} target="blank" className="w-full flex gap-2"><ResourceIcon t={r.type} /> {r.title}</Link>}
            </div>
            {user && user.role == 'teacher' && <button onClick={()=>{
                const deleteFunc = typeof onDelete == 'function' ? onDelete : (id: string)=>console.log(id);
                setIsDeleting(true)
                handleDelete(r.student_id, r.id, deleteFunc)
                }}>
                <Trash aria-label="Trash Can" />
            </button>}
        </li>
  )
}

export default ResourceDisplay