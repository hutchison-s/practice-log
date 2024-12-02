import SubHeading from "@/app/ui/components/SubHeading";
import PageTitle from "../../../../ui/components/PageTitle";
import PracticeButton from "./PracticeButton";
import Link from "next/link";
import LogDisplay from "@/app/ui/components/LogDisplay";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import PieChart from "@/app/ui/components/PieChart";
import { Enrollee, Goal, logRow, Resource, WeeklyPractice } from "@/app/types";
import StudentGoalDisplay from "@/app/ui/components/StudentGoalDisplay";
import StudentResourceDisplay from "@/app/ui/components/StudentResourceDisplay";



function PracticeTotal({logs}: {logs: logRow[]}) {
    
    if (!logs || logs.length == 0) {
        return <h3 className="font-bold text-xl">No practice logged yet...</h3>
    }
    const totalSeconds = logs.reduce((sum, log) => sum + log.seconds, 0);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remSeconds = totalSeconds % 60;
    let timeString = remSeconds+" seconds"
    if (totalMinutes > 0) {
        timeString = totalMinutes + " minutes and " + timeString; 
    }
    return (
        <h3 className="font-bold text-xl">Total Practice Logged: {timeString}</h3>
    )
}

export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data} = await fetchJSONWithToken<{student: Enrollee, logs: logRow[], resources: Resource[], goals: Goal[], thisWeek: WeeklyPractice}>(`${apiURL}/students/${id}/details`);
    if (!data) throw new Error("Server error")
    const {student, logs, resources, goals, thisWeek} = data;

    if (!student) throw new Error("Could not locate student records.")

    return (
        <>
            <PageTitle>Student Portal</PageTitle>
            <p className="mb-8">{student.name}</p>
            <SubHeading>Weekly Goal</SubHeading>
            <div className="flex w-full justify-items-center text-center">
                <div className="mx-auto">
                    {thisWeek 
                        ? <PieChart percent={Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)} size={50}/>
                        : <PieChart percent={0} size={50} />
                    }
                </div>
            </div>
            
            {thisWeek 
                ? <p>{Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)}%</p>
                : <p>0%</p>
            }
            <p>{thisWeek ? thisWeek.current_week_minutes : 0} of {student.weekly_goal} minutes</p>
            <PracticeButton id={id} />
            <SubHeading className="mt-8">Active Goals</SubHeading>
            <div className="grid gap-2 w-full p-2 max-w-[600px]">
                {goals?.map(g => <StudentGoalDisplay goal={g} key={g.id} />)}
            </div>
            <SubHeading>Resources</SubHeading>
            <div className="grid gap-2 w-full p-2 max-w-[600px]">
                {resources?.map(r => <StudentResourceDisplay key={r.id} r={r}/>)}
            </div>
            <SubHeading>Previous Logs</SubHeading>
            <PracticeTotal logs={logs || []} />
            <div className="grid gap-2">
                {logs && logs.map((log, idx) => {
                    return idx < 5 ?<LogDisplay log={log} key={log.log_id}/> : null
                })}
                {logs && logs.length > 5 && <Link href={`/students/${id}/log/history`} className="text-lighter underline text-right text-sm">...view full list</Link>}
            </div>
            
            

        </>
    )
}