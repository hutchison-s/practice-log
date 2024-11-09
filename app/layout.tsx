import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import PageHeader from "./ui/components/PageHeader";

const inter = Inter({subsets: ["latin"]});

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
        className={`${inter.className} antialiased h-[100vh]`}
      >
        <PageHeader />
        {children}
      </body>
    </html>
  );
}
