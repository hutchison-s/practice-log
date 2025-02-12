import { Camera, Video, Headphones, LinkIcon, File } from "lucide-react"

export default function ResourceIcon({t}: {t: string}) {
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