"use client";
import { useUser } from "@/app/_usercontext/useUser";
import Link from "next/link";
import LogInOutButton from "./LogInOutButton";
import { Home, Info, LayoutDashboard } from "lucide-react";
import metronome from '../../_assets/images/metronome.svg'
import tuner from '../../_assets/images/tuner.svg'
import Image from "next/image";

const mobileNavStyle =
  "flex flex-col justify-center items-center gap-1 glass border-[1px] border-secondary/50 text-xl rounded hover:bg-gradient-to-br hover:from-cyan-500 hover:to-teal-800 z-50";

export default function MobileNav({ close }: { close: () => void }) {
    const {user} = useUser();
  return (
    <nav className="z-10 fixed top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-[140px_140px_1fr] gap-2 p-2 pt-[70px] bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950/75 via-background/75 to-background/75 backdrop-blur md:hidden">
        <Link href={"/"} className={mobileNavStyle} onClick={close}>
            <span><Home size={80}/></span>
            <span className="font-light text-sm font-inter text-zinc-400">Home</span>
        </Link>
        {user.id != '' && user.email && <Link href={`/teachers/${user.id}`} className={mobileNavStyle} onClick={close}><LayoutDashboard size={80}/><span className="font-light text-sm font-inter text-zinc-400">Portal</span></Link>}
        {user.id != '' && user.code && <Link href={`/students/${user.id}/log`} className={mobileNavStyle} onClick={close}><LayoutDashboard size={80}/><span className="font-light text-sm font-inter text-zinc-400">Portal</span></Link>}
        
        <Link href={"/about"} className={mobileNavStyle} onClick={close}>
            <span>
              <Info size={80}/>
            </span>
            <span className="font-light text-sm font-inter text-zinc-400">About</span>
        </Link>
        {!user.id && !user.code && !user.email && <LogInOutButton closeMenu={close} isMobile/>}
        <Link href={"/metronome"} className={mobileNavStyle} onClick={close}>
            <span>
              <Image src={metronome} width={80} color="white" alt="Metronome" />
            </span>
            <span className="font-light text-sm font-inter text-zinc-400">Metronome</span>
        </Link>
        <Link href={"/tuner"} className={mobileNavStyle} onClick={close}>
            <span>
              <Image src={tuner} width={80} color="white" alt="Tuner" />
            </span>
            <span className="font-light text-sm font-inter text-zinc-400">Tuner</span>
        </Link>
        
        {user.id != '' && <LogInOutButton closeMenu={close} isMobile/>}
    </nav>
  );
}
