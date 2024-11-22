'use client'

import { User } from "@/app/_usercontext/UserContext"
import EnroleePreview from "@/app/ui/components/EnroleePreview"

interface Enrollee extends User {
    total_practice_time: string,
    subject: string,
    log?: any[],
    weekly_goal: string,
    day_of_week: string,
    current_week_minutes?: string
}

function StudentList({students, selected, setSelected}: {students: Enrollee[], selected?: Enrollee, setSelected: (s: Enrollee)=>void}) {
  return (
    <section className="flex flex-col w-full max-w-[600px] gap-2 p-3 border-2 border-secondary rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none">
                {students.length > 0 && students.map((s: Enrollee) => {
                    
                    return (
                        <div key={s.id} onClick={()=>setSelected(s)}>
                            <EnroleePreview student={s} isSelected={s.id === selected?.id}/>
                        </div>
                    )
                })}
            </section>
  )
}

export default StudentList