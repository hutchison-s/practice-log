import SubHeading from "@/app/ui/components/SubHeading";
import PageTitle from "../../../ui/components/PageTitle";
import PracticeButton from "./PracticeButton";
import Link from "next/link";
import { fetchJSONWithToken } from "@/app/AuthHandler";
import PieChart from "@/app/ui/components/PieChart";
import { Enrollee, Goal, logRow, Resource, User, WeeklyPractice } from "@/app/types";
import { TotalPractice } from "@/app/ui/components/TotalPractice";
import { MessageCircle, MessageCircleWarning } from "lucide-react";
import GlassDiv from "@/app/ui/components/GlassDiv";
import { Metadata } from "next";
import PracticeLogList from "@/app/ui/components/PracticeLogList";
import GoalsList from "../../teachers/[id]/GoalsList";
import ResourceList from "../../teachers/[id]/ResourceList";

export const metadata: Metadata = {
    title: "Student Portal",
    description: "Student dashboard for tracking progress, logging practice time, and accessing goals and resources provided by their instructors.",
  };


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const id = (await params).id;
    const {data} = await fetchJSONWithToken<{student: Enrollee, logs: logRow[], resources: Resource[], goals: Goal[], thisWeek: WeeklyPractice}>(`${apiURL}/students/${id}/details`);
    if (!data) throw new Error("Server error");
    const {student, logs, resources, goals, thisWeek} = data;
    if (!student) throw new Error("Could not locate student records.")
    const teacherResponse = await fetchJSONWithToken<User>(`${apiURL}/teachers/${student.teacher_id}`);
    const {data: newMessages} = await fetchJSONWithToken<number>(`${apiURL}/students/${student.id}/messages/unread`);
    const hasNewMessage = newMessages != 0;
    return (
        <>
            <PageTitle>Student Portal</PageTitle>
            <h3 className="font-golos font-bold text-xl -mb-4">{student.name}</h3>
            <div className="text-txtsecondary mb-8 text-center">
                <p className="text-zinc-400">{student.subject}</p>
                <p className="text-zinc-400"><span>with </span><span className="relative text-teal-500">{teacherResponse.data?.name} <Link href={`/students/${id}/messages`} className="absolute left-full top-1/2 -translate-y-1/2 translate-x-2">{hasNewMessage ? <MessageCircleWarning size={40} aria-label="New Message" className="animate-bounce" color="white"/> : <MessageCircle/>}</Link></span></p>
            </div>
            <div className="grid gap-4 justify-center lg:grid-cols-2 w-full">
                <section className="flex flex-col gap-4 items-center border-2 glass rounded-lg p-4 h-fit lg:sticky lg:top-24">
                    <SubHeading>Weekly Goal</SubHeading>
                    <div className="flex w-full justify-items-center text-center">
                        <div className="mx-auto">
                            {thisWeek
                                ? <PieChart aria-label="Pie Chart" percent={Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)} size={50}/>
                                : <PieChart aria-label="Pie Chart" percent={0} size={50} />
                            }
                        </div>
                    </div>
                    
                    {thisWeek
                        ? <p>{Math.round((parseInt(thisWeek.current_week_minutes) / parseInt(thisWeek.weekly_goal)) * 100)}%</p>
                        : <p>0%</p>
                    }
                    <p>{thisWeek ? thisWeek.current_week_minutes : 0} of {student.weekly_goal} minutes</p>
                    <PracticeButton />
                </section>
                <section className="flex flex-col gap-4 items-center">
                <TotalPractice logs={logs || []} />
                    <GlassDiv>
                        <SubHeading className="text-center">Active Goals</SubHeading>
                        {goals && <GoalsList goals={goals.slice(0, 5)} isStudentView/>}
                        {goals?.length > 4 && <Link href={`/students/${id}/goals`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Goals</Link>}
                    </GlassDiv>
                    <GlassDiv>
                        <SubHeading className="text-center">Resources</SubHeading>
                            {resources && <ResourceList resources={resources.slice(0, 5)} isStudentView/>}
                            {resources?.length > 4 && <Link href={`/students/${id}/resources`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Resources</Link>}
                    </GlassDiv>
                    
                </section>
            </div>
            
            <SubHeading className="mt-8">Previous Logs</SubHeading>
                    
                    <div className="grid gap-2 w-full max-w-[600px] mx-auto">
                        {logs && <PracticeLogList logs={logs.slice(0, 5)}/>}
                        {logs && logs.length > 5 && <Link href={`/students/${id}/logs`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Logs</Link>}
                    </div>

        </>
    )
}