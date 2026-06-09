// src/components/ui/StarRating.tsx
// Visual star rating display component

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export default function StarRating({ rating, max = 5, size = "md", showValue = true }: StarRatingProps) {
  const sizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };
  const filled = Math.floor(rating);
  const partial = rating % 1;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <svg
            key={i}
            className={`${sizes[size]} ${i < filled ? "text-amber-400" : i === filled && partial > 0 ? "text-amber-400" : "text-slate-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {i === filled && partial > 0 ? (
              <defs>
                <linearGradient id={`partial-${i}`}>
                  <stop offset={`${partial * 100}%`} stopColor="currentColor" />
                  <stop offset={`${partial * 100}%`} stopColor="#e2e8f0" />
                </linearGradient>
                <path fill={`url(#partial-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </defs>
            ) : null}
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
