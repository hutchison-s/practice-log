import Link from "next/link";

export default function HoverLink({
    children,
    href,
    className,
  }: Readonly<{
    children: React.ReactNode;
    href: string;
    className?: string;
  }>) {
    return (
        <Link href={href} className={`rounded-md text-center text-txtprimary p-2 hover:bg-teal-500 hover:bg-clip-text hover:text-transparent hover:text-shadow transition-bg ${className}`} scroll={true}>
            {children}
        </Link>
    )
}