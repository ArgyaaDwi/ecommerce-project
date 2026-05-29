import { Star } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  const displayRating = Number.isInteger(rating)
    ? rating.toFixed(0)
    : rating.toFixed(1);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const fillPercent = Math.max(0, Math.min(1, rating - (s - 1))) * 100;

        return (
          <span key={s} className="relative inline-flex h-3 w-3 shrink-0">
            <Star
              className="absolute inset-0 h-3 w-3 fill-slate-200 text-slate-200"
              strokeWidth={1.5}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star
                className="h-3 w-3 fill-amber-400 text-amber-400"
                strokeWidth={1.5}
              />
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-xs text-slate-500">{displayRating}</span>
    </div>
  );
};

export default StarRating;
