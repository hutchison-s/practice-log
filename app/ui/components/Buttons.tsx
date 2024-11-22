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
        lg: "relative bg-primary text-txtprimary text-lg px-8 py-4 rounded shadow-md border-swirl disabled:brightness-50 ",
        md: "relative bg-primary text-txtprimary text-md px-4 py-2 rounded shadow-md border-swirl disabled:brightness-50 ",
        sm: "relative bg-primary text-txtprimary text-sm px-2 py-2 rounded-sm shadow-md border-swirl disabled:brightness-50 "
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
        lg: "grid place-items-center bg-transparent border-2 border-primary text-txtprimary text-lg px-8 py-4 rounded hover:bg-secondary shadow-md ",
        md: "grid place-items-center bg-transparent border-2 border-primary text-md px-4 py-2 rounded hover:bg-secondary shadow-md ",
        sm: "grid place-items-center bg-transparent border-2 border-primary text-sm px-2 py-2 rounded-sm hover:bg-secondary shadow-md "
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
        lg: "bg-secondary text-txtprimary text-lg px-8 py-4 rounded shadow-md ",
        md: "bg-secondary text-txtprimary text-md px-4 py-2 rounded shadow-md ",
        sm: "bg-secondary text-txtprimary text-sm px-2 py-2 rounded-sm shadow-md "
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
        lg: "grid place-items-center bg-secondary text-txtprimary text-lg px-8 py-4 rounded shadow-md ",
        md: "grid place-items-center bg-secondary text-txtprimary text-md px-4 py-2 rounded shadow-md ",
        sm: "grid place-items-center bg-secondary text-txtprimary text-sm px-2 py-2 rounded-sm shadow-md "
    }
    return (
        <Link
            className={styles[size]+className}
            href={href}>
                {children}
        </Link>
    )
}