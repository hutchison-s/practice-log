'use client'

import { createContext } from "react";
import { User } from "../types";

export const defaultUser: User = {
    id: '',
    name: '',
    created_at: '',
    timezone: '',
    role: 'student'
}

const initialContext = {
    user: defaultUser,
    login: (u: User)=>{console.log(u)},
    logout: ()=>{}
}

export const UserContext = createContext(initialContext);