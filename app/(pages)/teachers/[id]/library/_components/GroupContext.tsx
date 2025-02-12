'use client'

import { useUser } from '@/app/_hooks/useUser'
import { Group } from '@/app/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { fetchGroups } from '../actions'

const initialValue = [] as Group[]

const GroupContext = createContext(initialValue)

function GroupProvider({children}: {children: React.ReactNode}) {
    const [groups, setGroups] = useState<Group[]>(initialValue)
    const {user} = useUser();
    useEffect(()=>{
        if (user.id) {
            fetchGroups(user.id).then(res => setGroups(res))
        }
        
    }, [user])
  return (
    <GroupContext.Provider value={groups}>
        {children}
    </GroupContext.Provider>
  )
}

const useGroups = ()=>useContext(GroupContext);

export {GroupContext, GroupProvider, useGroups}