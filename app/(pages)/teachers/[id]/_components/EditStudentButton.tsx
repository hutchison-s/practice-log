'use client'

import { Enrollee, Group } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/_ui_components/layout/Buttons";
import { Pencil } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Students } from "@/app/api/_controllers/studentController";
import { Groups } from "@/app/api/_controllers/tableControllers";

function EditStudentButton({student, onUpdate, onCancel}: {student?: Enrollee, onUpdate: (s: Enrollee)=>void, onCancel: ()=>void}) {
    const [name, setName] = useState(student?.name || '');
    const [subject, setSubject] = useState(student?.subject || '');
    const [dow, setDow] = useState(student?.day_of_week || 0);
    const [weeklyGoal, setWeeklyGoal] = useState(student?.weekly_goal || 0);
    const [groupId, setGroupId] = useState<string | undefined>('0');
    const [timeOfDay, setTimeOfDay] = useState<string | undefined>('00:00');
    const [duration, setDuration] = useState(String(student?.duration))
    const [groups, setGroups] = useState<Group[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const [hasError, setHasError] = useState('')
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(()=>{
        if (isOpen) {
            setName(student?.name || '');
            setSubject(student?.subject || '');
            setWeeklyGoal(student?.weekly_goal || 0);
            setDow(student?.day_of_week || 0);
        }
    }, [isOpen, student?.day_of_week, student?.name, student?.subject, student?.weekly_goal])

    const handleUpdate = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        if (!student) return;
        Students.updateOne(student?.id, {
                name: fd.get('name') as string,
                subject: fd.get('subject') as string,
                weekly_goal: parseInt(fd.get('weeklyGoal') as string),
                day_of_week: fd.get('dow') as string,
                time_of_day: fd.get('time') as string,
                duration: parseInt(fd.get('duration') as string),
                group_id: groupId == '0' ? null : groupId,
            })
            .then((updatedStudent) => {
                if (!updatedStudent) {
                    setHasError('Could not create student')
                    return;
                }
                onUpdate({...updatedStudent, group_color: groups.find(g => g.id == groupId)?.color || '#000000'});
                setIsOpen(false);    
            })
            .catch(err => {
                console.error(err);
            })
    }

    useEffect(()=>{
        const populateGroups = async () => {
            if (!student) return;
            Groups(student?.teacher_id).getAll()
            .then(gList => {
              setGroups([...gList])
              modalRef.current?.showModal();
            })
            .catch(err => console.error(err))
          }
        if (isOpen) {
            populateGroups()
        } else {
            modalRef.current?.close()
        }
    }, [isOpen])

    useEffect(()=>{
        if (hasError) {
            setTimeout(()=>{
                setHasError('')
            }, 4000)
        }
    }, [hasError])

    useEffect(()=>{
        setGroupId(student?.group_id || '0')
        setTimeOfDay(student?.time_of_day.split('+')[0])
        setDuration(String(student?.duration))
    }, [student?.group_id, student?.time_of_day, student?.duration, student?.id])


  return (
    <>
        <button 
            onClick={()=>setIsOpen(true)}
            className="grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-full size-fit outline outline-0 outline-white transition-all hover:scale-105 hover:outline-2">
            <Pencil aria-label="Pencil" size={20} />
        </button>
        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                onSubmit={handleUpdate}
                className="grid gap-4 bg-transparent">
                    <p className="text-zinc-400 font-light text-center p-1 border-2 rounded" style={{borderColor: hasError ? 'red' : 'transparent'}}>{hasError ? hasError : 'Editing student details'}</p>
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
                
                <div className="w-full flex gap-1">
                    <div className="flex-1">
                        <label htmlFor="dow" className="font-golos font-bold text-shadow">Lesson Day</label>
                        <select
                            className="w-full p-[0.65rem] text-md bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded"
                            name="dow" value={dow} onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setDow(e.target.value)}}>
                            <option value={0} className="bg-background text-white">Sunday</option>
                            <option value={1} className="bg-background text-white">Monday</option>
                            <option value={2} className="bg-background text-white">Tuesday</option>
                            <option value={3} className="bg-background text-white">Wednesday</option>
                            <option value={4} className="bg-background text-white">Thursday</option>
                            <option value={5} className="bg-background text-white">Friday</option>
                            <option value={6} className="bg-background text-white">Saturday</option>
                        </select>
                    </div>
                    <div className="">
                        <label htmlFor="time" className="block font-golos font-bold text-shadow">Time</label>
                        <input className="block w-full p-2 bg-background/50 text-md font-inter text-zinc-400 border-[1px] border-white/25 rounded" type="time" name="time" id="time" value={timeOfDay} onChange={(e)=>setTimeOfDay(e.target.value)} />
                    </div>
                </div>
                
                <div className="w-full flex gap-1">
                    <div className="flex-1">
                        <label htmlFor="group_id" className="block font-bold font-golos text-txtprimary">
                          Assign to group:</label>
                                      <select onChange={(e)=>{setGroupId(e.target.value)}} value={groupId} name="group_id" id="group_id" className="block bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-zinc-400 p-2 w-full truncate rounded">
                        <option value={'0'}>No Group</option>
                        {groups?.map(group => <option key={group.id} value={group.id} style={{background: group.color}}>{group.name}</option>)}
                                      </select>
                        
                    </div>
                    <div>
                        <label htmlFor="duration" className="block font-bold font-golos text-txtprimary">Lesson Length</label>
                        <select name="duration" id="duration" value={duration} onChange={(e)=>setDuration(e.target.value)} className="block bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-zinc-400 p-2 px-3 w-full truncate rounded">
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                        </select>
                    </div>
                </div>
                <div className="mx-auto mt-4">
                    <PrimaryButton 
                        type="submit" 
                        onClick={()=>null}>
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
            <div className="flex justify-items-end">
                <SecondaryButton size='sm' onClick={()=>{setIsOpen(false); onCancel()}} className="py-0 my-4 mx-auto">Cancel</SecondaryButton>
            </div>
        </dialog>
    </>
  )
}

export default EditStudentButton