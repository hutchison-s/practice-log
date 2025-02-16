'use client'

import { useUser } from '@/app/_hooks/useUser'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import ControlledModal from '@/app/_ui_components/layout/ControlledModal'
import Elipsis from '@/app/_ui_components/layout/Elipsis'
import { Goals } from '@/app/api/_controllers/tableControllers'
import { Goal, LibraryGoal } from '@/app/types'
import { AlertCircle, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type statusType = 'ready' | 'busy' | 'complete' | 'error';





function LibraryGoalChooser({student_id, onAssign}: {student_id: string, onAssign: (g: Goal)=>void}) {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<statusType>('ready')
    const [libGoals, setLibGoals] = useState<LibraryGoal[]>([]);
    const {user} = useUser();

    const statusMap: Record<statusType, React.ReactNode> = {
        'ready': <p>Getting things in order <Elipsis /></p>,
        'busy': <Loader className='animate-spin text-teal-500 mx-auto my-4' size={80}/>,
        'complete': libGoals.length == 0 ? <p>No Goals in Library</p> : <LibraryGoalList />,
        'error': <AlertCircle size={80}/>
    }

    const assignGoal = (g: LibraryGoal)=>{
        setStatus('busy')
        Goals(student_id).createOne({title: g.title, content: g.content})
            .then((goal)=>{
                onAssign(goal);
                setStatus('ready');
                setIsOpen(false)
            })
    }

    useEffect(()=>{
        setStatus('busy')
        fetch(`/api/teachers/${user.id}/library/goals`)
            .then(res => res.json())
            .then(json => {
                setLibGoals(json.data);
                setStatus('complete')
            })
            .catch(err => {
                console.error(err)
                setStatus('error');
            })
    }, [])

    function LibraryGoalList() {
        return libGoals.map(g => 
            <button key={g.id} onClick={()=>assignGoal(g)} className='flex w-full flex-wrap justify-start bg-gradient-to-br from-indigo-800 to bg-indigo-950 border-[1px] border-teal-500 py-1 px-4 rounded-lg'>
                <p className='font-bold font-golos flex-[100%] text-left'>{g.title}</p>
                <p className='font-light flex-[100%] text-sm whitespace-pre text-wrap text-left'>{g.content}</p>
            </button>)
    }

    
  return (
    <>
        <PrimaryButton onClick={()=>setIsOpen(true)} className='text-md mx-auto'>Choose from Library</PrimaryButton>
        <ControlledModal isOpen={isOpen} >
            <div className="grid gap-2 justify-center w-full">
                {statusMap[status]}
                <SecondaryButton onClick={()=>setIsOpen(false)} type='reset' className='mx-auto block'>Cancel</SecondaryButton>
            </div>
            
        </ControlledModal>
    </>
  )
}

export default LibraryGoalChooser