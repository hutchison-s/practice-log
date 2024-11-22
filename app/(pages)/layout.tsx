export default function ContentPageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="mt-[60px] w-full min-h-full flex flex-col justify-start items-center gap-4 px-3 pt-8 pb-12 md:px-40 md:py-12">
        {children}
        </main>
    );
  }