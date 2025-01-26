'use client'
import HoverLink from "./HoverLink";
import LogInOutButton from "./LogInOutButton";
import { useUser } from "@/app/_hooks/useUser";

export default function NavBar() {
    const {user} = useUser();

    return (
        <>
            <nav className="hidden px-2 text-sm md:gap-4 md:px-4 md:flex xl:text-lg xl:gap-6">
                    <HoverLink href={"/"} className="md:min-w-16">
                        <span>Home</span>
                    </HoverLink>
                    <HoverLink href={"/about"}>
                        <span>About</span>
                    </HoverLink>
                    <HoverLink href={"/metronome"}>
                        <span>Metronome</span>
                    </HoverLink>
                    <HoverLink href={"/tuner"}>
                        <span>Tuner</span>
                    </HoverLink>
                    {user.id != '' && <HoverLink href={`/${user.role}s/${user.id}`}>Portal</HoverLink>}
                    {user.id != '' && user.role == 'teacher' && <HoverLink href={`/teachers/${user.id}/schedule`}>Schedule</HoverLink>}
                    {user.id != '' && user.role == 'teacher' && <HoverLink href={`/teachers/${user.id}/reports/weekly_logs?view=table`}>Reports</HoverLink>}
                    <LogInOutButton />
                    
            </nav>
        </>
    )
}