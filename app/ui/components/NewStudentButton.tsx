'use client'

import { PrimaryButton, SecondaryButton } from "@/app/ui/components/Buttons";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react"



function NewStudentButton({teacher_id}: {teacher_id: string}) {
    
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [dow, setDow] = useState("0");
    const [weeklyGoal, setWeeklyGoal] = useState(60);
    const [hasError, setHasError] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    const handleEnroll = () => {
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
                weeklyGoal
            })
        }).then(async res => {
            if (!res.ok) {
                throw new Error('Failed to create student')
            }
            const data = await res.json();
            console.log(data.message)
            setName('');
            setIsOpen(false);
            router.refresh();
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
  return (
    <>
        {isOpen
            ? <SecondaryButton onClick={()=>setIsOpen(!isOpen)}>Cancel</SecondaryButton>
            : <PrimaryButton onClick={()=>setIsOpen(!isOpen)}>Create New Student</PrimaryButton>
        }
        {isOpen &&
            <form 
                onSubmit={(e)=>{
                    e.preventDefault();
                    if (name.length > 3 && subject.length > 3) {
                        handleEnroll()
                    }
                }}
                className="grid w-full max-w-[500px]"
            >
                <label htmlFor="name">Student Name</label> 
                <input
                    id='name' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setName(e.target.value)}} 
                    className='w-full p-2 border-2 border-lighter rounded bg-black/50 focus:outline-none focus:bg-secondary'
                />
                <label htmlFor="subject" className="mt-4">Subject or Instrument</label>
                <input
                    id='subject' 
                    type="text" 
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setSubject(e.target.value)}} 
                    className='w-full p-2 border-2 border-lighter rounded bg-black/50 focus:outline-none focus:bg-secondary'
                />
                <label htmlFor="weeklyGoal" className="mt-4">Weekly Practice Goal <span className="font-light text-sm">( in minutes )</span></label>
                <input
                    id='weeklyGoal' 
                    type="number" 
                    defaultValue={60}
                    onInput={(e: ChangeEvent<HTMLInputElement>)=>{setWeeklyGoal(parseInt(e.target.value))}} 
                    className='w-full p-2 border-2 border-lighter rounded bg-black/50 focus:outline-none focus:bg-secondary'
                />
                <label htmlFor="dow" className="mt-4">Lesson Day</label>
                <select name="dow" id="dow" className='w-full p-2 border-2 border-lighter rounded bg-black/50 focus:outline-none focus:bg-secondary' 
                    onChange={(e: ChangeEvent<HTMLSelectElement>)=>{setDow(e.target.value)}}>
                    <option value="0">Sunday</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                    <option value="6">Saturday</option>
                </select>
            </form>
        }
        {isOpen &&
            <PrimaryButton 
                onClick={handleEnroll}
                disabled={name.length <= 3 || subject.length <= 3}
            >
                Enroll
            </PrimaryButton>
        }
    </>
  )
}

export default NewStudentButton