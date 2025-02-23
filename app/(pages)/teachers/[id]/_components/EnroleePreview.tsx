import { Enrollee } from "@/app/types";
import AssignGroupButton from "@/app/(pages)/teachers/[id]/_components/AssignGroupButton";
import CurrentWeekPieChart from "../../../../_ui_components/ProgressPieChart";
import Link from "next/link";
import { MessageCircleWarning, MessageCircle } from "lucide-react";

function EnroleePreview({student, isSelected, onClick, onUpdate}: {student: Enrollee, isSelected: boolean, onClick: ()=>void, onUpdate: (s: Enrollee)=>void}) {

  return (
    <>
          <li className='w-full items-center flex' >
              <AssignGroupButton student={student} onAssign={onUpdate}/>
              <div className={`grid grid-cols-8 items-center gap-1 w-full px-2 p-2 rounded-r-lg cursor-pointer ${isSelected ? 'bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur' : 'glass'} hover:brightness-110`} onClick={onClick} onKeyUp={(e)=>{if (e.key == 'Enter') {onClick()}}} role="button" tabIndex={0}>
                <p className="col-span-3 truncate">{student.name}</p>
                <p className="col-span-2 truncate font-light text-sm text-zinc-400 lg:col-span-3">{student.subject}</p>
                <div className="w-full flex justify-center items-center">
                  <Link href={`/students/${student.id}/messages`}>
                  {student.has_unread ? <MessageCircleWarning size={30} className='animate-bounce text-white'/> : <MessageCircle size={30} className='text-teal-500 transition-all hover:text-teal-300 hover:scale-105'/>}
                  </Link>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <CurrentWeekPieChart student_id={student.id} size={18} />
                </div>
              </div>
          
          </li>
    </>
  )
}

export default EnroleePreview