'use client'

import { useUser } from '@/app/_hooks/useUser'
import { PrimaryButton, SecondaryButton } from '@/app/_ui_components/layout/Buttons'
import ControlledModal from '@/app/_ui_components/layout/ControlledModal'
import Elipsis from '@/app/_ui_components/layout/Elipsis'
import ResourceIcon from '@/app/_ui_components/object_display/ResourceIcon'
import { Resources } from '@/app/api/_controllers/tableControllers'
import { LibraryResource, Resource } from '@/app/types'
import { AlertCircle, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type statusType = 'ready' | 'busy' | 'complete' | 'error';

function LibraryResourceChooser({student_id, onAssign}: {student_id: string, onAssign: (r: Resource)=>void}) {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<statusType>('ready')
    const [libRes, setLibRes] = useState<LibraryResource[]>([]);
    const {user} = useUser();

    const statusMap: Record<statusType, React.ReactNode> = {
        'ready': <p>Getting things in order <Elipsis /></p>,
        'busy': <Loader className='animate-spin text-teal-500 mx-auto my-4' size={80}/>,
        'complete': libRes.length == 0 ? <p>No Resources in Library</p> : <LibraryResourceList />,
        'error': <AlertCircle size={80}/>
    }

    const shareResource = (r: LibraryResource)=>{
        setStatus('busy')
        Resources(student_id).createOne({key: r.key, title: r.title, type: r.type, url: r.url})
            .then((res)=>{
                onAssign(res);
                setStatus('ready');
                setIsOpen(false)
            })
    }

    useEffect(()=>{
        setStatus('busy')
        fetch(`/api/teachers/${user.id}/library/resources`)
            .then(res => res.json())
            .then(json => {
                setLibRes(json.data);
                setStatus('complete')
            })
            .catch(err => {
                console.error(err)
                setStatus('error');
            })
    }, [])

    function LibraryResourceList() {
        return libRes.map(r => 
            <button key={r.id} onClick={()=>shareResource(r)} className='flex w-full justify-start gap-2 bg-gradient-to-br from-indigo-800 to bg-indigo-950 border-[1px] border-teal-500 py-1 px-4 rounded-lg'>
                <ResourceIcon t={r.type}/><p className='font-bold font-golos flex-[100%] text-left'>{r.title}</p>
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

export default LibraryResourceChooser