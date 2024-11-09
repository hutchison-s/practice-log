'use client'

import { useState } from "react";
import HoverLink from "./HoverLink";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

const mobileNavStyle = "grid place-items-center bg-slate-800/50 backdrop-blur text-xl rounded hover:bg-blue-400/75";


export default function NavBar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            {/* Desktop NavBar */}
            <nav className="hidden px-2 text-sm md:gap-4 md:px-4 md:flex">
                    <HoverLink href={"/"} className="md:min-w-16">
                        <span>Home</span>
                    </HoverLink>
                    <HoverLink href={"/about"}>
                        <span>About</span>
                    </HoverLink>
                    <HoverLink href={"/log"}>
                        <span>Log</span>
                    </HoverLink>
                    <HoverLink href={"/tasks"}>
                        <span>Tasks</span>
                    </HoverLink>
                    <HoverLink href={"/resources"}>
                        <span>Resources</span>
                    </HoverLink>
                    <HoverLink href={"/login"}>
                        <span>Login</span>
                    </HoverLink>
            </nav>
            {/* Mobile NavBar */}
            <button onClick={()=>setIsOpen(o => !o)} className={`grid place-items-center md:hidden rounded transition-all ${isOpen ? "bg-blue-400 rotate-180 p-2 mr-4" : "bg-transparent p-0 m-2 mr-6"}`}>
                <MenuIcon color="white" size={16}/>
            </button>
            {isOpen 
                &&  <nav className="fixed top-12 left-0 w-full h-[calc(100%-65px)] grid grid-cols-2 grid-rows-3 gap-2 p-2 md:hidden">
                        <Link href={"/"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>Home</span>
                        </Link>
                        <Link href={"/about"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>About</span>
                        </Link>
                        <Link href={"/log"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>Log</span>
                        </Link>
                        <Link href={"/tasks"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>Tasks</span>
                        </Link>
                        <Link href={"/resources"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>Resources</span>
                        </Link>
                        <Link href={"/login"} className={mobileNavStyle} onClick={()=>setIsOpen(false)}>
                            <span>Login</span>
                        </Link>
                    </nav>
            }
        </>
    )
}