'use client'

import { useEffect, useState } from "react"
import { defaultUser, User, UserContext } from "./UserContext"

export default function UserProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User>(defaultUser);

    const login = (u: User) => {
        setUser(prev => {
            return {
                ...prev,
                ...u
            }
        })
    }

    const logout = ()=>{
        setUser({id: '', name: ''})
    }

    useEffect(()=>{
        const init = async () => {
            fetch('http://localhost:3000/api/auth/current_user')
                .then(res => res.json())
                .then(u => setUser(u))
                .catch(err => console.error)
        }
        init();
    }, [])

    return (
        <>
            <UserContext.Provider value={{user, login, logout}}>
                {children}
            </UserContext.Provider>
        </>
    )
}