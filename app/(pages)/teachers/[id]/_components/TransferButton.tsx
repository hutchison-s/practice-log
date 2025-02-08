'use client'

import { useUser } from "@/app/_hooks/useUser"

export default function TransferButton() {
    const {user} = useUser();
    const transfer = async ()=>{
        await fetch(`/api/teachers/${user.id}/library`, {method: 'POST', headers: {"Content-Type": "application/json"}, credentials: 'include'})
    }
    return <button onClick={transfer}>Transfer Resources</button>
}