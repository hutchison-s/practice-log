export default function BodyText({
    children,
    className
  }: Readonly<{
    children: React.ReactNode,
    className?: string
  }>) {
    return (
        <p className={"text-white/60 mx-auto w-full max-w-[800px] text-lg font-inter "+className}>
            {children}
        </p>
    )
  }