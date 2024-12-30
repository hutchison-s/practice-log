export default function SubHeading({
    children, className
  }: Readonly<{
    children: React.ReactNode;
    className?: string
  }>) {
    return (
        <h3 className={"text-2xl font-bold font-golos my-2 text-txtprimary text-shadow "+className}>
            {children}
        </h3>
    )
  }


