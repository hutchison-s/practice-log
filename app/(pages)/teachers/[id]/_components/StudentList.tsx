'use client'

import { Enrollee } from "@/app/types";
import EnroleePreview from "@/app/(pages)/teachers/[id]/_components/EnroleePreview"
import { Loader } from "lucide-react";

function StudentList({students, selected, onSelect, onUpdate, disabled}: {students: Enrollee[], selected: string | null, onSelect: (student_id: string)=>void, onUpdate: (s: Enrollee)=>void, disabled?: boolean}) {

  return (
    <ul className="col-span-1 lg:col-span-3 flex flex-col w-full gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" id="studentList">
                {
                disabled
                  ? <Loader className="spinner" size={120}/>
                  : students.length > 0 && students.map((s: Enrollee) => <EnroleePreview 
                    key={s.id}
                    student={s}
                    onUpdate={onUpdate} 
                    isSelected={s.id === selected} 
                    onClick={()=>{
                    if (!disabled) {
                        onSelect(s.id)}
                    }}/>)}
            </ul>
  )
}

export default StudentList