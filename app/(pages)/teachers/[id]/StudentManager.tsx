'use client'

import { Goal, Resource, StudentDetails } from "@/app/types";
import { MessageCircle, MessageCircleWarning, QrCode } from "lucide-react";
import Link from "next/link";
import ResourcesManager from "./ResourcesManager";
import GoalsManager from "./GoalsManager";
import EditStudentButton from "../../../ui/components/EditStudentButton";
import NewGoalButton from "../../../ui/components/NewGoalButton";
import LogManager from "./LogManager";
import NewResourceButton from "@/app/ui/components/NewResourceButton";
import {ActionType} from '../../../_activeStudentReducer/activeStudentReducer'
import DeleteStudentButton from "@/app/ui/components/DeleteStudentButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function StudentManager({details, dispatch}: {details?: StudentDetails, dispatch: (action: ActionType)=>void}) {
    const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);
    const router = useRouter();
    useEffect(()=>{
        if (!details) return;
        const checkForMessages = async () => {
            const res = await fetch(`/api/students/${details?.student.id}/messages/unread`);
            if (res.ok) {
                const {data} = await res.json();
                setHasNewMessage(data != 0)
            }
        }
        checkForMessages()
    }, [details])
    if (!details) {
        return (
            <>
                <section className="w-full max-w-[600px] bg-secondary rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none grid place-items-center h-full">
                    <span className="text-txtsecondary">Select a student to view details</span>
                </section>
            </>
        )
    }

    function handleDeleteStudent() {
        dispatch({type: 'SET_SELECTED_STUDENT', payload: undefined}); 
        router.refresh()
    }

    return (
        <>
            <section className="w-full max-w-[600px] bg-secondary rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none">
                        <div className="flex gap-2 justify-between items-center mb-4">
                            <h3 className="font-bold text-lg grid"><span>{details.student.name}</span><span className="text-sm font-light">{details.student.subject}</span></h3>
                            <div className="flex gap-2">
                                <Link href={`/students/${details.student.id}/messages`}>
                                   {hasNewMessage ? <MessageCircleWarning size={40} className="animate-bounce" color="white"/> : <MessageCircle size={40} color="rgb(var(--lighter))"/>}
                                </Link>
                                {details.time != 0 && <Link href={`/students/${details.student.id}/qr_code?code=${details.student.code}&time=${details.time}`} className="text-lighter underline"><QrCode size={40}/></Link>}
                            </div>
                        </div>
                        <p className="font-light">Next Lesson: {details.nextLessonDay}</p>


                            <LogManager logs={details.logs} />

                        <GoalsManager 
                            goals={details.goals} 
                            onUpdate={(g: Goal)=>{dispatch({type: 'UPDATE_GOAL', payload: {goal: g}})}} 
                            onDelete={(id: string)=>{dispatch({type: 'DELETE_GOAL', payload: {goalId: id}})}}
                        />
                        {details.goals && <NewGoalButton 
                            student_id={details.student.id} 
                            onCreate={(g: Goal)=>{dispatch({type: 'CREATE_GOAL', payload: {goal: g}})}}
                        />}

                        <ResourcesManager 
                            resources={details.resources} 
                            onDelete={(id: string)=>{dispatch({type: 'DELETE_RESOURCE', payload: {resourceId: id}})}}
                        />

                        {<NewResourceButton 
                            student_id={details.student.id} 
                            onCreate={(r: Resource)=>{dispatch({type: 'CREATE_RESOURCE', payload: {resource: r}})}}
                        />}

                        <div className="w-full flex gap-2 justify-evenly items-center mt-4 border-t-[1px] border-t-txtsecondary pt-4">
                            <EditStudentButton student={details.student} />
                            <DeleteStudentButton student={details.student} onDelete={handleDeleteStudent}/>
                        </div>
            </section>
        </>
    )
}

export default StudentManager