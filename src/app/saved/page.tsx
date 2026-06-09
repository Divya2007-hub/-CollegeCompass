"use client";
// src/app/saved/page.tsx
// Shows all colleges saved by the authenticated user

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { College } from "@/types";
import { formatCurrency, getRatingColor } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";

interface SavedEntry {
  id: string;
  collegeId: string;
  createdAt: string;
  college: College;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState<SavedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/saved");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/saved-colleges")
        .then((r) => r.json())
        .then((data) => { if (data.success) setSaved(data.data); })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  async function handleRemove(collegeId: string) {
    setRemoving(collegeId);
    try {
      const res = await fetch(`/api/saved-colleges?collegeId=${collegeId}`, { method: "DELETE" });
      if (res.ok) setSaved((prev) => prev.filter((s) => s.collegeId !== collegeId));
    } finally {
      setRemoving(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Saved Colleges</h1>
          <p className="text-slate-500 mt-1">{saved.length} college{saved.length !== 1 ? "s" : ""} saved</p>
        </div>
        {saved.length > 1 && (
          <Link
            href={`/compare?ids=${saved.slice(0, 3).map((s) => s.collegeId).join(",")}`}
            className="text-sm font-semibold bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
          >
            Compare Saved →
          </Link>
        )}
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon="🔖"
          title="No saved colleges yet"
          description="Browse colleges and click the heart icon to save them here."
          action={{ label: "Explore Colleges", href: "/colleges" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(({ id, collegeId, college }) => {
            const placements = college.placements as any;
            return (
              <div key={id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  {college.image && (
                    <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <button
                    onClick={() => handleRemove(collegeId)}
                    disabled={removing === collegeId}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow"
                    title="Remove from saved"
                  >
                    {removing === collegeId ? "..." : "♥"}
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/colleges/${collegeId}`}>
                    <h3 className="font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                      {college.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 mb-3">📍 {college.location}</p>

                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className={`text-xs font-bold ${getRatingColor(college.rating).split(" ")[0]}`}>⭐ {college.rating}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Rating</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-slate-700">{formatCurrency(college.fees)}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Fees/yr</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-xs font-bold text-emerald-600">{placements?.placementRate}%</div>
                      <div className="text-xs text-slate-400 mt-0.5">Placed</div>
                    </div>
                  </div>

                  <Link
                    href={`/colleges/${collegeId}`}
                    className="block text-center text-sm font-medium bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
