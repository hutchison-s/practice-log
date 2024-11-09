import Link from "next/link";
import NavBar from "./NavBar";

export default function PageHeader() {
    return (
        <header className="fixed top-0 left-0 w-full h-[65px] flex justify-between items-center bg-background">
          <Link href={'/'} className="w-full px-4 text-xl font-bold md:w-fit">
            <h1 >Practice Log</h1>
          </Link>
          <NavBar />
        </header>
    )
}