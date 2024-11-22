export default function PageTitle({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="relative px-3 py-2 bg-secondary max-w-[75vw] md:px-8">
            {/* title text  */}
            <h1 className="z-20 text-3xl text-center px-4 font-bold md:text-5xl" style={{textShadow: "2px 2px var(--dark-slate)"}}>{children}</h1>
            {/* left circle */}
            <div className="z-10 absolute top-0 left-0 -translate-x-1/2 size-[52px] bg-lighter rounded-full border-8 border-secondary"></div>
            {/* right circle */}
            <div className="z-10 absolute top-0 right-0 translate-x-1/2 size-[52px] bg-secondary rounded-full outline outline-1 -outline-offset-8 outline-lighter"></div>
            
        </div>
    )
  }