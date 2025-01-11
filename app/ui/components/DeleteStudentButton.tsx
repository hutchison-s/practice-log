import { EnrolleeWithCurrentWeekPractice } from '@/app/types'
import { Trash } from 'lucide-react'
import React from 'react'

function DeleteStudentButton({student, onDelete}: {student?: EnrolleeWithCurrentWeekPractice, onDelete: (id: string)=>void}) {
    if (!student) return <></>
    const handleDelete = ()=>{
        fetch(`/api/students/${student?.id}`, {method: 'DELETE'})
            .then(res => {
                if (!res.ok) {
                    throw new Error('Delete request failed')
                }
                return res.json()})
            .then(() => {
                onDelete(student.id)
            })
            .catch(err => {
                console.error(err);
            })
    }
  return (
    <button 
        onClick={handleDelete}
        className="grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-full w-fit outline outline-0 outline-white transition-all hover:scale-105 hover:outline-2">
        <Trash aria-label="Trash Can" size={20} />
    </button>
  )
}

export default DeleteStudentButton