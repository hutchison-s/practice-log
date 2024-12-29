export default function FeaturedText({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <p className="max-w-[800px] text-2xl text-txtprimary leading-relaxed">
            {children}
        </p>
    )
  }