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
        <Link href={href} className={`rounded-md text-center p-2 hover:bg-secondary hover:text-shadow-lg transition-all ${className}`}>
            {children}
        </Link>
    )
}