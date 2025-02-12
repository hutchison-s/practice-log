'use client'

import { useUser } from '@/app/_hooks/useUser'
import { Enrollee } from '@/app/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchStudents } from '../actions'

const initialValue = [] as Enrollee[]

const StudentContext = createContext(initialValue)

function StudentProvider({children}: {children: React.ReactNode}) {
    const [students, setStudents] = useState<Enrollee[]>(initialValue)
    const {user} = useUser();
    useEffect(()=>{
        if (user.id) {
            fetchStudents(user.id).then(res => setStudents(res))
        }
        
    }, [user])
  return (
    <StudentContext.Provider value={students}>
        {children}
    </StudentContext.Provider>
  )
}

const useStudents = ()=>useContext(StudentContext);

export {StudentContext, StudentProvider, useStudents}