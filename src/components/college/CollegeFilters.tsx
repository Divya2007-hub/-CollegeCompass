"use client";
// src/components/college/CollegeFilters.tsx
// Sidebar with search, location, fee range, rating, and type filters

import { CollegeFilters } from "@/types";

interface FiltersProps {
  filters: CollegeFilters;
  onChange: (filters: Partial<CollegeFilters>) => void;
  onReset: () => void;
}

const FEE_RANGES = [
  { label: "Any", min: 0, max: 99999999 },
  { label: "Under ₹1L", min: 0, max: 100000 },
  { label: "₹1L - ₹3L", min: 100000, max: 300000 },
  { label: "₹3L - ₹6L", min: 300000, max: 600000 },
  { label: "Above ₹6L", min: 600000, max: 99999999 },
];

const STATES = [
  "Maharashtra", "Tamil Nadu", "Karnataka", "Delhi", "Rajasthan",
  "West Bengal", "Uttar Pradesh", "Punjab", "Odisha", "Uttarakhand",
];

const COLLEGE_TYPES = ["GOVERNMENT", "PRIVATE", "DEEMED", "AUTONOMOUS"];

export default function CollegeFilters({ filters, onChange, onReset }: FiltersProps) {
  const selectedFeeRange = FEE_RANGES.find(
    (r) => r.min === (filters.minFee ?? 0) && r.max === (filters.maxFee ?? 99999999)
  );

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800">Filters</h2>
        <button onClick={onReset} className="text-xs text-indigo-600 hover:underline">
          Reset all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="College name..."
            value={filters.search || ""}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
        <select
          value={filters.location || ""}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Fee Range */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Annual Fees</label>
        <div className="space-y-1.5">
          {FEE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="feeRange"
                checked={selectedFeeRange?.label === range.label}
                onChange={() => onChange({ minFee: range.min, maxFee: range.max })}
                className="text-indigo-600"
              />
              <span className="text-sm text-slate-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Min Rating: <span className="text-indigo-600">{filters.minRating || 0}+</span>
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating || 0}
          onChange={(e) => onChange({ minRating: Number(e.target.value) })}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0</span><span>2.5</span><span>5</span>
        </div>
      </div>

      {/* College Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">College Type</label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={!filters.type}
              onChange={() => onChange({ type: undefined })}
              className="text-indigo-600"
            />
            <span className="text-sm text-slate-600">All Types</span>
          </label>
          {COLLEGE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                checked={filters.type === type}
                onChange={() => onChange({ type: type as any })}
                className="text-indigo-600"
              />
              <span className="text-sm text-slate-600">{type.charAt(0) + type.slice(1).toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
        <select
          value={`${filters.sortBy || "rating"}-${filters.sortOrder || "desc"}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            onChange({ sortBy: sortBy as any, sortOrder: sortOrder as any });
          }}
          className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="rating-desc">Rating (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
          <option value="fees-asc">Fees (Low to High)</option>
          <option value="fees-desc">Fees (High to Low)</option>
          <option value="name-asc">Name (A-Z)</option>
        </select>
      </div>
    </aside>
  );
}
