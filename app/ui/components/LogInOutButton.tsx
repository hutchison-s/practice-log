'use client'

import { useUser } from "@/app/_usercontext/useUser"
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const mobileNavStyle =
  "grid place-items-center bg-secondary/75 backdrop-blur text-xl rounded hover:bg-lighter/75 z-50";

export default function LogInOutButton({isMobile, closeMenu}: {isMobile?: boolean, closeMenu?: ()=>void}) {
    const {user, logout} = useUser();
    const router = useRouter();

    const handleLogout = ()=>{
        logout();
        if (typeof closeMenu == 'function') {
            closeMenu();
        }
        router.push('/api/auth/logout');
    }
    const handleLogin = ()=>{
        if (typeof closeMenu == 'function') {
            closeMenu();
        }
        router.push('/login')
    }
    return (
        isMobile
        ? user.id != ''
            ?   <div onClick={handleLogout} role="button" className={mobileNavStyle}><LogOut /></div>
            :   <div onClick={handleLogin} role="button" className={mobileNavStyle+" col-span-2"}><LogIn /></div>
        : user.id != ''
            ?   <div onClick={handleLogout} role="button" className="p-2 rounded cursor-pointer my-auto hover:bg-secondary transition-colors"><LogOut size={18}/></div>
            :   <div onClick={handleLogin} role="button" className="p-2 rounded cursor-pointer my-auto hover:bg-secondary transition-colors"><LogIn size={18}/></div>
    )
}