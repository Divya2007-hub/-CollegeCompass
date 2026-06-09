// src/lib/utils.ts
// Shared utility functions used across components

export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-emerald-600 bg-emerald-50";
  if (rating >= 4.0) return "text-blue-600 bg-blue-50";
  if (rating >= 3.5) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
}

export function getCollegeTypeColor(type: string): string {
  const map: Record<string, string> = {
    GOVERNMENT: "bg-blue-100 text-blue-800",
    PRIVATE: "bg-purple-100 text-purple-800",
    DEEMED: "bg-amber-100 text-amber-800",
    AUTONOMOUS: "bg-green-100 text-green-800",
  };
  return map[type] || "bg-gray-100 text-gray-800";
}

export function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== 0) {
      query.set(key, String(value));
    }
  }
  return query.toString();
}
