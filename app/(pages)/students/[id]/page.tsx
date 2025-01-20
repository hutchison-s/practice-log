import SubHeading from "@/app/_ui_components/layout/SubHeading";
import PageTitle from "../../../_ui_components/layout/PageTitle";
import PracticeButton from "./_components/PracticeButton";
import Link from "next/link";
import { TotalPractice } from "@/app/(pages)/students/[id]/_components/TotalPractice";
import GlassDiv from "@/app/_ui_components/layout/GlassDiv";
import { Metadata } from "next";
import GoalsList from "../../../_ui_components/object_display/GoalsList";
import ResourceList from "../../../_ui_components/object_display/ResourceList";
import { fetchStudentPageInfo } from "./actions";
import ProgressPieChart from "@/app/_ui_components/ProgressPieChart";
import UnreadMessageNotification from "@/app/_ui_components/UnreadMessageNotification";
import LogDisplay from "@/app/_ui_components/object_display/LogDisplay";

export const metadata: Metadata = {
    title: "Student Portal",
    description: "Student dashboard for tracking progress, logging practice time, and accessing goals and resources provided by their instructors.",
  };


export default async function Page({params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    const {student, teacher, records} = await fetchStudentPageInfo(id);
    return (
        <>
            <PageTitle>Student Portal</PageTitle>
            <h3 className="font-golos font-bold text-xl -mb-4">{student.name}</h3>
            <div className="text-txtsecondary mb-8 text-center">
                <p className="text-zinc-400">{student.subject}</p>
                <p className="text-zinc-400">
                    <span>with </span>
                    <span className="relative text-teal-500">{teacher.name} 
                        <Link href={`/students/${id}/messages`} className="absolute left-full top-1/2 -translate-y-1/2 translate-x-2">
                            <UnreadMessageNotification size={40} student_id={id}/>
                        </Link>
                    </span>
                </p>
            </div>
            <div className="flex flex flex-wrap gap-8 md:gap-4 justify-center w-full">
                <section className="flex-[100%] flex flex-col gap-4 items-center md:flex-[40%] border-2 glass rounded-lg p-4 order-1">
                    <SubHeading>Weekly Goal</SubHeading>
                    <div className="flex w-full justify-items-center text-center">
                        <div className="mx-auto">
                            <ProgressPieChart student_id={id} size={50}/>
                        </div>
                    </div>
                    <PracticeButton />
                </section>
                
                <section className="flex-[100%] flex flex-col gap-4 items-center md:flex-[40%] order-2">
                    <TotalPractice logs={records.logs} />
                    <GlassDiv>
                        <SubHeading className="text-center">Active Goals</SubHeading>
                        <GoalsList goals={records.goals} isStudentView/>
                        <Link href={`/students/${id}/goals`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Goals</Link>
                    </GlassDiv>
                </section>
                <section className="flex-[100%] flex flex-col gap-4 items-center order-4 md:flex-[40%] md:order-3">
                    <GlassDiv>
                        <SubHeading className="text-center">Previous Logs</SubHeading>
                        <div className="grid gap-2 w-full max-w-[600px] mx-auto">
                        <ul className="grid gap-2 w-full max-w-[600px] mx-auto">
                            {records.logs.length > 0 && records.logs.map(each => <LogDisplay key={each.id} log={each} />)}
                        </ul>
                            <Link href={`/students/${id}/logs`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Logs</Link>
                        </div>
                    </GlassDiv>
                </section>
                <section className="flex-[100%] flex flex-col gap-4 items-center md:flex-[40%] order-3 md:order-4">
                    <GlassDiv>
                        <SubHeading className="text-center">Resources</SubHeading>
                            <ResourceList resources={records.resources} />
                            <Link href={`/students/${id}/resources`} className="text-lighter underline text-right text-sm w-full block mt-4">View All Resources</Link>
                    </GlassDiv>
                    
                </section>
                
            </div>
           

        </>
    )
}