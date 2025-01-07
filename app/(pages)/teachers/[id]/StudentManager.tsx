'use client'

import { Goal, Resource, StudentDetails } from "@/app/types";
import { Loader, MessageCircle, MessageCircleWarning, QrCode } from "lucide-react";
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
import SubHeading from "@/app/ui/components/SubHeading";
import Elipsis from "@/app/ui/components/Elipsis";
import BodyText from "@/app/ui/components/BodyText";

function StudentManager({details, dispatch}: {details?: StudentDetails, dispatch: (action: ActionType)=>void}) {
    const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState(false)
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

    useEffect(()=>{
        if (details && details.time && details?.time != 0) {
            setIsLoaded(true)
        } else {
            setIsLoaded(false)
        }
    }, [details?.time])


    if (!details) {
        return (
            <>
                <section className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none grid place-items-center h-full">
                    <span className="text-zinc-400">Select a student to view details</span>
                </section>
            </>
        )
    }

    function handleDeleteStudent() {
        dispatch({type: 'SET_SELECTED_STUDENT', payload: undefined}); 
        router.refresh()
    }

    function handleUpdateStudent() {
        dispatch({type: 'SET_SELECTED_STUDENT', payload: undefined})
        router.refresh();
    }

    return (
        <>
            <section className="w-full max-w-[600px] glass rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none">
                        <div className="flex gap-2 justify-between items-center mb-4">
                            <h3 className="font-golos font-bold text-lg grid md:text-2xl"><span>{details.student.name}</span><span className="text-sm font-inter font-light md:text-xl">{details.student.subject}</span></h3>
                            <div className="flex gap-2">
                                <Link href={`/students/${details.student.id}/messages`} className="text-teal-500">
                                   {hasNewMessage ? <MessageCircleWarning size={40} className="animate-bounce" color="white"/> : <MessageCircle size={40} className="transition-all hover:text-teal-300 hover:scale-105"/>}
                                </Link>
                                {details.time != 0 
                                    ? <Link href={`/students/${details.student.id}/qr_code?code=${details.student.code}&time=${details.time}`} className="text-teal-500"><QrCode size={40} className="transition-all hover:text-teal-300 hover:scale-105"/></Link>
                                    : <Loader aria-label="Loader" size={40} className="spinner"/>
                                }
                            </div>
                        </div>
                        <p className="font-light text-zinc-400">Next Lesson: {details.nextLessonDay}</p>

                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Recent Logs</SubHeading>
                        {isLoaded && details.logs.length == 0 && <BodyText className="font-light">No logs yet</BodyText>}
                        {isLoaded
                            ? <LogManager logs={details.logs} />
                            : <Elipsis />
                        }
                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Goals</SubHeading>
                        <GoalsManager 
                            goals={details.goals} 
                            onUpdate={(g: Goal)=>{dispatch({type: 'UPDATE_GOAL', payload: {goal: g}})}} 
                            onDelete={(id: string)=>{dispatch({type: 'DELETE_GOAL', payload: {goalId: id}})}}
                        />
                        {isLoaded && details.goals.length == 0 && <BodyText className="font-light">No goals yet</BodyText>}
                        {isLoaded 
                            ? <NewGoalButton 
                                    student_id={details.student.id} 
                                    onCreate={(g: Goal)=>{dispatch({type: 'CREATE_GOAL', payload: {goal: g}})}}
                                />
                            : <Elipsis/>
                        }
                        <SubHeading className="mb-1 mt-4 border-t-2 border-t-background/50 pt-4">Resources</SubHeading>
                        <ResourcesManager 
                            resources={details.resources} 
                            onDelete={(id: string)=>{dispatch({type: 'DELETE_RESOURCE', payload: {resourceId: id}})}}
                        />
                        {isLoaded && details.resources.length == 0 && <BodyText className="font-light">No resources yet</BodyText>}
                        {isLoaded
                            ? <NewResourceButton 
                                student_id={details.student.id} 
                                onCreate={(r: Resource)=>{dispatch({type: 'CREATE_RESOURCE', payload: {resource: r}})}}
                              />
                            : <Elipsis />
                        }

                        <div className="w-full flex gap-2 justify-evenly items-center mt-4 border-t-2 border-t-background/50 pt-4">
                            <EditStudentButton student={details.student} onUpdate={handleUpdateStudent}/>
                            <DeleteStudentButton student={details.student} onDelete={handleDeleteStudent}/>
                        </div>
            </section>
        </>
    )
}

export default StudentManager