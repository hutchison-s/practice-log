export default function BodyText({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <p className="text-txtsecondary leading-relaxed mx-auto w-full max-w-[800px]">
            {children}
        </p>
    )
  }