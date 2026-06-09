"use client";
// src/components/layout/Header.tsx
// Top navigation bar with auth state and compare badge

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-black">C</span>
            <span className="text-slate-800">CollegeCompass</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/colleges" className="hover:text-indigo-600 transition-colors">Explore</Link>
            <Link href="/compare" className="hover:text-indigo-600 transition-colors">Compare</Link>
            {session?.user && (
              <Link href="/saved" className="hover:text-indigo-600 transition-colors">Saved</Link>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(session.user.name)}
                  </span>
                  <span className="hidden sm:block">{session.user.name?.split(" ")[0]}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1 text-sm">
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Dashboard</Link>
                    <Link href="/saved" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-50 text-slate-700">Saved Colleges</Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-red-600"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link href="/auth/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1 text-sm">
            <Link href="/colleges" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-slate-600 hover:text-indigo-600">Explore Colleges</Link>
            <Link href="/compare" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-slate-600 hover:text-indigo-600">Compare</Link>
            {session?.user && (
              <Link href="/saved" onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-slate-600 hover:text-indigo-600">Saved Colleges</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
