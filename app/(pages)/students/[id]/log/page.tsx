import SubHeading from "@/app/ui/components/SubHeading";
import PageTitle from "../../../../ui/components/PageTitle";
import PracticeButton from "./PracticeButton";
import Link from "next/link";
import LogDisplay from "@/app/ui/components/LogDisplay";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import PieChart from "@/app/ui/components/PieChart";
import { Enrollee, logRow, WeeklyPractice } from "@/app/types";



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
    const {data:student}: {data?: Enrollee} = await fetchJSONWithToken<Enrollee>(`${apiURL}/students/${id}`)
    const {data:logs}: {data?: logRow[]} = await fetchJSONWithToken<logRow[]>(`${apiURL}/students/${id}/logs?limit=6`);
    const {data:thisWeek}: {data?: WeeklyPractice} = await fetchJSONWithToken<WeeklyPractice>(`${apiURL}/students/${id}/logs/current_week`);
    if (!student || !logs || !thisWeek) throw new Error("Could not locate student records.")
    return (
        <>
            <PageTitle>Student Portal</PageTitle>
            <p>{student.name}</p>
            <SubHeading>Weekly Goal</SubHeading>
            <div className="flex w-full justify-items-center text-center">
                <div className="mx-auto">
                    <PieChart percent={Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)} size={50}/>
                </div>
            </div>
            
            <p>{Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)}%</p>
            <p>{thisWeek.current_week_minutes} of {thisWeek.weekly_goal} minutes</p> 
            <SubHeading>Start practicing</SubHeading>
            <PracticeButton id={id} />
            <SubHeading>Previous Logs</SubHeading>
            <PracticeTotal logs={logs} />
            <div className="grid gap-2">
                {logs && logs.map((log, idx) => {
                    return idx < 5 ?<LogDisplay log={log} key={log.log_id}/> : null
                })}
                {logs && logs.length > 5 && <Link href={`/students/${id}/log/history`} className="text-lighter underline text-right text-sm">...view full list</Link>}
            </div>
            
            

        </>
    )
}