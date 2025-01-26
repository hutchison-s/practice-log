import type { Metadata } from "next";
import {Golos_Text, Inter} from "next/font/google";
import "./globals.css";
import PageHeader from "./_ui_components/menus/PageHeader";
import Link from "next/link";
import SessionOverlay from "./(pages)/students/[id]/_components/SessionOverlay";
import UserProvider from "./_contexts/UserProvider";
import SessionProvider from "./_contexts/SessionProvider";

const golos = Golos_Text({subsets: ["latin"], display: 'swap', variable: '--golos-font'});
const inter = Inter({subsets: ["latin"], display: 'swap', variable: '--inter-font'});

export const metadata: Metadata = {
  title: "Practice HQ",
  description: "The essential platform for connecting music lessons and student practice to drive measurable growth.",
  openGraph: {
    images: ['/opengraph.png'],
    type: 'website',
    description: "The essential platform for connecting music lessons and student practice to drive measurable growth."
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en" className="bg-background">
      
        <body
          className={`${golos.variable} ${inter.variable} antialiased pb-20 relative min-h-[100vh] bg-fixed bg-[radial-gradient(circle_at_66%_30%,__var(--tw-gradient-stops))] from-indigo-950 via-background to-background print:bg-transparent`}
        >
          <UserProvider>
            <SessionProvider>
            <PageHeader />
          
            <div className="w-full pt-20 px-4 sm:px-6 md:px-10">{children}</div>
            <SessionOverlay />
            <footer className="absolute bottom-4 left-0 flex w-full justify-center px-2 font-inter font-light text-zinc-400 gap-x-6 flex-wrap md:flex-nowrap">
                <span>Practice HQ &copy; 2024</span>
                <span>Created by <Link href='https://www.stevenhutchison.com' className="text-lighter underline">Steven Hutchison</Link></span>
            </footer>
            </SessionProvider>
            </UserProvider>
        </body>
        
    </html>
    
  );
}
