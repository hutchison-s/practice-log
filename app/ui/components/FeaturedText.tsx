export default function FeaturedText({
    children,
    className
  }: Readonly<{
    children: React.ReactNode;
    className?: string
  }>) {
    return (
        <p className={"mx-auto font-inter font-extralight max-w-[800px] text-[1.2rem] text-zinc-400 leading-relaxed text-shadow fade-up lg:text-[2rem] "+className}>
            {children}
        </p>
    )
  }