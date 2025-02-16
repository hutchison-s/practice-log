"use client";
import { useUser } from "@/app/_hooks/useUser";
import LogInOutButton from "./LogInOutButton";
import { BookOpen, Calendar, ChartColumn, Home, Info, LayoutDashboard } from "lucide-react";
import metronome from '../../_assets/images/metronome.svg'
import tuner from '../../_assets/images/tuner.svg'
import Image from "next/image";
import MobileNavLink from "./MobileNavLink";
import { useEffect, useRef } from "react";


export default function MobileNav({ closeMenu }: { closeMenu: () => void }) {
    const {user} = useUser();
    const menuRef = useRef<HTMLElement>(null)

    useEffect(()=>{
      menuRef.current?.addEventListener('click', closeMenu);

      return ()=>menuRef.current?.removeEventListener('click', closeMenu)
    }, [])

    function StudentTeacherSwitch({studentNode, teacherNode}: {studentNode?: React.ReactNode, teacherNode?: React.ReactNode}) {
      if (user.id == '') return null;
      if (!studentNode) return teacherNode;
      if (!teacherNode) return studentNode;
      switch(user.role) {
        case 'student':
          return studentNode;
        case 'teacher':
          return teacherNode;
        default:
          return null;
      }
    }
  return (
    <nav ref={menuRef} className="z-20 fixed top-0 left-0 w-full h-full grid grid-cols-3 auto-rows-[140px] gap-2 p-2 pt-[70px] bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950/75 via-background/75 to-background/75 backdrop-blur md:hidden">

        <MobileNavLink label="Home" url="/" icon={<Home size={80} aria-label="Home"/>} closeMenu={closeMenu} />
        <MobileNavLink label="About" url="/about" icon={<Info size={80} aria-label="About"/>} closeMenu={closeMenu} />        
        <LogInOutButton closeMenu={closeMenu} isMobile/>
        <StudentTeacherSwitch
          teacherNode={<MobileNavLink
                url={`/teachers/${user.id}/schedule`}
                closeMenu={closeMenu}
                icon={<Calendar size={80} aria-label="Schedule"/>}
                label="Schedule" />}
        />
        <StudentTeacherSwitch 
          studentNode={<MobileNavLink label={"Portal"} icon={<LayoutDashboard size={80} aria-label="Portal"/>} url={`/students/${user.id}`} closeMenu={closeMenu} />} 
          teacherNode={<MobileNavLink label={"Portal"} icon={<LayoutDashboard size={80} aria-label="Portal"/>} url={`/teachers/${user.id}`} closeMenu={closeMenu} />}
        />
        <StudentTeacherSwitch
          teacherNode={<MobileNavLink label={"Reports"} icon={<ChartColumn size={80} aria-label="Reports"/>} url={`/teachers/${user.id}/reports/weekly_logs?view=table`} closeMenu={closeMenu} />}
        />
        <StudentTeacherSwitch
          teacherNode={<MobileNavLink label={"Library"} icon={<BookOpen size={80} aria-label="Library"/>} url={`/teachers/${user.id}/library`} closeMenu={closeMenu} />}
        />
        <MobileNavLink label="Metronome" icon={<Image src={metronome} width={80} color="white" alt="Metronome" aria-label="Metronome"/>} url="/metronome" closeMenu={closeMenu} />        
        <MobileNavLink label="Tuner" icon={<Image src={tuner} width={80} color="white" alt="Tuner" aria-label="Tuner"/>} url="/tuner" closeMenu={closeMenu} />        
        
    </nav>
  );
}
