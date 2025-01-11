import { Group } from '@/app/types'
import { Trash } from 'lucide-react'
import React from 'react'

function DeleteGroupButton({teacher_id, group, onDelete}: {teacher_id: string, group?: Group, onDelete: (g: Group)=>void}) {
    if (!group) return <></>

    const handleDelete = () => {
        const confirmed = confirm('Are you sure you want to delete this group? Students will not be deleted.')
        if (confirmed) {
            fetch(`/api/teachers/${teacher_id}/groups/${group.id}`, {
                method: 'DELETE'})
                .then(res => {
                    if (res.ok) {
                      onDelete(group);
                      console.log('deleted group');  
                    }
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
            <Trash className='text-txtprimary' aria-label="Add new group"/>
        </button>
    </>
  )
}

export default DeleteGroupButton