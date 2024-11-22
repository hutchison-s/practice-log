export default function FeaturedText({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <p className="text-2xl text-txtprimary leading-relaxed">
            {children}
        </p>
    )
  }