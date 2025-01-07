'use client'

import { EnrolleeWithCurrentWeekPractice } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/ui/components/Buttons";
import { Pencil } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

function EditStudentButton({student, onUpdate}: {student?: EnrolleeWithCurrentWeekPractice, onUpdate: ()=>void}) {
    const [name, setName] = useState(student?.name || '');
    const [subject, setSubject] = useState(student?.subject || '');
    const [dow, setDow] = useState(student?.day_of_week || 0);
    const [weeklyGoal, setWeeklyGoal] = useState(student?.weekly_goal || 0);
    const [isEditing, setIsEditing] = useState(false);
    const modalRef = useRef<HTMLDialogElement>(null);

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
                onUpdate();
            })
            .catch(err => {
                console.error(err);
            })
    }


  return (
    <>
        <button 
            onClick={()=>setIsEditing(true)}
            className="grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-full w-fit outline outline-0 outline-white transition-all hover:scale-105 hover:outline-2">
            <Pencil aria-label="Pencil" size={20} />
        </button>
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                onSubmit={handleUpdate}
                className="grid gap-4 bg-transparent">
                    <p className="text-zinc-400 font-light text-center">Editing student details</p>
                <label htmlFor="name" className="font-golos font-bold text-shadow">Name</label>
                <input 
                    className="p-2 bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded" 
                    type="text" name="name" value={name} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}}/>
                <label htmlFor="subject" className="font-golos font-bold text-shadow">Subject</label>
                <input 
                    className="p-2 bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded" 
                    type="text" name="subject" value={subject} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}}/>
                <label htmlFor="weeklyGoal" className="font-golos font-bold text-shadow">Practice Goal</label>
                <input 
                    className="p-2 bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded" 
                    type="number" name="weeklyGoal" value={weeklyGoal} 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}}/>
                <label htmlFor="dow" className="font-golos font-bold text-shadow">Lesson Day</label>
                <select 
                    className="p-2 bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded" 
                    name="dow" value={dow} onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setDow(e.target.value)}}>
                    <option value={0}>Sunday</option>
                    <option value={1}>Monday</option>
                    <option value={2}>Tuesday</option>
                    <option value={3}>Wednesday</option>
                    <option value={4}>Thursday</option>
                    <option value={5}>Friday</option>
                    <option value={6}>Saturday</option>
                </select>
                <div className="mx-auto mt-4">
                    <PrimaryButton 
                        type="submit" 
                        onClick={()=>null}>
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
            <div className="flex justify-items-end">
                <SecondaryButton size='sm' onClick={()=>{setIsEditing(false)}} className="py-0 my-4 mx-auto">Cancel</SecondaryButton>
            </div>
        </dialog>
    </>
  )
}

export default EditStudentButton