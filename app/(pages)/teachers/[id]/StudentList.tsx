'use client'

import { EnrolleeWithCurrentWeekPractice } from "@/app/types"
import EnroleePreview from "@/app/ui/components/EnroleePreview"

function StudentList({students, selected, setSelected, disabled}: {students: EnrolleeWithCurrentWeekPractice[], selected?: EnrolleeWithCurrentWeekPractice, setSelected: (s: EnrolleeWithCurrentWeekPractice)=>void, disabled?: boolean}) {
  return (
    <section className="flex flex-col w-full max-w-[600px] gap-2 p-3 border-2 border-secondary rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                {students.length > 0 && students.map((s: EnrolleeWithCurrentWeekPractice) => {
                    
                    return (
                        <div key={s.id} onClick={()=>{
                            if (!disabled) {
                                setSelected(s)}
                            }
                        }>
                            <EnroleePreview student={s} isSelected={s.id === selected?.id}/>
                        </div>
                    )
                })}
            </section>
  )
}

export default StudentList