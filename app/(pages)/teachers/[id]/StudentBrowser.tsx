'use client'


import { useEffect, useState } from "react"
import StudentList from "./StudentList"
import StudentManager from "./StudentManager"
import { EnrolleeWithCurrentWeekPractice } from "@/app/types"

function StudentBrowser({students}: {students: EnrolleeWithCurrentWeekPractice[]}) {
    const [activeStudent, setActiveStudent] = useState<EnrolleeWithCurrentWeekPractice>()

    useEffect(()=>{
        if (students.length > 0) {
            setActiveStudent(students[0])
        }
    }, [students])
    
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