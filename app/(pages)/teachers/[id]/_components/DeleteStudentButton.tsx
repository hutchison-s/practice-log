import { Students } from '@/app/api/_controllers/studentController';
import { Enrollee } from '@/app/types'
import { Trash } from 'lucide-react'
import React from 'react'

function DeleteStudentButton({student, onDelete, onCancel}: {student: Enrollee, onDelete: (id: string)=>void, onCancel: ()=>void}) {
    const handleDelete = ()=>{
        const confirmed = confirm('Are you sure you want to delete this student?');
        if (!confirmed) {
            return onCancel();
        }
        Students.deleteOne(student.id)
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
        className="grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-full size-fit outline outline-0 outline-white transition-all hover:scale-105 hover:outline-2">
        <Trash aria-label="Trash Can" size={20} />
    </button>
  )
}

export default DeleteStudentButton