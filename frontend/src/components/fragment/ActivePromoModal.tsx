import { X } from "lucide-react";
import { formatFullDateTime } from "@/helper/formatDate";
import type { PromotionPayload } from "@/types/interface";

type ActivePromoModalProps = {
  promo: PromotionPayload | null;
  onClose: () => void;
};

export default function ActivePromoModal({
  promo,
  onClose,
}: ActivePromoModalProps) {
  if (!promo) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 text-left align-middle shadow-2xl transition-all animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-slate-100 p-1 text-slate-400 transition hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mt-2 flex flex-col items-center text-center">
          <span className="mb-2 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 ring-1 ring-inset ring-red-600/10">
            {promo.promotionName.toUpperCase()}
          </span>
          <h3 className="px-4 text-xl font-semibold text-slate-800">
            {promo.productName}
          </h3>

          <p className="mt-1 mb-4 px-4 text-sm text-slate-500">
            jangan sampai lewatkan promo barang pilihanmu, langsung cek sebelum
            kehabisan!
          </p>
          <div className="my-4 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Harga Promo Spesial
            </p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              Rp {promo.promotionPrice.toLocaleString("id-ID")}
            </p>
          </div>

          <p className="mb-6 px-2 text-sm text-slate-500">
            "{promo.description}"
          </p>
          <div className="mt-2 mb-6 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Dibuat: {formatFullDateTime(promo.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
