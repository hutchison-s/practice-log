'use client'

import { LibraryResource } from '@/app/types'
import { AlertCircle, CheckCircle, Loader, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
type statusType = 'ready' | 'busy' | 'complete' | 'error';

const statusMap: Record<statusType, React.ReactNode> = {
    'ready': <Trash aria-label="Trash Can"  className='brightness-90 cursor-pointer transition-all hover:scale-105 hover:brightness-105'/>,
    'busy': <Loader className='animate-spin'/>,
    'complete': <CheckCircle />,
    'error': <AlertCircle />
}

function DeleteLibraryResourceButton({resource}: {resource: LibraryResource}) {
    const router = useRouter();
    const [status, setStatus] = useState<statusType>('ready');

    const handleDelete = ()=>{
        setStatus('busy')
        fetch(`/api/teachers/${resource.teacher_id}/library/resources/${resource.id}`, {method: 'DELETE'})
            .then(()=>{
                router.refresh()
            })
            .then(()=>{
                setStatus('complete')
            })
            .catch(err => {
                console.log(err);
                setStatus('error');
            })
    }

  return (
    <button className='grid place-items-center' onClick={handleDelete}>
        {statusMap[status]}
    </button>
  )
}

export default DeleteLibraryResourceButton