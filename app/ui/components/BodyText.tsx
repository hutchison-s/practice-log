export default function BodyText({
    children,
    className
  }: Readonly<{
    children: React.ReactNode,
    className?: string
  }>) {
    return (
        <p className={"text-txtsecondary leading-relaxed mx-auto w-full max-w-[800px] "+className}>
            {children}
        </p>
    )
  }