import type { Product } from "@/types/interface";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { formatCurrency , discount } from "@/lib/utils";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  onToggleSubscription?: (product: Product) => void | Promise<void>;
  isSubscriptionActionLoading?: boolean;
}

const ProductCard = ({
  product,
  onToggleSubscription,
  isSubscriptionActionLoading = false,
}: ProductCardProps) => {
  const imageSrc = product.image ?? product.imageUrl ?? "";
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category.name;
  const isSubscribedPromotion = Boolean(product.isSubscribedPromotion);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20">
      {product.badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            product.badge === "Diskon"
              ? "bg-red-500 text-white"
              : "bg-primary text-white"
          }`}
        >
          {product.badge === "Diskon" && product.originalPrice
            ? `-${discount(product.originalPrice, product.price)}%`
            : product.badge}
        </span>
      )}
      {onToggleSubscription && (
        <button
          type="button"
          onClick={() => onToggleSubscription(product)}
          disabled={isSubscriptionActionLoading}
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${
            isSubscribedPromotion
              ? "border-red-200 bg-red-500/90 text-white hover:bg-red-600 cursor-pointer hover:border-red-600/30 hover:text-white/90"
              : "border-slate-200 bg-white/95 text-slate-500 hover:border-green-500/30 hover:text-green-500 cursor-pointer hover:bg-green-500/10"
          } ${isSubscriptionActionLoading ? "cursor-wait opacity-60" : ""}`}
          aria-label={
            isSubscribedPromotion
              ? `Unsubscribe promotion for ${product.name}`
              : `Subscribe promotion for ${product.name}`
          }
          title={
            isSubscribedPromotion ? "Unsubscribe promo" : "Subscribe promo"
          }
        >
          {isSubscriptionActionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
          ) : isSubscribedPromotion ? (
            <BellOff className="h-4 w-4" strokeWidth={2.25} />
          ) : (
            <Bell className="h-4 w-4" strokeWidth={2.25} />
          )}
        </button>
      )}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-slate-100 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-slate-600">
          {categoryName}
        </span>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-800">
          {product.name}
        </p>
        <StarRating rating={product.rating} />
        <div className="mt-auto flex flex-col gap-0.5">
          {product.originalPrice && (
            <span className="text-xs text-red-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-base font-bold text-black">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="text-xs text-slate-400">{product.sold} terjual</p>
      </div>
    </div>
  );
};

export default ProductCard;
