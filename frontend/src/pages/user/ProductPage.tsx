"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/fragment/ProductCard";
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  SearchX,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@/types/interface";

const allProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Earbuds Pro X1",
    price: 349000,
    originalPrice: 499000,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    badge: "Diskon",
    rating: 4.8,
    sold: 312,
    category: "Elektronik",
  },
  {
    id: 2,
    name: "Sneakers Urban Run",
    price: 289000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    badge: null,
    rating: 4.6,
    sold: 87,
    category: "Fashion",
  },
  {
    id: 3,
    name: "Tote Bag Canvas Premium",
    price: 125000,
    originalPrice: 175000,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    badge: "Diskon",
    rating: 4.9,
    sold: 541,
    category: "Fashion",
  },
  {
    id: 4,
    name: "Kopi Arabica Cold Brew",
    price: 45000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    badge: null,
    rating: 4.7,
    sold: 203,
    category: "Makanan & Minuman",
  },
  {
    id: 5,
    name: "Serum Vitamin C 30ml",
    price: 189000,
    originalPrice: 250000,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
    badge: "Diskon",
    rating: 4.8,
    sold: 689,
    category: "Kecantikan",
  },
  {
    id: 6,
    name: "Yoga Mat Anti-Slip",
    price: 215000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&q=80",
    badge: null,
    rating: 4.5,
    sold: 134,
    category: "Olahraga",
  },
  {
    id: 7,
    name: "Lampu LED Aesthetic",
    price: 79000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    badge: null,
    rating: 4.6,
    sold: 278,
    category: "Rumah & Taman",
  },
  {
    id: 8,
    name: "Buku Atomic Habits",
    price: 98000,
    originalPrice: 120000,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    badge: null,
    rating: 4.9,
    sold: 455,
    category: "Buku",
  },
  {
    id: 9,
    name: "Mechanical Keyboard TKL",
    price: 575000,
    originalPrice: 750000,
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    badge: "Diskon",
    rating: 4.7,
    sold: 198,
    category: "Elektronik",
  },
  {
    id: 10,
    name: 'Tas Ransel Laptop 15"',
    price: 320000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    badge: null,
    rating: 4.5,
    sold: 320,
    category: "Fashion",
  },
  {
    id: 11,
    name: "Matcha Powder Premium 100g",
    price: 85000,
    originalPrice: 110000,
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80",
    badge: "Diskon",
    rating: 4.8,
    sold: 412,
    category: "Makanan & Minuman",
  },
  {
    id: 12,
    name: "Sunscreen SPF 50 PA++++",
    price: 145000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
    badge: null,
    rating: 4.6,
    sold: 523,
    category: "Kecantikan",
  },
  {
    id: 13,
    name: "Dumbbell Set 5kg Pair",
    price: 195000,
    originalPrice: 240000,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
    badge: "Diskon",
    rating: 4.7,
    sold: 267,
    category: "Olahraga",
  },
  {
    id: 14,
    name: "Pot Tanaman Minimalis",
    price: 55000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
    badge: null,
    rating: 4.4,
    sold: 189,
    category: "Rumah & Taman",
  },
  {
    id: 15,
    name: "Novel Dune - Frank Herbert",
    price: 115000,
    originalPrice: 145000,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    badge: "Diskon",
    rating: 4.9,
    sold: 301,
    category: "Buku",
  },
];

const CATEGORIES = [
  "Semua",
  "Elektronik",
  "Fashion",
  "Makanan & Minuman",
  "Kecantikan",
  "Olahraga",
  "Rumah & Taman",
  "Buku",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "price_asc", label: "Harga: Terendah" },
  { value: "price_desc", label: "Harga: Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "sold", label: "Terlaris" },
];

const getProductCategoryName = (category: Product["category"]) =>
  typeof category === "string" ? category : category.name;

interface FilterContentProps {
  hasActiveFilter: boolean;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  resetFilters: () => void;
}

function FilterContent({
  hasActiveFilter,
  selectedCategories,
  toggleCategory,
  resetFilters,
}: FilterContentProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-slate-900">Filter</p>
        {hasActiveFilter && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-normal text-gray-600 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
            Reset
          </button>
        )}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Kategori
        </p>
        <div className="flex flex-col gap-2 py-3">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-150 ${
                selectedCategories.includes(cat)
                  ? "border-sky-300 bg-sky-100 text-primary"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-slate-300 accent-sky-500 focus:ring-primary"
                />
                <span className="font-medium">{cat}</span>
              </div>
              <span
                className={`text-xs ${selectedCategories.includes(cat) ? "text-primary" : "text-slate-400"}`}
              >
                {cat === "Semua"
                  ? allProducts.length
                  : allProducts.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Semua",
  ]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (
        !selectedCategories.includes("Semua") &&
        !selectedCategories.includes(getProductCategoryName(p.category))
      )
        return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });

    switch (sortBy) {
      case "oldest":
        list = [...list].sort((a, b) => a.id - b.id);
        break;
      case "newest":
        list = [...list].sort((a, b) => b.id - a.id);
        break;
      case "price_asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "sold":
        list = [...list].sort((a, b) => b.sold - a.sold);
        break;
    }
    return list;
  }, [selectedCategories, search, sortBy]);

  const hasActiveFilter = !selectedCategories.includes("Semua");

  const resetFilters = () => {
    setSelectedCategories(["Semua"]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) => {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
          <button
            onClick={() => navigate("/")}
            className="hover:text-primary transition-colors"
          >
            Beranda
          </button>
          <ChevronRight
            className="h-3.5 w-3.5 text-slate-300"
            strokeWidth={2}
          />
          <span className="font-medium text-slate-700">Semua Produk</span>
        </nav>
        <div className="flex gap-6">
          <aside className="hidden w-[28%] shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <FilterContent
                hasActiveFilter={hasActiveFilter}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                resetFilters={resetFilters}
              />
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-primary hover:text-primary lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
                  Filter
                  {hasActiveFilter && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-slate-600 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <div className="relative flex-1 max-w-sm">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama produk..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {filtered.length}
              </span>{" "}
              produk
              {selectedCategories.length > 0 &&
                selectedCategories[0] !== "Semua" && (
                  <>
                    {" "}
                    di{" "}
                    <span className="font-semibold text-primary">
                      {selectedCategories.join(", ")}
                    </span>
                  </>
                )}
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center ring-1 ring-slate-100">
                <SearchX
                  className="mb-4 h-14 w-14 text-slate-200"
                  strokeWidth={1.5}
                />
                <p className="text-base font-semibold text-slate-700">
                  Produk tidak ditemukan
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Coba ubah filter atau kata kunci pencarian
                </p>
                <button
                  onClick={() => {
                    resetFilters();
                    setSearch("");
                  }}
                  className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-95"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl lg:hidden">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">
                Filter Produk
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <FilterContent
              hasActiveFilter={hasActiveFilter}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              resetFilters={resetFilters}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-95"
            >
              Terapkan Filter
            </button>
          </div>
        </>
      )}
    </main>
  );
}
