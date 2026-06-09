// src/app/page.tsx
// Landing page with hero section, stats, and featured colleges

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

async function getFeaturedColleges() {
  return prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 6,
    include: { _count: { select: { reviews: true } } },
  });
}

async function getStats() {
  const [colleges, users, reviews] = await Promise.all([
    prisma.college.count(),
    prisma.user.count(),
    prisma.review.count(),
  ]);
  return { colleges, users, reviews };
}

export default async function HomePage() {
  const [colleges, stats] = await Promise.all([getFeaturedColleges(), getStats()]);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            {stats.colleges}+ colleges listed and growing
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
            Find Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
              Dream College
            </span>
          </h1>

          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore {stats.colleges} top Indian colleges. Compare fees, placements, ratings, and courses — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/colleges"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-900 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Explore Colleges →
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
            >
              Compare Colleges
            </Link>
          </div>

          {/* Quick search */}
          <div className="mt-10 max-w-lg mx-auto">
            <form action="/colleges" method="get" className="flex gap-2">
              <input
                name="search"
                placeholder="Search by college name..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
              <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 px-5 py-3 rounded-xl text-sm font-semibold transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {[
            { value: `${stats.colleges}+`, label: "Colleges" },
            { value: `${stats.users}+`, label: "Students" },
            { value: `${stats.reviews}+`, label: "Reviews" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-indigo-600">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Top Rated Colleges</h2>
            <p className="text-slate-500 mt-1">Highest rated institutions across India</p>
          </div>
          <Link href="/colleges" className="text-sm font-semibold text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => {
            const placements = college.placements as any;
            return (
              <Link key={college.id} href={`/colleges/${college.id}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200">
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100">
                  {college.image && (
                    <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-amber-600">
                    ⭐ {college.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{college.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">📍 {college.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Avg. Package: <strong className="text-slate-800">{formatCurrency(placements?.averageSalary)}</strong></span>
                    <span className="text-emerald-600 font-semibold">{placements?.placementRate}% Placed</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-10 text-white text-center">
        <h2 className="text-3xl font-black mb-3">Start Your College Journey</h2>
        <p className="text-indigo-200 mb-6 max-w-md mx-auto">Create a free account to save colleges, write reviews, and compare your shortlist.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/register" className="bg-white text-indigo-700 font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
            Create Account
          </Link>
          <Link href="/colleges" className="border border-white/40 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm">
            Browse Colleges
          </Link>
        </div>
      </section>
    </div>
  );
}
