// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-slate-200 mb-4">404</div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
            Go Home
          </Link>
          <Link href="/colleges" className="border border-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
            Browse Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
