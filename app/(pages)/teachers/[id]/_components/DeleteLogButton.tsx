import { useUser } from '@/app/_hooks/useUser';
import { logRow } from '@/app/types'
import { Trash } from 'lucide-react';
import React from 'react'

function DeleteLogButton({log, onDelete}: {log: logRow, onDelete: (log: logRow)=>void}) {
    const {user} = useUser();
    if (user.role !== 'teacher') return null;

    const handleDelete = async ()=>{
        const isConfirmed = confirm('Are you sure you want to delete this log? This cannot be undone.');
        if (!isConfirmed) return;
        fetch(`/api/students/${log.student_id}/logs/${log.id}`, {method: 'DELETE'})
            .then(res => {
                if (res.ok) {
                    onDelete(log);
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
  return (
    <>
    <button
            onClick={handleDelete}
            className='bg-transparent border-[1px] border-white/25 grid place-items-center p-1 rounded'
        >
            <Trash className='text-txtprimary' aria-label="Delete log" size={20}/>
        </button>
    </>
  )
}

export default DeleteLogButton