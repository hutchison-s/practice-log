'use client'
import HoverLink from "./HoverLink";
import LogInOutButton from "./LogInOutButton";
import { useUser } from "@/app/_usercontext/useUser";

export default function NavBar() {
    const {user} = useUser();

    return (
        <>
            <nav className="hidden px-2 text-sm md:gap-4 md:px-4 md:flex">
                    <HoverLink href={"/"} className="md:min-w-16">
                        <span>Home</span>
                    </HoverLink>
                    <HoverLink href={"/about"}>
                        <span>About</span>
                    </HoverLink>
                    {user.id != '' && user.email && <HoverLink href={`/teachers/${user.id}`}>Portal</HoverLink>}
                    {user.id != '' && user.code && <HoverLink href={`/students/${user.id}/log`}>Portal</HoverLink>}
                    <LogInOutButton />
                    
            </nav>
        </>
    )
}