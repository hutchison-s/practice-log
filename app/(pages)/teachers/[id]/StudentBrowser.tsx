'use client'

import { User } from "@/app/_usercontext/UserContext"
import { useEffect, useState } from "react"
import StudentList from "./StudentList"
import StudentManager from "./StudentManager"

interface Enrollee extends User {
    total_practice_time: string,
    subject: string,
    log?: any[],
    weekly_goal: string,
    day_of_week: string
}

function StudentBrowser({students}: {students: Enrollee[]}) {
    const [activeStudent, setActiveStudent] = useState<Enrollee>()

    useEffect(()=>{
        if (students.length > 0) {
            setActiveStudent(students[0])
        }
    }, [])
    
  return (
    <>
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2">
            <StudentList students={students} setSelected={setActiveStudent} selected={activeStudent}/>
            <StudentManager student={activeStudent} setSelected={setActiveStudent}/>
        </div>
    </>
  )
}

export default StudentBrowser