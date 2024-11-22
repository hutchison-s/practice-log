import { createContext } from "react";

export type User = {
    id: string,
    name: string,
    email?: string,
    code?: string
    created_at?: string
}
export const defaultUser: User = {
    id: '',
    name: ''
}

const initialContext = {
    user: defaultUser,
    login: (u: User)=>{},
    logout: ()=>{}
}

export const UserContext = createContext(initialContext);