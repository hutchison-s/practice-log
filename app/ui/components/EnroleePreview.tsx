import { EnrolleeWithCurrentWeekPractice } from "@/app/types";
import PieChart from "./PieChart";

function EnroleePreview({student, isSelected, onClick}: {student: EnrolleeWithCurrentWeekPractice, isSelected: boolean, onClick: ()=>void}) {
    const weekSum = Number.isNaN(parseInt(student.current_week_minutes || "0")) ? 0 : Math.round(parseInt(student.current_week_minutes || "0"));
    const weekGoal = student.weekly_goal;
    const percent = Math.min(Math.round((weekSum / parseInt(weekGoal)) * 100), 100);
    const goalDisplay = `${percent}%`

  return (
    <>
          <li className={`w-full items-center grid grid-cols-5 gap-2 px-4 p-2 rounded-lg cursor-pointer ${isSelected ? 'bg-gradient-to-tl from-indigo-950/75 to-indigo-800/75 border-[1px] border-white/25 backdrop-blur' : 'glass'} hover:brightness-110`} onClick={onClick} onKeyUp={(e)=>{if (e.key == 'Enter') {onClick()}}} role="button" tabIndex={0}>
              <p className="col-span-2 truncate">{student.name}</p>
              <p className="col-span-2 truncate font-light text-sm text-zinc-400">{student.subject}</p>
              <div className="flex items-center justify-items-end align-center gap-2">
                <PieChart percent={percent} size={20}/>
                <span className="text-sm font-light">
                    {goalDisplay}
                </span>
              </div>
          
          </li>
    </>
  )
}

export default EnroleePreview