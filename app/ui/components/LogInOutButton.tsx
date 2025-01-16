'use client'

import { useUser } from "@/app/_usercontext/useUser"
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const mobileNavStyle =
  "flex flex-col justify-center h-[140px] items-center gap-1 glass text-xl rounded hover:bg-gradient-to-br hover:from-cyan-500 hover:to-teal-800 z-50 active:bg-indigo-950/50";

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
            ?   <button onClick={handleLogout} className={mobileNavStyle}><LogOut size={80} aria-label="Sign Out"/><span className="font-light text-sm font-inter text-zinc-400">Sign Out</span></button>
            :   <button onClick={handleLogin} className={mobileNavStyle}><LogIn size={80} aria-label="Sign In"/><span className="font-light text-sm font-inter text-zinc-400">Sign In</span></button>
        : user.id != ''
            ?   <button onClick={handleLogout} className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogOut size={18} aria-label="Sign Out"/></button>
            :   <button onClick={handleLogin} className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogIn size={18} aria-label="Sign In" /></button>
    )
}