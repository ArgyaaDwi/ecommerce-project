import { Star } from "lucide-react";

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-1 text-xs text-slate-500">{rating}</span>
    </div>
  );
};

export default StarRating;
