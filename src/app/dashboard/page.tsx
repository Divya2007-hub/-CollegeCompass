// src/app/dashboard/page.tsx
// Authenticated user dashboard showing stats and activity

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate, getRatingColor } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/dashboard");

  const userId = session.user.id;

  const [savedColleges, reviews, user] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { college: { select: { id: true, name: true, rating: true, location: true, fees: true, image: true } } },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { college: { select: { id: true, name: true } } },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  const totalSaved = await prisma.savedCollege.count({ where: { userId } });
  const totalReviews = await prisma.review.count({ where: { userId } });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            Hi, {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Your college discovery dashboard</p>
        </div>
        <Link href="/colleges" className="text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors">
          Explore Colleges
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "🔖", label: "Saved Colleges", value: totalSaved, href: "/saved" },
          { icon: "⭐", label: "Reviews Written", value: totalReviews, href: "#reviews" },
          { icon: "⚖️", label: "Comparisons", value: totalSaved >= 2 ? "Try Now" : "Add 2+", href: `/compare?ids=${savedColleges.slice(0, 3).map((s) => s.collegeId).join(",")}` },
          { icon: "🏫", label: "Total Colleges", value: "25+", href: "/colleges" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all group">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved colleges */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Saved Colleges</h2>
            <Link href="/saved" className="text-xs text-indigo-600 font-semibold hover:underline">View all →</Link>
          </div>

          {savedColleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🔖</p>
              <p className="text-sm text-slate-400">No saved colleges yet</p>
              <Link href="/colleges" className="text-xs text-indigo-600 mt-2 inline-block hover:underline">Browse colleges</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedColleges.map(({ college }) => (
                <Link
                  key={college.id}
                  href={`/colleges/${college.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    {college.image ? (
                      <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                        {college.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 truncate transition-colors">
                      {college.name}
                    </div>
                    <div className="text-xs text-slate-400">{college.location}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-md ${getRatingColor(college.rating)}`}>
                    ⭐ {college.rating}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* My reviews */}
        <section id="reviews" className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">My Reviews</h2>
            <span className="text-xs text-slate-400">{totalReviews} total</span>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">⭐</p>
              <p className="text-sm text-slate-400">You haven't written any reviews yet</p>
              <Link href="/colleges" className="text-xs text-indigo-600 mt-2 inline-block hover:underline">Find a college to review</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <Link href={`/colleges/${review.college.id}`} className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors">
                      {review.college.name}
                    </Link>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getRatingColor(review.rating)}`}>
                      ⭐ {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{review.comment}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Account info */}
      <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Account Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-500 text-xs mb-0.5">Name</div>
            <div className="font-medium text-slate-800">{user?.name || "—"}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-0.5">Email</div>
            <div className="font-medium text-slate-800">{user?.email}</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs mb-0.5">Member since</div>
            <div className="font-medium text-slate-800">{user?.createdAt ? formatDate(user.createdAt) : "—"}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
