// src/app/auth/error/page.tsx
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Authentication Error</h1>
        <p className="text-slate-500 mb-6">Something went wrong during sign in. Please try again.</p>
        <Link href="/auth/login" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
