'use client'

import { Enrollee, Group } from "@/app/types";
import { PrimaryButton, SecondaryButton } from "@/app/_ui_components/layout/Buttons";
import { ChangeEvent, useEffect, useRef, useState } from "react"



function NewStudentButton({teacher_id, onCreate}: {teacher_id: string, onCreate: (s: Enrollee)=>void}) {
    
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [dow, setDow] = useState("0");
    const [weeklyGoal, setWeeklyGoal] = useState(60);
    const [groupId, setGroupId] = useState<string | undefined>('0');
    const [timeOfDay, setTimeOfDay] = useState<string | undefined>('15:00');
    const [groups, setGroups] = useState<Group[]>([])
    const [hasError, setHasError] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const modalRef = useRef<HTMLDialogElement>(null);

    const handleEnroll = () => {
        console.log('ernolling new student')
        console.trace()
        fetch(`/api/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                subject,
                teacher_id,
                dow,
                weeklyGoal,
                time_of_day: timeOfDay,
                group_id: groupId == '0' ? null : groupId,
            })
        }).then(async res => {
            if (!res.ok) {
                throw new Error('Failed to create student')
            }
            const data = await res.json();
            console.log(data.message)
            setName('');
            setIsOpen(false);
            onCreate(data.data)
            
        }).catch(error => {
            console.error(error);
            setHasError(true);
        }) 
    }

    useEffect(()=>{
        if (hasError) {
            formRef.current?.classList.add('bg-red-500');
            setTimeout(()=>{
                formRef.current?.classList.remove('bg-red-500');
                formRef.current?.reset();
                setName('');
                setSubject('');
            }, 2000)
        }
    }, [hasError])

    useEffect(()=>{
        const populateGroups = async () => {
            fetch(`/api/teachers/${teacher_id}/groups`)
            .then(res => res.json())
            .then(json => {
              setGroups([...json.data])
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
        <PrimaryButton onClick={()=>setIsOpen(!isOpen)}>Create New Student</PrimaryButton>

        <dialog ref={modalRef} className="w-[90vw] max-w-[600px] p-4 rounded-xl bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background backdrop-blur-2xl text-txtprimary border-[1px] border-white/25 md:p-8">
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    if (name.length > 3 && subject.length > 3) {
                        handleEnroll()
                    }
                }}
                className="grid gap-4 p-4 w-full"
            >
                <p className="text-center text-zince-400 font-inter font-light">Add a new student</p>
                <label htmlFor="name" className="font-bold font-golos text-white">Student Name 
                <input
                    id='name' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
                <label htmlFor="subject" className="font-bold font-golos text-white">Subject or Instrument
                <input
                    id='subject' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
                <label htmlFor="weeklyGoal" className="font-bold font-golos text-white">Weekly Practice Goal <span className="font-light text-sm">( in minutes )</span>
                <input
                    id='weeklyGoal' 
                    type="number" 
                    defaultValue={60}
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}} 
                    className='w-full p-2 border-[1px] border-white/25 rounded bg-background/50 font-inter font-light text-zinc-400'
                /></label>
                <div className="w-full flex gap-1">
                    <div className="w-[60%]">
                        <label htmlFor="dow" className="font-golos font-bold text-shadow">Lesson Day</label>
                        <select
                            className="w-full p-[0.65rem] text-md bg-background/50 text-zinc-400 border-[1px] border-white/25 rounded"
                            name="dow" value={dow} onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setDow(e.target.value)}}>
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                        </select>
                    </div>
                    <div className="w-[40%]">
                        <label htmlFor="time" className="font-golos font-bold text-shadow">Time</label>
                        <input className="w-full p-2 bg-background/50 text-md font-inter text-zinc-400 border-[1px] border-white/25 rounded" type="time" name="time" id="time" value={timeOfDay} onChange={(e)=>setTimeOfDay(e.target.value)} />
                    </div>
                </div>
                <label className=" font-bold font-golos text-white">
                  Assign to a group:
              <select onChange={(e)=>{setGroupId(e.target.value)}} name="group_id" id="group_id" className="bg-background/25 border-[1px] border-white/25 text-md font-inter font-light text-zinc-400 p-2 w-full truncate rounded-xl">
                <option value={'0'}>No Group</option>
                {groups?.map(group => <option key={group.id} value={group.id} style={{background: group.color}}>{group.name}</option>)}
              </select>
          </label>
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