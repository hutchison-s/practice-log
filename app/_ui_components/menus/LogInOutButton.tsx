'use client'

import { useUser } from "@/app/_hooks/useUser"
import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileNavLink from "./MobileNavLink";
import Link from "next/link";

export default function LogInOutButton({isMobile}: {isMobile?: boolean}) {
    const {user, logout} = useUser();
    const router = useRouter();

    return (
        isMobile
        ? user.id != ''
            ?   <MobileNavLink closeMenu={()=>null} icon={<LogOut size={80} aria-label="Sign Out"/>} label="Sign Out" url="/api/auth/logout" />
            :   <MobileNavLink closeMenu={()=>null} icon={<LogIn size={80} aria-label="Sign In"/>} label="Sign In" url="/login" />
        : user.id != ''
            ?   <Link href="/api/auth/logout" onClick={()=>{logout(); router.refresh()}} className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogOut size={18} aria-label="Sign Out"/></Link>
            :   <Link href="/login" className="p-2 rounded cursor-pointer my-auto hover:text-teal-500 text-txtprimary"><LogIn size={18} aria-label="Sign In" /></Link>
    )
}