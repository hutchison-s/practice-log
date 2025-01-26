export default function ContentPageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="w-full max-w-[1000px] mx-auto min-h-full flex flex-col justify-start items-center gap-4 pb-28 md:py-12 print:py-0">
        {children}
        </main>
    );
  }