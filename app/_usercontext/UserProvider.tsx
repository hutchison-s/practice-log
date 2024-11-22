'use client'

import { useEffect, useState } from "react"
import { defaultUser, UserContext } from "./UserContext"
import { User } from "../types";

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
        setUser(defaultUser)
    }

    useEffect(()=>{
        const init = async () => {
            fetch(`/api/auth/current_user`)
                .then(res => {
                    if (!res.ok) {
                        setUser(defaultUser)
                        throw new Error('No user logged in')
                    }
                    return res.json();
                })
                .then(u => setUser(u))
                .catch(err => console.error(err))
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