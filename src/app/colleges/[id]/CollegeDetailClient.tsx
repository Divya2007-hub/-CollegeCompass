"use client";
// src/app/colleges/[id]/CollegeDetailClient.tsx
// Handles client-side save and review actions on the college detail page

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  collegeId: string;
  isSaved: boolean;
  isLoggedIn: boolean;
}

export default function CollegeDetailClient({ collegeId, isSaved: initialSaved, isLoggedIn }: Props) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!isLoggedIn) {
      router.push("/auth/login");
      return;
    }

    setSaving(true);
    try {
      const method = isSaved ? "DELETE" : "POST";
      const url = isSaved ? `/api/saved-colleges?collegeId=${collegeId}` : `/api/saved-colleges`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" ? JSON.stringify({ collegeId }) : undefined,
      });
      if (res.ok) {
        setIsSaved(!isSaved);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm border ${
        isSaved
          ? "bg-red-500/80 border-red-400 text-white hover:bg-red-600/80"
          : "bg-white/20 border-white/30 text-white hover:bg-white/30"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill={isSaved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {saving ? "..." : isSaved ? "Saved" : "Save"}
    </button>
  );
}
