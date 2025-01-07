import { Resource } from "@/app/types"
import { Camera, File, Headphones, Link as LinkIcon, Video } from "lucide-react"
import Link from "next/link"


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


function StudentResourceDisplay({r}: {r: Resource}) {

  return (
    
        r && <li>
            <Link href={r.url} target="_blank" className="flex justify-between align-items-center bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded p-2 w-full">
                <div className="flex gap-2 align-items-center">
                    <ResourceIcon t={r.type} />
                    <p>{r.title}</p>
                </div>
            </Link>
        </li>
  )
}

export default StudentResourceDisplay