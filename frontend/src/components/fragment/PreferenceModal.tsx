"use client";

import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";

interface PreferenceModalProps {
  isOpen: boolean;
  categories: string[];
  categoryCounts: Record<string, number>;
  value: string[];
  onClose: () => void;
  onSkip: () => void;
  onSave: (value: string[]) => void;
}

const PreferenceModal = ({
  isOpen,
  categories,
  categoryCounts,
  value,
  onClose,
  onSkip,
  onSave,
}: PreferenceModalProps) => {
  const [draft, setDraft] = useState<string[]>(value);
  useEffect(() => {
    if (isOpen) {
      setDraft(value);
    }
  }, [isOpen, value]);
  const toggleDraftCategory = (category: string) => {
    setDraft((current) => {
      if (category === "Semua") {
        return ["Semua"];
      }

      const withoutSemua = current.filter((item) => item !== "Semua");
      if (withoutSemua.includes(category)) {
        const next = withoutSemua.filter((item) => item !== category);
        return next.length > 0 ? next : ["Semua"];
      }

      return [...withoutSemua, category];
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Preferensi Kategori
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
              Pilih kategori yang kamu suka
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
        <div className="my-6">
          <p className="text-sm text-slate-500">
            Centang kategori yang ingin kamu jadikan preferensi. Pilihan ini
            akan dipakai untuk menyesuaikan tampilan produk di halaman ini.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all duration-150 ${
                draft.includes(cat)
                  ? "border-primary bg-primaryKu text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={draft.includes(cat)}
                  onChange={() => toggleDraftCategory(cat)}
                  className="h-4 w-4 rounded border-slate-300 accent-primary"
                />
                <span className="font-medium">{cat}</span>
              </div>
              <span
                className={`text-xs ${draft.includes(cat) ? "text-white/70" : "text-slate-400"}`}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </label>
          ))}
        </div>
        <div className="my-2 flex items-start gap-2 rounded-lg bg-sky-50 px-3 py-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
          <p className="text-xs text-sky-700">
            Anda bisa mengisi preferensi ini nanti.
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Lewati
          </button>
          <button
            type="button"
            onClick={() => onSave(draft)}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            Simpan
          </button>
        </div>
      </div>
    </>
  );
};

export default PreferenceModal;
