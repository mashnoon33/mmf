import AnimatedLogo from "@/components/title/animated-logo";
import "@/styles/globals.css";
import { HiOutlineStatusOnline } from "react-icons/hi";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "MMFX",
  description: "MMFX",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-[#0a1b11] text-[#41FF00] h-screen crt" >
        <header className="h-[100px] pt-8 px-10 flex justify-between items-center">
          <AnimatedLogo />
          <div className="flex space-x-2">

            <HiOutlineStatusOnline size={24} />
            <p>ONLINE</p>
          </div>
        </header>
        {children}
      </body>
      <Toaster />
    </html>
  );
}
