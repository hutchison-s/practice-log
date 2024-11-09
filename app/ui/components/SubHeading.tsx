export default function SubHeading({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <h3 className="text-lg font-bold text-blue-400">
            {children}
        </h3>
    )
  }


