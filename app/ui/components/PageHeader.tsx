'use client'

import Link from "next/link";
import NavBar from "./NavBar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import MobileNav from "./MobileNav";
import { useUser } from "@/app/_usercontext/useUser";
import logo from '../../_assets/images/logo.png'
import Image from "next/image";

export default function PageHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {user} = useUser();
  

    return (
      <>
        <header className="fixed top-0 left-0 w-full h-[65px] flex justify-between items-center bg-background/50 backdrop-blur-xl z-20">
          <Link href={'/'} className="w-full px-4 text-xl flex justify-start gap-2 align-center font-bold md:w-fit">
            <Image src={logo} alt='PL' width={30}/>
            <h1 >Practice Log <span className="text-txtsecondary font-light text-sm">{user.name ? `for ${user.name.split(' ')[0]}` : ''}</span></h1>
          </Link>
          <NavBar />
          <button onClick={()=>setIsOpen(o => !o)} className={`grid place-items-center md:hidden rounded transition-all ${isOpen ? "bg-lighter rotate-180 p-4 mr-4" : "bg-transparent p-2 m-2 mr-6"}`}>
                <MenuIcon color="var(--primary-text)" size={16}/>
            </button>
            
        </header>
        {isOpen && <MobileNav close={()=>setIsOpen(false)} />}
        </>
    )
}