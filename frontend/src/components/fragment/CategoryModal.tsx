"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { API_URL } from "@/lib/utils";
import type { ProductCategory } from "@/types/interface";

interface CategoryModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  category: ProductCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryModal = ({
  isOpen,
  mode,
  category,
  onClose,
  onSuccess,
}: CategoryModalProps) => {
  const [name, setName] = useState(() => category?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);

    try {
      const endpoint =
        isEditMode && category
          ? `${API_URL}/admin/product/category/update/${category.id}`
          : `${API_URL}/admin/product/category/create`;

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save category: ${response.status}`);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: isEditMode
          ? "Kategori berhasil diperbarui."
          : "Kategori berhasil dibuat.",
        confirmButtonColor: "#16a34a",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Edit Category" : "Create Category"}
            </p>
            <p className="text-sm text-gray-500">
              {isEditMode ? category?.name : "Kategori baru"}
            </p>
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
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: CD / Media"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
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
            {isSubmitting
              ? "Menyimpan..."
              : isEditMode
                ? "Simpan Perubahan"
                : "Simpan Kategori"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
