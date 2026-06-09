"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import CollegeCard from "@/components/college/CollegeCard";
import CollegeFilters from "@/components/college/CollegeFilters";
import { CollegeCardSkeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import type { College, CollegeFilters as FilterType } from "@/types";
import { buildQueryString, formatCurrency, getRatingColor, getCollegeTypeColor } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const DEFAULT_FILTERS: FilterType = {
  search: "",
  location: "",
  minFee: 0,
  maxFee: 99999999,
  minRating: 0,
  page: 1,
  limit: 9,
  sortBy: "rating",
  sortOrder: "desc",
};

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [view, setView] = useState<"card" | "table">("card");
  const [compareList, setCompareList] = useState<College[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    ...DEFAULT_FILTERS,
    search: searchParams.get("search") || "",
  });

  const fetchColleges = useCallback(async (f: FilterType) => {
    setLoading(true);
    setError("");
    try {
      const qs = buildQueryString({
        search: f.search,
        location: f.location,
        minFee: f.minFee,
        maxFee: f.maxFee === 99999999 ? undefined : f.maxFee,
        minRating: f.minRating,
        type: f.type,
        page: f.page,
        limit: f.limit,
        sortBy: f.sortBy,
        sortOrder: f.sortOrder,
      });
      const res = await fetch(`/api/colleges?${qs}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setColleges(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load colleges");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges(filters);
  }, [filters, fetchColleges]);

  function handleFilterChange(updates: Partial<FilterType>) {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  function toggleCompare(college: College) {
    setCompareList((prev) => {
      if (prev.find((c) => c.id === college.id)) {
        return prev.filter((c) => c.id !== college.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800">Explore Colleges</h1>
        <p className="text-slate-500 mt-1">
          {loading ? "Loading..." : `${total} colleges found`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-72 shrink-0">
          <CollegeFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>View:</span>
              <button onClick={() => setView("card")} className={`p-1.5 rounded ${view === "card" ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setView("table")} className={`p-1.5 rounded ${view === "table" ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 6v12M14 6v12M3 6h18" />
                </svg>
              </button>
            </div>
            {compareList.length > 0 && (
              <Link href={`/compare?ids=${compareList.map((c) => c.id).join(",")}`} className="flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors">
                Compare ({compareList.length}) →
              </Link>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
              {error} <button onClick={() => fetchColleges(filters)} className="underline ml-1">Retry</button>
            </div>
          )}

          {view === "card" && (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
                </div>
              ) : colleges.length === 0 ? (
                <EmptyState icon="🏫" title="No colleges found" description="Try adjusting your filters or search terms" action={{ label: "Reset Filters", onClick: handleReset }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} onCompareToggle={toggleCompare} isInCompare={compareList.some((c) => c.id === college.id)} />
                  ))}
                </div>
              )}
            </>
          )}

          {view === "table" && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">College</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Fees/yr</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Rating</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Placements</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} />)
                    ) : colleges.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-slate-400">No colleges found</td></tr>
                    ) : (
                      colleges.map((c) => {
                        const p = c.placements as any;
                        return (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800 max-w-xs">
                              <Link href={`/colleges/${c.id}`} className="hover:text-indigo-600">{c.name}</Link>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{c.city}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCollegeTypeColor(c.type)}`}>{c.type}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{formatCurrency(c.fees)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${getRatingColor(c.rating)}`}>⭐ {c.rating}</span>
                            </td>
                            <td className="px-4 py-3 text-emerald-600 font-medium">{p?.placementRate}%</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link href={`/colleges/${c.id}`} className="text-xs text-indigo-600 font-medium hover:underline">Details</Link>
                                <button
                                  onClick={() => toggleCompare(c)}
                                  className={`text-xs px-2 py-0.5 rounded border font-medium transition-colors ${compareList.some((x) => x.id === c.id) ? "bg-amber-50 border-amber-300 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                                >
                                  {compareList.some((x) => x.id === c.id) ? "✓" : "+ Compare"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Pagination page={filters.page || 1} totalPages={totalPages} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} />
        </div>
      </div>

      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Comparing:</span>
            {compareList.map((c) => (
              <span key={c.id} className="bg-white/10 px-2 py-0.5 rounded text-xs">
                {c.name.split(" ").slice(0, 2).join(" ")}
                <button onClick={() => toggleCompare(c)} className="ml-1.5 text-slate-400 hover:text-white">✕</button>
              </span>
            ))}
          </div>
          {compareList.length >= 2 && (
            <Link href={`/compare?ids=${compareList.map((c) => c.id).join(",")}`} className="bg-indigo-500 hover:bg-indigo-400 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors">
              Compare Now
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-slate-400">Loading...</div>}>
      <CollegesContent />
    </Suspense>
  );
}