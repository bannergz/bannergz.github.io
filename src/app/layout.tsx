import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Banner Gonzales | Technical Lead & Software Architect",
  description:
    "Systems Engineer with 6+ years leading high-traffic fintech platforms. Specialized in microservices, event-driven architectures, and scalable cloud solutions.",
  keywords: [
    "Technical Lead",
    "Software Architect",
    "Fintech",
    "Microservices",
    "Java",
    "Spring Boot",
    "NodeJS",
    "AWS",
    "DDD",
  ],
  authors: [{ name: "Banner Gonzales" }],
  openGraph: {
    title: "Banner Gonzales | Technical Lead & Software Architect",
    description:
      "Systems Engineer with 6+ years leading high-traffic fintech platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
