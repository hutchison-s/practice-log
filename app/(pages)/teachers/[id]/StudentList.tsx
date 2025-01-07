'use client'

import { EnrolleeWithCurrentWeekPractice } from "@/app/types"
import EnroleePreview from "@/app/ui/components/EnroleePreview"

function StudentList({students, selected, setSelected, disabled}: {students: EnrolleeWithCurrentWeekPractice[], selected?: EnrolleeWithCurrentWeekPractice, setSelected: (s: EnrolleeWithCurrentWeekPractice)=>void, disabled?: boolean}) {

  return (
    <ul className="flex flex-col w-full max-w-[600px] gap-2 p-3 border-2 border-white/25 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none" id="studentList">
                {students.length > 0 && students.map((s: EnrolleeWithCurrentWeekPractice) => <EnroleePreview 
                    key={s.id}
                    student={s} 
                    isSelected={s.id === selected?.id} 
                    onClick={()=>{
                            if (!disabled) {
                                setSelected(s)}
                            }}/>)}
            </ul>
  )
}

export default StudentList