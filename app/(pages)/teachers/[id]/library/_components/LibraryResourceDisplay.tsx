import ResourceIcon from "@/app/_ui_components/object_display/ResourceIcon";
import { LibraryResource } from "@/app/types";
import { Trash, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import AssignResourceButton from "./AssignResourceButton";


function LibraryResourceDisplay({r}: {r: LibraryResource}) {


  return (
    
        r && <li className="flex gap-4 justify-between align-items-center bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded p-2 w-full">
            <div className="flex-1 flex align-items-center">
                
                <Link href={r.url} target="blank" className="w-full flex gap-2"><ResourceIcon t={r.type} /> {r.title}</Link>
            </div>
            <AssignResourceButton resource={r} />
            <button>
                <Trash aria-label="Trash Can" className="brightness-90 cursor-pointer transition-all hover:scale-105 hover:brightness-105"/>
            </button>
        </li>
  )
}

export default LibraryResourceDisplay