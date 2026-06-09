import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getRatingColor } from "@/lib/utils";
import Link from "next/link";
import CollegeDetailClient from "./CollegeDetailClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const college = await prisma.college.findUnique({ where: { id }, select: { name: true } });
  return { title: college?.name || "College Detail" };
}

export default async function CollegeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: { orderBy: { fees: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { reviews: true, savedBy: true } },
    },
  });

  if (!college) notFound();

  const placements = college.placements as any;

  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId: id } },
    });
    isSaved = !!saved;
  }

  const avgRating = college.reviews.length
    ? college.reviews.reduce((a, r) => a + r.rating, 0) / college.reviews.length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <nav className="text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/colleges" className="hover:text-indigo-600">Colleges</Link>
        <span className="mx-2">›</span>
        <span className="text-slate-800">{college.name}</span>
      </nav>

      <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-200 mb-6">
        {college.image && (
          <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-end gap-4 justify-between">
            <div>
              <span className="text-xs bg-white/20 backdrop-blur-sm border border-white/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                {college.type}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{college.name}</h1>
              <p className="text-white/80 flex items-center gap-1 mt-1">
                📍 {college.location}
              </p>
            </div>
            <CollegeDetailClient
              collegeId={college.id}
              isSaved={isSaved}
              isLoggedIn={!!session?.user}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "⭐", label: "Rating", value: college.rating.toFixed(1), sub: `${college._count.reviews} reviews` },
          { icon: "💰", label: "Annual Fees", value: formatCurrency(college.fees), sub: "per year" },
          { icon: "🎓", label: "Placement Rate", value: `${placements?.placementRate}%`, sub: "of students" },
          { icon: "💼", label: "Avg Package", value: formatCurrency(placements?.averageSalary), sub: "per annum" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-black text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
            <div className="text-xs text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">About</h2>
            <p className="text-slate-600 leading-relaxed">{college.description}</p>
            {college.accreditation && (
              <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-1.5 rounded-xl">
                ✅ Accreditation: {college.accreditation}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Courses Offered</h2>
            <div className="space-y-3">
              {college.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{course.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {course.degree} · {course.duration}
                      {course.seats && ` · ${course.seats} seats`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-indigo-600 text-sm">{formatCurrency(course.fees)}</div>
                    <div className="text-xs text-slate-400">per year</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Placement Statistics</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <div className="text-2xl font-black text-emerald-600">{placements?.placementRate}%</div>
                <div className="text-sm text-emerald-700 mt-0.5">Placement Rate</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="text-2xl font-black text-blue-600">{formatCurrency(placements?.highestSalary)}</div>
                <div className="text-sm text-blue-700 mt-0.5">Highest Package</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Top Recruiters</div>
              <div className="flex flex-wrap gap-2">
                {placements?.topRecruiters?.map((r: string) => (
                  <span key={r} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Student Reviews</h2>
              <div className="text-right">
                <div className={`text-sm font-bold px-2 py-1 rounded-lg ${getRatingColor(avgRating || college.rating)}`}>
                  ⭐ {(avgRating || college.rating).toFixed(1)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{college._count.reviews} reviews</div>
              </div>
            </div>
            {college.reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {college.reviews.map((review) => (
                  <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                          {review.user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{review.user.name || "Anonymous"}</div>
                          <div className="text-xs text-slate-400">{formatDate(review.createdAt)}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${getRatingColor(review.rating)}`}>
                        ⭐ {review.rating.toFixed(1)}
                      </span>
                    </div>
                    {review.title && <div className="text-sm font-semibold text-slate-700 mb-1">{review.title}</div>}
                    <p className="text-sm text-slate-600">{review.comment}</p>
                    {(review.pros || review.cons) && (
                      <div className="flex gap-4 mt-2">
                        {review.pros && (
                          <div className="text-xs text-emerald-600"><span className="font-semibold">+ </span>{review.pros}</div>
                        )}
                        {review.cons && (
                          <div className="text-xs text-red-500"><span className="font-semibold">- </span>{review.cons}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Quick Info</h3>
            <dl className="space-y-3 text-sm">
              {college.established && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Established</dt>
                  <dd className="font-medium text-slate-800">{college.established}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Type</dt>
                <dd className="font-medium text-slate-800">{college.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Courses</dt>
                <dd className="font-medium text-slate-800">{college.courses.length}</dd>
              </div>
              {college.accreditation && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Accreditation</dt>
                  <dd className="font-medium text-slate-800">{college.accreditation}</dd>
                </div>
              )}
              {college.website && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Website</dt>
                  <dd>
                    <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      Visit ↗
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">Compare This College</h3>
            <p className="text-sm text-amber-700 mb-3">Add to comparison to see how it stacks up against others.</p>
            <Link href={`/compare?ids=${college.id}`} className="block text-center text-sm font-semibold bg-amber-500 text-white py-2 rounded-xl hover:bg-amber-600 transition-colors">
              Add to Compare →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}