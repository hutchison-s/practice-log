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
                .then(async res => {
                    if (res.ok) {
                        const u = await res.json()
                        setUser(u.data)  
                    }
                })
                .catch(err => {
                    console.error('No user logged in.', err)
                    setUser(defaultUser)
                })
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