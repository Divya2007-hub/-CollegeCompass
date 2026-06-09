"use client";
// src/app/compare/page.tsx
// Side-by-side college comparison with up to 3 colleges

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { College } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids") || "";
  const ids = idsParam.split(",").filter(Boolean).slice(0, 3);

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (ids.length >= 2) {
      setLoading(true);
      fetch(`/api/compare?ids=${ids.join(",")}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setColleges(data.data);
          else setError(data.error);
        })
        .catch(() => setError("Failed to load comparison"))
        .finally(() => setLoading(false));
    }
  }, [idsParam]);

  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/colleges?search=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setSearchResults(data.data?.filter((c: College) => !ids.includes(c.id)) || []);
    } finally {
      setSearching(false);
    }
  }

  function addCollege(college: College) {
    if (ids.length >= 3) return;
    const newIds = [...ids, college.id];
    router.push(`/compare?ids=${newIds.join(",")}`);
    setSearchQuery("");
    setSearchResults([]);
  }

  function removeCollege(id: string) {
    const newIds = ids.filter((i) => i !== id);
    router.push(newIds.length ? `/compare?ids=${newIds.join(",")}` : "/compare");
  }

  const placements0 = colleges[0]?.placements as any;
  const placements1 = colleges[1]?.placements as any;
  const placements2 = colleges[2]?.placements as any;

  const compareRows = colleges.length >= 2 ? [
    { label: "Location", values: colleges.map((c) => c.location) },
    { label: "Type", values: colleges.map((c) => c.type) },
    { label: "Established", values: colleges.map((c) => c.established ? String(c.established) : "N/A") },
    { label: "Annual Fees", values: colleges.map((c) => formatCurrency(c.fees)), highlight: (vals: string[]) => {
      const nums = colleges.map((c) => c.fees);
      return nums.map((n) => n === Math.min(...nums) ? "text-emerald-600 font-bold" : "");
    }},
    { label: "Rating", values: colleges.map((c) => `⭐ ${c.rating}`), highlight: (vals: string[]) => {
      return colleges.map((c) => c.rating === Math.max(...colleges.map((x) => x.rating)) ? "text-amber-600 font-bold" : "");
    }},
    { label: "Courses", values: colleges.map((c) => `${(c as any).courses?.length || "—"} courses`) },
    { label: "Placement Rate", values: [placements0, placements1, placements2].map((p) => p ? `${p.placementRate}%` : "—"), highlight: () => {
      const rates = [placements0, placements1, placements2].map((p) => p?.placementRate || 0);
      return rates.map((r) => r === Math.max(...rates) ? "text-emerald-600 font-bold" : "");
    }},
    { label: "Avg Package", values: [placements0, placements1, placements2].map((p) => p ? formatCurrency(p.averageSalary) : "—") },
    { label: "Highest Package", values: [placements0, placements1, placements2].map((p) => p ? formatCurrency(p.highestSalary) : "—") },
    { label: "Accreditation", values: colleges.map((c) => c.accreditation || "N/A") },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-800">Compare Colleges</h1>
        <p className="text-slate-500 mt-1">Compare up to 3 colleges side by side</p>
      </div>

      {/* Add college search */}
      {ids.length < 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 relative">
          <p className="text-sm font-medium text-slate-700 mb-3">
            {ids.length === 0 ? "Add two or more colleges to compare" : `Add ${3 - ids.length} more college${3 - ids.length > 1 ? "s" : ""}`}
          </p>
          <input
            type="text"
            placeholder="Search for a college..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => addCollege(c)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-500">{c.location} · ⭐ {c.rating}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-slate-400">Loading comparison...</div>
      )}

      {!loading && ids.length < 2 && (
        <EmptyState
          icon="⚖️"
          title="Select colleges to compare"
          description="Search and add at least 2 colleges to start comparing"
          action={{ label: "Browse Colleges", href: "/colleges" }}
        />
      )}

      {!loading && colleges.length >= 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* College headers */}
          <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}>
            <div className="p-4 bg-slate-50 border-r border-slate-200" />
            {colleges.map((college) => (
              <div key={college.id} className="p-4 border-r border-slate-200 last:border-0">
                <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100 mb-3">
                  {college.image && (
                    <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
                  )}
                  <button
                    onClick={() => removeCollege(college.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 text-xs shadow"
                  >
                    ✕
                  </button>
                </div>
                <Link href={`/colleges/${college.id}`} className="font-bold text-slate-800 hover:text-indigo-600 text-sm leading-tight block">
                  {college.name}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">{college.city}</p>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          {compareRows.map((row, i) => {
            const highlights = row.highlight ? row.highlight(row.values) : row.values.map(() => "");
            return (
              <div
                key={row.label}
                className={`grid border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}
              >
                <div className="px-5 py-3.5 text-sm font-semibold text-slate-600 border-r border-slate-200 flex items-center">
                  {row.label}
                </div>
                {row.values.slice(0, colleges.length).map((val, j) => (
                  <div key={j} className={`px-5 py-3.5 text-sm border-r border-slate-100 last:border-0 ${highlights[j] || "text-slate-700"}`}>
                    {val}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Top recruiters */}
          <div
            className="grid border-t border-slate-200"
            style={{ gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)` }}
          >
            <div className="px-5 py-4 text-sm font-semibold text-slate-600 border-r border-slate-200">
              Top Recruiters
            </div>
            {colleges.map((college) => {
              const p = college.placements as any;
              return (
                <div key={college.id} className="px-5 py-4 border-r border-slate-100 last:border-0">
                  <div className="flex flex-wrap gap-1">
                    {p?.topRecruiters?.slice(0, 3).map((r: string) => (
                      <span key={r} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
