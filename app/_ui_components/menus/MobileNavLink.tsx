import Link from 'next/link';
import React from 'react'

const mobileNavStyle =
  "group flex flex-col justify-center items-center gap-1 glass border-[1px] border-secondary/50 text-xl rounded hover:bg-gradient-to-br hover:from-cyan-500 hover:to-teal-800 hover:text-white z-50";


function MobileNavLink({label, icon, url, closeMenu}: {label: string, icon: React.ReactNode, url: string, closeMenu: ()=>void}) {
  return (
    <Link href={url} className={mobileNavStyle} onClick={closeMenu}>
            <span>{icon}</span>
            <span className="font-light text-sm font-inter text-zinc-400 group-hover:text-white">{label}</span>
        </Link>
  )
}

export default MobileNavLink