export default function SubHeading({
    children, className
  }: Readonly<{
    children: React.ReactNode;
    className?: string
  }>) {
    return (
        <h3 className={"text-xl font-bold text-lighter "+className}>
            {children}
        </h3>
    )
  }


