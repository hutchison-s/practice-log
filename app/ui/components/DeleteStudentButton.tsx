import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import { Trash } from 'lucide-react'
import React from 'react'

function DeleteStudentButton({student, onDelete}: {student?: EnrolleeWithCurrentWeekPractice, onDelete: ()=>void}) {
    if (!student) return <></>
    const handleDelete = ()=>{
        fetch(`/api/students/${student?.id}`, {method: 'DELETE'})
            .then(res => {
                if (!res.ok) {
                    throw new Error('Delete request failed')
                }
                return res.json()})
            .then(() => {
                onDelete()
            })
            .catch(err => {
                console.error(err);
            })
    }
  return (
    <button 
        onClick={handleDelete}
        className="grid place-items-center bg-primary p-2 rounded-full w-fit hover:brightness-110">
        <Trash size={20} />
    </button>
  )
}

export default DeleteStudentButton