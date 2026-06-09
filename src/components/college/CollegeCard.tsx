"use client";
// src/components/college/CollegeCard.tsx
// Displays a college in card format with save/compare actions

import Link from "next/link";
import { useState } from "react";
import { College } from "@/types";
import { formatCurrency, getRatingColor, getCollegeTypeColor } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CollegeCardProps {
  college: College;
  onSaveToggle?: (id: string, saved: boolean) => void;
  onCompareToggle?: (college: College) => void;
  isInCompare?: boolean;
}

export default function CollegeCard({ college, onSaveToggle, onCompareToggle, isInCompare }: CollegeCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(college.isSaved ?? false);
  const [saving, setSaving] = useState(false);

  const placements = college.placements as any;

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/auth/login");
      return;
    }

    setSaving(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const url = isSaved
        ? `/api/saved-colleges?collegeId=${college.id}`
        : `/api/saved-colleges`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ collegeId: college.id }) : undefined,
      });

      if (res.ok) {
        setIsSaved(!isSaved);
        onSaveToggle?.(college.id, !isSaved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-indigo-50 to-slate-100 overflow-hidden">
        {college.image ? (
          <img src={college.image} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-indigo-200">{college.name[0]}</span>
          </div>
        )}

        {/* Type badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${getCollegeTypeColor(college.type)}`}>
          {college.type}
        </span>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
          title={isSaved ? "Remove from saved" : "Save college"}
        >
          <svg className={`w-4 h-4 ${isSaved ? "text-red-500 fill-current" : "text-slate-400"}`} fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/colleges/${college.id}`}>
          <h3 className="font-bold text-slate-800 text-base leading-tight mb-1 hover:text-indigo-600 transition-colors line-clamp-2">
            {college.name}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 flex items-center gap-1 mb-3">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {college.location}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <div className={`text-xs font-bold px-1.5 py-0.5 rounded-md inline-block ${getRatingColor(college.rating)}`}>
              ⭐ {college.rating}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Rating</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <div className="text-xs font-bold text-slate-700">{formatCurrency(college.fees)}</div>
            <div className="text-xs text-slate-400 mt-0.5">Per year</div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-lg">
            <div className="text-xs font-bold text-emerald-600">{placements?.placementRate}%</div>
            <div className="text-xs text-slate-400 mt-0.5">Placed</div>
          </div>
        </div>

        {/* Avg salary */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Avg. Package</span>
          <span className="font-semibold text-slate-700">{formatCurrency(placements?.averageSalary)}/yr</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 text-center text-sm font-medium bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View Details
          </Link>
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(college)}
              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                isInCompare
                  ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              title={isInCompare ? "Remove from compare" : "Add to compare"}
            >
              {isInCompare ? "✓" : "+"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
