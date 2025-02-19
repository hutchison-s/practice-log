'use client'

import { useUser } from "@/app/_hooks/useUser"
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const mobileNavStyle =
  "group flex flex-col justify-center items-center gap-1 glass border-[1px] border-secondary/50 text-xl rounded hover:bg-gradient-to-br hover:from-cyan-500 hover:to-teal-800 hover:text-white z-50";


export default function LogInOutButton({isMobile, closeMenu}: {isMobile?: boolean, closeMenu?: ()=>void}) {
    const {user, logout} = useUser();
    const router = useRouter();

    const handleLogin = ()=>{
      router.push('/login');
      if (closeMenu) {
        closeMenu();
      }
    }

    const handleLogout = ()=>{
        logout();
      router.push('/api/auth/logout');
      if (closeMenu) {
        closeMenu()
      }
    }

    return (
        isMobile
        ? user.id != ''
            ?   <button onClick={handleLogout} className={mobileNavStyle}>
                    <span><LogOut size={80} aria-label="Sign Out"/></span>
                    <span className="font-light text-sm font-inter text-zinc-400 group-hover:text-white">Sign Out</span>
                    </button>
            :   <button onClick={handleLogin} className={mobileNavStyle}>
                    <span><LogIn size={80} aria-label="Sign In"/></span>
                    <span className="font-light text-sm font-inter text-zinc-400 group-hover:text-white">Sign In</span>
                </button>
        : user.id != ''
            ?   <Link href="/api/auth/logout" onClick={handleLogout} className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogOut size={18} aria-label="Sign Out"/></Link>
            :   <Link href="/login" className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogIn size={18} aria-label="Sign In" /></Link>
    )
}