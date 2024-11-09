export default function PageTitle({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <h1 className="px-8 text-3xl font-bold border-x-8 border-slate-800 md:text-5xl" style={{textShadow: "2px 2px var(--dark-slate)"}}>
            {children}
        </h1>
    )
  }