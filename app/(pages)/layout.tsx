export default function ContentPageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <main className="mt-[60px] w-full min-h-full flex flex-col justify-start items-center gap-4 px-8 pt-8 pb-12 md:px-20 md:py-12">
        {children}
        </main>
    );
  }