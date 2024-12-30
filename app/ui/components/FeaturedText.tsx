export default function FeaturedText({
    children,
    className
  }: Readonly<{
    children: React.ReactNode;
    className?: string
  }>) {
    return (
        <p className={"mx-auto font-inter font-light max-w-[800px] text-[1.2rem] text-txtsecondary leading-relaxed text-shadow fade-up md:text-[2rem] "+className}>
            {children}
        </p>
    )
  }