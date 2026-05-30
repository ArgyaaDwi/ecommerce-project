"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { API_URL } from "@/lib/utils";
import type { PromotionApiItem } from "@/types/interface";

interface PromoStatusModalProps {
  isOpen: boolean;
  promotion: PromotionApiItem | null;
  onClose: () => void;
  onSuccess: (promotionId: number, isActive: boolean) => void;
}

const PromoStatusModal = ({
  isOpen,
  promotion,
  onClose,
  onSuccess,
}: PromoStatusModalProps) => {
  const [isActive, setIsActive] = useState(
    promotion ? promotion.isActive : true,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!promotion || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/admin/promotion/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promotionId: promotion.id,
          isActive,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update promotion: ${response.status}`);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Status promo berhasil diubah menjadi ${isActive ? "Active" : "Inactive"}.`,
        confirmButtonColor: "#16a34a",
      });

      onSuccess(promotion.id, isActive);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !promotion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">Update Status</p>
            <p className="text-sm text-gray-500">{promotion.product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status Promo
            </label>
            <select
              value={String(isActive)}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-primaryKu px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoStatusModal;
