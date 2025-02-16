'use client'

import { Enrollee, Group } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/_ui_components/layout/Buttons";
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Students } from "@/app/api/_controllers/studentController";
import { Groups } from "@/app/api/_controllers/tableControllers";
import { Plus } from "lucide-react";



function NewStudentButton({teacher_id, onCreate}: {teacher_id: string, onCreate: (s: Enrollee)=>void}) {
    
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [dow, setDow] = useState("0");
    const [weeklyGoal, setWeeklyGoal] = useState(60);
    const [groupId, setGroupId] = useState<string | undefined>('0');
    const [timeOfDay, setTimeOfDay] = useState<string | undefined>('15:00');
    const [duration, setDuration] = useState('30');
    const [groups, setGroups] = useState<Group[]>([])
    const [hasError, setHasError] = useState('');
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleEnroll = () => {
        Students.createOne({
            name,
            subject,
            teacher_id,
            day_of_week: dow,
            weekly_goal: weeklyGoal,
            time_of_day: timeOfDay,
            duration: parseInt(duration),
            group_id: groupId == '0' ? null : groupId,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }).then(newStudent => {
            if (!newStudent) {
                setHasError('Could not create student.')
                return;
            }
            setName('');
            setIsOpen(false);
            onCreate(newStudent)
            
        }).catch(error => {
            console.error(error);
            setHasError('Could not create student');
        }) 
    }

    useEffect(()=>{
        if (hasError) {
            setTimeout(()=>{
                setHasError('')
            }, 4000)
        }
    }, [hasError])

    useEffect(()=>{
        const populateGroups = async () => {
            Groups(teacher_id).getAll()
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
  return (
    <>
        <SecondaryButton onClick={()=>setIsOpen(!isOpen)} className="text-sm px-8 text-txtprimary text-center text-nowrap" size="sm">New Student <Plus aria-label="Plus Sign" size={16} className="inline ml-1" /></SecondaryButton>

        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    if (name.length > 3 && subject.length > 3) {
                        handleEnroll()
                    }
                }}
                className="grid gap-4 p-2 w-full"
            >
                <p className="text-center text-zince-400 font-inter font-light p-1 border-2 rounded" style={{borderColor: hasError ? 'red' : 'transparent'}}>{hasError ? hasError : 'Add a new student'}</p>
                <label htmlFor="name" className="font-bold font-golos text-txtprimary">Student Name 
                <input
                    id='name' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
                <label htmlFor="subject" className="font-bold font-golos text-txtprimary">Subject or Instrument
                <input
                    id='subject' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
                <label htmlFor="weeklyGoal" className="font-bold font-golos text-txtprimary">Weekly Practice Goal <span className="font-light text-sm">( in minutes )</span>
                <input
                    id='weeklyGoal' 
                    type="number" 
                    defaultValue={60}
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
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
                                      <select onChange={(e)=>{setGroupId(e.target.value)}} name="group_id" id="group_id" className="block bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-zinc-400 p-2 w-full truncate rounded">
                        <option value={'0'}>No Group</option>
                        {groups?.map(group => <option key={group.id} value={group.id} style={{background: group.color}}>{group.name}</option>)}
                                      </select>
                        
                    </div>
                    <div>
                        <label htmlFor="duration" className="block font-bold font-golos text-txtprimary">Lesson Length</label>
                        <select name="duration" id="duration" defaultValue='30' onChange={(e)=>setDuration(e.target.value)} className="block bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-zinc-400 p-2 px-3 w-full truncate rounded">
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                        </select>
                    </div>
                </div>
          
                <div className="w-full grid place-items-center gap-2 mt-4">
                    <PrimaryButton
                    type="submit"
                    onClick={undefined}
                    disabled={name.length <= 3 || subject.length <= 3}
                    size="md"
                                >
                    Enroll
                                </PrimaryButton>
                                <SecondaryButton size='sm' onClick={()=>setIsOpen(!isOpen)} className="py-0 mx-auto">Cancel</SecondaryButton>
                </div>
            
            </form>
            </dialog>

    </>
  )
}

export default NewStudentButton