"use client";

import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const isNoris = pathname.startsWith("/noris");

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {!isNoris && <Header />}
        <main>{children}</main>
        {!isNoris && <Footer />}
        {!isNoris && <WhatsAppButton />}
      </body>
    </html>
  );
}
