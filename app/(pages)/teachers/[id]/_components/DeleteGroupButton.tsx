
import { Groups } from '@/app/api/_controllers/tableControllers'
import { Trash } from 'lucide-react'
import React from 'react'

function DeleteGroupButton({teacher_id, groupId, onDelete}: {teacher_id: string, groupId?: string, onDelete: (id: string)=>void}) {
    if (!groupId) return <></>

    const handleDelete = () => {
        const confirmed = confirm('Are you sure you want to delete this group? Students will not be deleted.')
        if (confirmed) {
            Groups(teacher_id).deleteOne(groupId)
                .then(() => {
                    onDelete(groupId);
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }
  return (
    <>
        <button
            onClick={handleDelete}
            className='bg-transparent border-[1px] border-white/25 grid place-items-center p-1 rounded'
        >
            <Trash className='text-txtprimary' aria-label="Delete group"/>
        </button>
    </>
  )
}

export default DeleteGroupButton