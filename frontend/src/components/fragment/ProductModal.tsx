"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { API_URL } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types/interface";

interface ProductModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  product: Product | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

const ProductModal = ({
  isOpen,
  mode,
  product,
  categories,
  onClose,
  onSuccess,
}: ProductModalProps) => {
  const [name, setName] = useState(() => product?.name ?? "");
  const [price, setPrice] = useState(() => product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(() => {
    if (typeof product?.category === "object") {
      return product.category.id.toString();
    }

    return "";
  });
  const [imageUrl, setImageUrl] = useState(() => product?.imageUrl ?? "");
  const [description, setDescription] = useState(
    () => product?.description ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedPrice = price.trim();
    const trimmedCategoryId = categoryId.trim();
    const trimmedDescription = description.trim();
    const trimmedImageUrl = imageUrl.trim();

    if (
      !trimmedName ||
      !trimmedPrice ||
      !trimmedCategoryId ||
      !trimmedDescription
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        isEditMode && product
          ? `${API_URL}/admin/product/update/${product.id}`
          : `${API_URL}/admin/product/create`;

      const response = await fetch(endpoint, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          price: Number(trimmedPrice),
          categoryId: Number(trimmedCategoryId),
          imageUrl: trimmedImageUrl,
          description: trimmedDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save product: ${response.status}`);
      }

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: isEditMode
          ? "Produk berhasil diperbarui."
          : "Produk berhasil dibuat.",
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
              {isEditMode ? "Edit Product" : "Create Product"}
            </p>
            <p className="text-sm text-gray-500">
              {isEditMode ? product?.name : "Produk baru"}
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
              Nama Produk
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: CD / Media"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Harga
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 2000123"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Pilih kategori</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: buat makan"
              rows={4}
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
                : "Simpan Produk"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
