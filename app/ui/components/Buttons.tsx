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
        lg: "relative bg-gradient-to-br from-cyan-500 to-teal-600 text-txtprimary text-lg px-8 py-4 rounded shadow-md border-swirl disabled:brightness-50 ",
        md: "relative bg-gradient-to-br from-cyan-500 to-teal-600 text-txtprimary text-md px-4 py-2 rounded shadow-md border-swirl disabled:brightness-50 ",
        sm: "relative bg-gradient-to-br from-cyan-500 to-teal-600 text-txtprimary text-sm px-2 py-2 rounded-sm shadow-md border-swirl disabled:brightness-50 "
    }
    return (
        <div className="button-container relative">
            <button
                className={styles[size]+className}
                type={type}
                disabled={disabled}
                onClick={onClick}>
                    {children}
            </button>
        </div>
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
        lg: "font-inter font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-2xl text-shadow-sm drop-shadow px-20 py-4 rounded-full border-0 border-white hover:border-2 ",
        md: "font-inter font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-lg text-shadow-sm drop-shadow px-16 py-2 rounded-full border-0 border-white hover:border-2 ",
        sm: "font-golos font-bold grid place-items-center bg-gradient-to-br from-cyan-500 to-teal-800 text-txtprimary text-md text-shadow-sm drop-shadow px-6 py-2 rounded-full border-0 border-white hover:border-2 "
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
        lg: "bg-[#ffffff33] text-txtprimary text-lg text-shadow-sm drop-shadow px-12 py-4 rounded-3xl ",
        md: "bg-[#ffffff33] text-txtprimary text-md text-shadow-sm drop-shadow px-8 py-2 rounded-2xl ",
        sm: "bg-[#ffffff33] text-txtprimary text-sm text-shadow-sm drop-shadow px-4 py-2 rounded-xl "
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
        lg: "grid place-items-center font-inter bg-[#ffffff11] backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-2xl px-20 py-4 rounded-full shadow-md hover:bg-white/10",
        md: "grid place-items-center font-inter bg-[#ffffff11] backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-lg px-16 py-2 rounded-full shadow-md hover:bg-white/10",
        sm: "grid place-items-center font-inter bg-[#ffffff11] backdrop-blur border-2 border-teal-600 text-txtprimary text-shadow-sm text-md px-6 py-2 rounded-full shadow-md hover:bg-white/10"
    }
    return (
        <Link
            className={styles[size]+className}
            href={href}>
                {children}
        </Link>
    )
}