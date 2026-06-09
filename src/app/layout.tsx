import type { Metadata } from "next";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CollegeCompass – Find Your Perfect College",
    template: "%s | CollegeCompass",
  },
  description: "Discover, compare, and shortlist top colleges in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <footer className="border-t border-slate-200 bg-white mt-16 py-8 text-center text-sm text-slate-500">
            <p>© 2025 CollegeCompass. Built with Next.js, Prisma & PostgreSQL.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}