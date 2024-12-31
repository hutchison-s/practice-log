'use client'

import Link from "next/link";
import NavBar from "./NavBar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import MobileNav from "./MobileNav";
import { useUser } from "@/app/_usercontext/useUser";

export default function PageHeader() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {user} = useUser();
  

    return (
      <>
        <header className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[65px] flex justify-between items-center lg:h-[85px] z-20 ${isOpen ? '' : 'backdrop-blur-xl'}`}>
          <Link href={'/'} className="w-full pl-4 text-xl flex justify-start gap-2 align-center font-bold md:w-fit">
            {/* <Image src={logo} alt='PL' width={30}/> */}
            <div className="w-full flex justify-between items-center gap-2 xl:gap-6" >
              <h1 className="font-golos text-3xl bg-gradient-to-br from-cyan-500 to-teal-600 inline-block text-transparent bg-clip-text xl:text-5xl">HQ </h1>
              {user.name && <div className="text-zinc-400 font-light text-sm uppercase border-[1px] border-zinc-400 rounded-full size-6 grid place-items-center xl:text-lg xl:size-8 ">{user.name[0]}</div>}
            </div>
          </Link>
          <NavBar />
          <button onClick={()=>setIsOpen(o => !o)} className={`grid place-items-center md:hidden rounded text-txtprimary transition-all h-full px-4 ${isOpen ? "text-teal-500 rotate-180" : ""}`}>
                <MenuIcon size={28} strokeWidth={isOpen ? 3 : 1}/>
            </button>
            
        </header>
        {isOpen && <MobileNav close={()=>setIsOpen(false)} />}
        </>
    )
}