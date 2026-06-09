// src/components/ui/Skeleton.tsx
// Loading skeleton components for various content types

export function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg" />
          ))}
        </div>
        <div className="h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-slate-200 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-8 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="grid grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}
