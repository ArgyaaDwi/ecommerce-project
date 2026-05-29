import type { Product } from "@/types/interface";
import { formatPrice, discount } from "@/lib/utils";
import StarRating from "./StarRating";

const ProductCard = ({ product }: { product: Product }) => {
  const imageSrc = product.image ?? product.imageUrl ?? "";
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category.name;

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
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="w-fit rounded-full bg-slate-100 px-1.5 py-0.25 text-[9px] font-semibold uppercase tracking-wide text-slate-600">
          {categoryName}
        </span>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-slate-800">
          {product.name}
        </p>
        <StarRating rating={product.rating} />
        <div className="mt-auto flex flex-col gap-0.5">
          {product.originalPrice && (
            <span className="text-xs text-rose-300 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-base font-bold text-black">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-xs text-slate-400">{product.sold} terjual</p>
      </div>
    </div>
  );
};

export default ProductCard;
