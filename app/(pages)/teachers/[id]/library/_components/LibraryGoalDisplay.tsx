import { LibraryGoal } from "@/app/types";
import { Trash } from "lucide-react";
import AssignGoalButton from "./AssignGoalButton";

export default function LibraryGoalDisplay({goal}: {goal: LibraryGoal}) {


  return (
    <li 
        className='relative w-full grid grid-cols-[1fr_3rem_3rem] items-center px-4 py-2 bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded shadow-sm'
    > 
        <div>
            <h4>{goal.title}</h4>
            <p className='text-zinc-400 font-light'>{goal.content}</p>
        </div>
        <AssignGoalButton goal={goal} />
        {/* <button className="grid place-items-center">
            <UserRoundPlus aria-label="Assign to user" className="brightness-90 cursor-pointer transition-all hover:scale-105 hover:brightness-105" />
        </button> */}
        <button className='grid place-items-center'>
            <Trash aria-label="Trash Can"  className='brightness-90 cursor-pointer transition-all hover:scale-105 hover:brightness-105'/>
        </button>
        
    </li>
  )
}