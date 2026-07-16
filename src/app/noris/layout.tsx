import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noris",
  description: undefined,
  robots: { index: false, follow: false },
  alternates: { canonical: "/noris" },
  openGraph: {
    title: "Noris",
    description: undefined,
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Noris",
    description: undefined,
    images: [],
  },
};

export default function NorisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
