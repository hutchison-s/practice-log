export default function BodyText({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <p className="text-neutral-400 leading-relaxed">
            {children}
        </p>
    )
  }