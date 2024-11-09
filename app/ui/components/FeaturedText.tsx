export default function FeaturedText({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <p className="text-2xl text-neutral-300 leading-relaxed">
            {children}
        </p>
    )
  }