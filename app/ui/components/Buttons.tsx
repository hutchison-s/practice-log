import Link from "next/link"

export function PrimaryButton({
    children, onClick = undefined, 
    size = 'md', 
    type, 
    className, 
    disabled
}: {
    children: React.ReactNode, onClick: (()=>void) | undefined, 
    size?: 'lg' | 'md' | 'sm', 
    type?: 'submit' | 'button' | 'reset', 
    className?: string, 
    disabled?: boolean
}) {
    const styles = {
        lg: "font-bold font-golos bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-2xl text-shadow-sm drop-shadow px-20 py-4 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 disabled:brightness-50 ",
        md: "font-bold font-golos bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-lg text-shadow-sm drop-shadow px-16 py-2 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 disabled:brightness-50 ",
        sm: "font-bold font-golos bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-md text-shadow-sm drop-shadow px-6 py-2 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 disabled:brightness-50 "
    }
    return (
            <button
                className={styles[size]+className}
                type={type}
                disabled={disabled}
                onClick={onClick}>
                    {children}
            </button>

    )
}

export function PrimaryLinkButton({
    children, 
    href, 
    size = 'md', 
    className
}: {
    children: React.ReactNode, 
    href: string, 
    size?: 'lg' | 'md' | 'sm', 
    className?: string
}) {
    const styles = {
        lg: "font-golos font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-2xl text-shadow-sm drop-shadow px-20 py-4 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 ",
        md: "font-golos font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-lg text-shadow-sm drop-shadow px-16 py-2 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 ",
        sm: "font-golos font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-md text-shadow-sm drop-shadow px-6 py-2 rounded-full outline outline-0 outline-white transition-all hover:outline-1 hover:scale-105 "
    }
    return (
        <Link
            className={styles[size]+className}
            href={href}>
                {children}
        </Link>
    )
}


export function SecondaryButton({
    children, onClick = undefined, 
    size = 'md', 
    type, 
    className, 
    disabled
}: {
    children: React.ReactNode, onClick: (()=>void) | undefined, 
    size?: 'lg' | 'md' | 'sm', 
    type?: 'submit' | 'button' | 'reset'
    className?: string, 
    disabled?: boolean
}) {
    const styles = {
        lg: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-2xl px-20 py-4 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 ",
        md: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-lg px-16 py-2 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 ",
        sm: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-md px-6 py-2 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 "
    }
    return (
        <button
            className={styles[size]+className}
            type={type}
            disabled={disabled}

            onClick={onClick}>
                {children}
        </button>
    )
}

export function SecondaryLinkButton({children, href, size = 'md', className}: {children: React.ReactNode, href: string, size?: 'lg' | 'md' | 'sm', className?: string}) {
    const styles = {
        lg: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-2xl px-20 py-4 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 ",
        md: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-lg px-16 py-2 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 ",
        sm: "font-inter bg-white/5 backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-md px-6 py-2 rounded-full drop-shadow transition-all hover:scale-105 hover:bg-white/10 "
    }
    return (
        <Link
            className={styles[size]+className}
            href={href}>
                {children}
        </Link>
    )
}