'use client'
import { EnrolleeWithCurrentWeekPractice, logRow } from "@/app/types";
import { PrimaryButton, } from "@/app/ui/components/Buttons";
import PracticeLogList from "@/app/ui/components/PracticeLogList";
import SubHeading from "@/app/ui/components/SubHeading";
import { Pencil, PlusCircle, QrCode, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

function StudentManager({student, setSelected}: {student?: EnrolleeWithCurrentWeekPractice, setSelected: (u?: EnrolleeWithCurrentWeekPractice)=>void}) {
    
    const siteURL = process.env.NEXT_PUBLIC_SITE_URL_BASE;
    const [activeLog, setActiveLog] = useState<logRow[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [time, setTime] = useState(0);
    const [name, setName] = useState(student?.name || '');
    const [subject, setSubject] = useState(student?.subject || '');
    const [dow, setDow] = useState(student?.day_of_week || 0);
    const [weeklyGoal, setWeeklyGoal] = useState(student?.weekly_goal || 0);
    const [nextLessonDay, setNextLessonDay] = useState<Date>()
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();


    const handleDelete = ()=>{
        fetch(`/api/students/${student?.id}`, {method: 'DELETE'})
            .then(res => {
                if (!res.ok) {
                    throw new Error('Delete request failed')
                }
                return res.json()})
            .then(() => {
                setActiveLog([]);
                setSelected(undefined)
                router.refresh();
            })
            .catch(err => {
                console.error(err);
            })
    }

    const handleUpdate = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fetch(`/api/students/${student?.id}`, {
            method: 'PATCH', 
            headers: {"Content-Type": "application/json"},
            credentials: 'include', 
            body: JSON.stringify({
                name: fd.get('name'),
                subject: fd.get('subject'),
                weeklyGoal: fd.get('weeklyGoal'),
                dow: fd.get('dow')
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Update request failed')
                }
                return res.json()})
            .then(() => {
                setIsEditing(false);
                router.refresh();
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(()=>{
        const getLog = async () => {
            const log = await (await fetch(`/api/students/${student?.id}/logs?limit=6`)).json();
            setActiveLog(() => {
                return log.data ? [...log.data] : [];
            });
        }
        if (student) {
            const d = new Date(student.created_at);
            const time = d.getTime();
            setTime(time);
            getLog();
            const nextLesson = new Date();
            if (student)
            while (nextLesson.getDay() != parseInt(student.day_of_week)) {
                nextLesson.setDate(nextLesson.getDate() + 1);
            }

            setNextLessonDay(nextLesson)
        }
        
    }, [student])

    useEffect(()=>{
        if (isEditing) {
            setName(student?.name || '');
            setSubject(student?.subject || '');
            setWeeklyGoal(student?.weekly_goal || 0);
            setDow(student?.day_of_week || 0);
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isEditing, student?.day_of_week, student?.name, student?.subject, student?.weekly_goal])
  return (
    <>
        <section className="w-full max-w-[600px] bg-secondary rounded-b-lg p-4 lg:rounded-r-lg lg:rounded-bl-none">
            {student && 
                <>
                    <div className="flex gap-2 justify-between items-center mb-4">
                        <h3 className="font-bold text-lg grid"><span>{student?.name}</span><span className="text-sm font-light">{student.subject}</span></h3>
                        <Link href={`${siteURL}/students/${student.id}/qr_code?code=${student.code}&time=${time}`} className="text-lighter underline"><QrCode size={40}/></Link>
                    </div>
                    <p className="font-light">Next Lesson: {nextLessonDay ? nextLessonDay.toDateString() : 'unknown'}</p>
                    <SubHeading className="mb-1 mt-2">Recent Logs</SubHeading>
                    <PracticeLogList logs={activeLog} />
                    <SubHeading className="mb-1 mt-2">Goals</SubHeading>
                    <PrimaryButton onClick={undefined} className="flex justify-between mx-auto px-4 min-w-48">Add Goal<PlusCircle /></PrimaryButton>
                    <SubHeading className="mb-1 mt-2">Resources</SubHeading>
                    <PrimaryButton onClick={undefined} className="flex justify-between mx-auto px-4 min-w-48">Add Resource<PlusCircle /></PrimaryButton>

                    <div className="w-full flex gap-2 justify-evenly items-center mt-4 border-t-[1px] border-t-txtsecondary pt-4">
                        <button 
                            onClick={()=>setIsEditing(true)}
                            className="grid place-items-center bg-primary p-2 rounded-full w-fit hover:brightness-110">
                            <Pencil size={20} />
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="grid place-items-center bg-primary p-2 rounded-full w-fit hover:brightness-110">
                            <Trash size={20} />
                        </button>
                    </div>


                    <dialog ref={modalRef} className="w-full max-w-[600px] p-4 rounded-xl bg-secondary/75 backdrop-blur text-txtprimary border-4 border-lighter">
                        <form 
                            onSubmit={handleUpdate}
                            className="grid gap-2">
                            <label htmlFor="name" className="font-bold">Name</label>
                            <input 
                                className="p-2 bg-black/50 text-txtprimary border-2 border-lighter rounded" 
                                type="text" name="name" value={name} 
                                onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}}/>
                            <label htmlFor="subject" className="font-bold">Subject</label>
                            <input 
                                className="p-2 bg-black/50 text-txtprimary border-2 border-lighter rounded" 
                                type="text" name="subject" value={subject} 
                                onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}}/>
                            <label htmlFor="weeklyGoal" className="font-bold">Practice Goal</label>
                            <input 
                                className="p-2 bg-black/50 text-txtprimary border-2 border-lighter rounded" 
                                type="number" name="weeklyGoal" value={weeklyGoal} 
                                onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}}/>
                            <label htmlFor="dow" className="font-bold">Lesson Day</label>
                            <select 
                                className="p-2 bg-black/50 text-txtprimary border-2 border-lighter rounded" 
                                name="dow" value={dow} onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setDow(e.target.value)}}>
                                <option value={0}>Sunday</option>
                                <option value={1}>Monday</option>
                                <option value={2}>Tuesday</option>
                                <option value={3}>Wednesday</option>
                                <option value={4}>Thursday</option>
                                <option value={5}>Friday</option>
                                <option value={6}>Saturday</option>
                            </select>
                            <div className="mx-auto">
                                <PrimaryButton 
                                    type="submit" 
                                    onClick={()=>null}>
                                    Save Changes
                                </PrimaryButton>
                            </div>
                        </form>
                        <div className="flex justify-items-end"><button onClick={()=>{setIsEditing(false)}} className="ml-auto bg-secondary border-[1px] border-txtprimary rounded p-2">Cancel</button></div>
                    </dialog>
                </>
            }
            
        </section>
    </>
  )
}

export default StudentManager