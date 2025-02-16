import { LibraryGoal } from "@/app/types";
import AssignGoalButton from "./AssignGoalButton";
import DeleteLibraryGoalButton from "./DeleteLibraryGoalButton";

export default function LibraryGoalDisplay({goal}: {goal: LibraryGoal}) {


  return (
    <li 
        className='relative w-full grid grid-cols-[1fr_2rem_2rem] items-center px-4 py-2 bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur rounded shadow-sm hover:brightness-105'
    > 
        <div>
            <h4>{goal.title}</h4>
            <p className='text-zinc-400 font-light whitespace-pre text-wrap'>{goal.content}</p>
        </div>
        <AssignGoalButton goal={goal} />
        <DeleteLibraryGoalButton goal={goal}/>
        
    </li>
  )
}