"use client";
import { useUser } from "@/app/_usercontext/useUser";
import Link from "next/link";
import LogInOutButton from "./LogInOutButton";
import { Home, Info, LayoutDashboard } from "lucide-react";
import metronome from '../../_assets/images/metronome.svg'
import tuner from '../../_assets/images/tuner.svg'
import Image from "next/image";

const mobileNavStyle =
  "grid place-items-center bg-secondary/75 backdrop-blur border-[1px] border-secondary/50 text-xl rounded hover:bg-lighter/75 z-50";

export default function MobileNav({ close }: { close: () => void }) {
    const {user} = useUser();
  return (
    <nav className="z-50 fixed top-14 left-0 w-full h-[calc(100dvh-65px)] grid grid-cols-3 grid-rows-[120px_120px_1fr] gap-2 p-2 bg-background/90 md:hidden">
        <Link href={"/"} className={mobileNavStyle} onClick={close}>
            <span><Home size={80}/></span>
        </Link>
        {user.id != '' && user.email && <Link href={`/teachers/${user.id}`} className={mobileNavStyle} onClick={close}><LayoutDashboard size={80}/></Link>}
        {user.id != '' && user.code && <Link href={`/students/${user.id}/log`} className={mobileNavStyle} onClick={close}><LayoutDashboard size={80}/></Link>}
        
        <Link href={"/about"} className={mobileNavStyle} onClick={close}>
            <span><Info size={80}/></span>
        </Link>
        {!user.id && !user.code && !user.email && <LogInOutButton closeMenu={close} isMobile/>}
        <Link href={"/metronome"} className={mobileNavStyle} onClick={close}>
            <span>
              <Image src={metronome} width={80} color="white" alt="Metronome" />
            </span>
        </Link>
        <Link href={"/tuner"} className={mobileNavStyle} onClick={close}>
            <span>
              <Image src={tuner} width={80} color="white" alt="Tuner" />
            </span>
        </Link>
        
        {user.id != '' && <LogInOutButton closeMenu={close} isMobile/>}
    </nav>
  );
}
