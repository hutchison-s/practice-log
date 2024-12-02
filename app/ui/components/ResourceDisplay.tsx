'use client'

import { Resource } from "@/app/types"
import { Camera, File, Headphones, Link as LinkIcon, Trash, Video } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Elipsis from "./Elipsis"

function ResourceIcon({t}: {t: string}) {
    switch(true) {
        case t.includes('image'):
            return <Camera />
        case t.includes('pdf'):
            return <File />
        case t.includes('video'):
            return <Video />
        case t.includes('audio'):
            return <Headphones />
        default:
            return <LinkIcon />
    }
}

async function handleDelete(id: string, onDelete: (id: string)=>void) {
    await fetch(`/api/resources/${id}`, {method: 'DELETE'})
    console.log('deleted')
    onDelete(id);
}


function ResourceDisplay({r, onDelete}: {r: Resource, onDelete: (id: string)=>void}) {
    const [isDeleting, setIsDeleting] = useState(false)

  return (
    
        r && <div className="flex justify-between align-items-center border-[1px] border-txtsecondary rounded p-2 w-full">
            <div className="flex gap-2 align-items-center">
                <ResourceIcon t={r.type} />
                {isDeleting ? <div>Deleting <Elipsis /></div>: <Link href={r.url} target="blank">{r.title}</Link>}
            </div>
            <button onClick={()=>{
                setIsDeleting(true)
                handleDelete(r.id, onDelete)
                }}>
                <Trash />
            </button>
        </div>
  )
}

export default ResourceDisplay