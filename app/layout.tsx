import type { Metadata } from "next";
import {Rubik} from "next/font/google";
import "./globals.css";
import PageHeader from "./ui/components/PageHeader";
import UserProvider from "./_usercontext/UserProvider";
import Link from "next/link";

const rubik = Rubik({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Practice Log",
  description: "Makes practice perfect",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
      
        <body
          className={`${rubik.className} antialiased h-[100vh] bg-background`}
        >
          <UserProvider>
            <PageHeader />
          
            {children}
          
            <footer className="flex w-full justify-center px-2 py-3 text-txtsecondary gap-x-4 flex-wrap md:flex-nowrap">
                <span>Practice Log &copy; 2024</span>
                <span>Created by <Link href='https://www.stevenhutchison.com' className="text-lighter underline">Steven Hutchison</Link></span>
            </footer>
            </UserProvider>
        </body>
        
    </html>
    
  );
}
