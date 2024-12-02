import { Resource } from "@/app/types"
import { Camera, File, Headphones, Link as LinkIcon, Video } from "lucide-react"
import Link from "next/link"


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


function StudentResourceDisplay({r}: {r: Resource}) {

  return (
    
        r && <div className="flex justify-between align-items-center border-[1px] border-txtsecondary rounded p-2 w-full">
            <div className="flex gap-2 align-items-center">
                <ResourceIcon t={r.type} />
                <Link href={r.url} target="blank">{r.title}</Link>
            </div>
        </div>
  )
}

export default StudentResourceDisplay