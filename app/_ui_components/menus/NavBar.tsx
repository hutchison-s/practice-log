'use client'
import DropDown from "./DropDown";
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
                    <DropDown title="Practice Tools">
                        <HoverLink href={"/metronome"}>
                            <span>Metronome</span>
                        </HoverLink>
                        <HoverLink href={"/tuner"}>
                            <span>Tuner</span>
                        </HoverLink>
                    </DropDown>
                    
                    
                    {user.id != '' && user.role == 'teacher' && <DropDown title="Teacher Tools">
                        <HoverLink href={`/teachers/${user.id}/schedule`}>Schedule</HoverLink>
                        <HoverLink href={`/teachers/${user.id}/library`}>Library</HoverLink>
                        <HoverLink href={`/teachers/${user.id}/reports/weekly_logs?view=table`}>Reports</HoverLink>
                        <HoverLink href={`/teachers/${user.id}/qr-codes`}>QR Codes</HoverLink>
                    </DropDown>}
                    {user.id != '' && <HoverLink href={`/${user.role}s/${user.id}`}>Portal</HoverLink>}
                    <LogInOutButton />
                    
            </nav>
        </>
    )
}