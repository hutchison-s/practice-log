'use client'

import { EnrolleeWithCurrentWeekPractice } from "@/app/types";
import { PrimaryButton } from "@/app/ui/components/Buttons";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

function EditStudentButton({student}: {student?: EnrolleeWithCurrentWeekPractice}) {
    const [name, setName] = useState(student?.name || '');
    const [subject, setSubject] = useState(student?.subject || '');
    const [dow, setDow] = useState(student?.day_of_week || 0);
    const [weeklyGoal, setWeeklyGoal] = useState(student?.weekly_goal || 0);
    const [isEditing, setIsEditing] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

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


  return (
    <>
        <button 
            onClick={()=>setIsEditing(true)}
            className="grid place-items-center bg-primary p-2 rounded-full w-fit hover:brightness-110">
            <Pencil size={20} />
        </button>
        <dialog ref={modalRef} className="w-full max-w-[600px] p-4 rounded-xl bg-secondary/75 backdrop-blur text-txtprimary border-4 border-lighter">
            <form 
                onSubmit={handleUpdate}
                className="grid gap-2">
                <label htmlFor="name" className="font-bold">Name</label>
                <input 
                    className="p-2 bg-black/25 text-txtprimary border-2 border-lighter rounded" 
                    type="text" name="name" value={name} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}}/>
                <label htmlFor="subject" className="font-bold">Subject</label>
                <input 
                    className="p-2 bg-black/25 text-txtprimary border-2 border-lighter rounded" 
                    type="text" name="subject" value={subject} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}}/>
                <label htmlFor="weeklyGoal" className="font-bold">Practice Goal</label>
                <input 
                    className="p-2 bg-black/25 text-txtprimary border-2 border-lighter rounded" 
                    type="number" name="weeklyGoal" value={weeklyGoal} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}}/>
                <label htmlFor="dow" className="font-bold">Lesson Day</label>
                <select 
                    className="p-2 bg-black/25 text-txtprimary border-2 border-lighter rounded" 
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
  )
}

export default EditStudentButton