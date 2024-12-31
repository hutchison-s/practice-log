export default function BodyText({
    children,
    className
  }: Readonly<{
    children: React.ReactNode,
    className?: string
  }>) {
    return (
        <p className={"text-zinc-400 mx-auto w-full max-w-[800px] text-lg font-inter "+className}>
            {children}
        </p>
    )
  }