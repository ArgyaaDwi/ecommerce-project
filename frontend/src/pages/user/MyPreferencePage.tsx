"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/fragment/ProductCard";
import PreferenceModal from "../../components/fragment/PreferenceModal";
import { useSession } from "@/hooks/useSession";
import { API_URL } from "@/lib/utils";
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  SearchX,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import type {
  ApiResponse,
  CategoryApiItem,
  CategoryFilterItem,
  Product,
  ProductApiItem,
  PromotionApiItem,
} from "@/types/interface";

type PreferenceDetailResponse = ApiResponse<unknown>;

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

const extractPreferenceIds = (rawData: unknown): number[] => {
  if (!rawData || !Array.isArray(rawData)) return [];

  const seen = new Set<number>();
  return rawData
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        const categoryId = (item as { productCategory?: { id?: unknown } })
          .productCategory?.id;
        return typeof categoryId === "number" ? categoryId : null;
      }
      return null;
    })
    .filter(
      (id): id is number =>
        id !== null && !seen.has(id) && seen.add(id) !== undefined,
    );
};
interface FilterContentProps {
  hasActiveFilter: boolean;
  categories: CategoryFilterItem[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  resetFilters: () => void;
}

function FilterContent({
  hasActiveFilter,
  categories,
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
          {categories.map((cat) => (
            <label
              key={cat.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-150 ${
                selectedCategories.includes(cat.name)
                  ? "border-sky-300 bg-sky-100 text-primary"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => toggleCategory(cat.name)}
                  className="h-4 w-4 rounded border-slate-300 accent-sky-500 focus:ring-primary"
                />
                <span className="font-medium">{cat.name}</span>
              </div>
              <span
                className={`text-xs ${selectedCategories.includes(cat.name) ? "text-primary" : "text-slate-400"}`}
              >
                {cat.count}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyPreferencePage() {
  const navigate = useNavigate();
  const { sessionKey, isLoadingSession } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryFilterItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Semua",
  ]);
  const [preferenceCategories, setPreferenceCategories] = useState<string[]>(
    [],
  );
  const [preferenceCategoryIds, setPreferenceCategoryIds] = useState<number[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [preferenceModalOpen, setPreferenceModalOpen] = useState(false);
  const [preferenceModalKey, setPreferenceModalKey] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const syncPreferenceState = (
    preferenceIds: number[],
    categoryPool: CategoryFilterItem[],
  ) => {
    const preferenceNames = preferenceIds
      .map(
        (categoryId) =>
          categoryPool.find((category) => category.id === categoryId)?.name,
      )
      .filter((categoryName): categoryName is string => Boolean(categoryName));

    setPreferenceCategoryIds(preferenceIds);
    setPreferenceCategories(preferenceNames);
    setSelectedCategories(
      preferenceNames.length > 0 ? preferenceNames : ["Semua"],
    );
  };

  useEffect(() => {
    if (isLoadingSession || !sessionKey) return;

    let isActive = true;

    const fetchData = async () => {
      setIsLoadingData(true);

      try {
        const [productRes, categoryRes, preferenceRes, promotionRes] =
          await Promise.all([
            fetch(`${API_URL}/product/list`, {
              headers: {
                Authorization: `Bearer ${sessionKey}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${API_URL}/product/category/list`, {
              headers: {
                Authorization: `Bearer ${sessionKey}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${API_URL}/user/preference/detail`, {
              headers: {
                Authorization: `Bearer ${sessionKey}`,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${API_URL}/admin/promotion/list`, {
              headers: {
                Authorization: `Bearer ${sessionKey}`,
                "Content-Type": "application/json",
              },
            }),
          ]);

        const productJson = (await productRes.json()) as ApiResponse<
          ProductApiItem[]
        >;
        const categoryJson = (await categoryRes.json()) as ApiResponse<
          CategoryApiItem[]
        >;
        const preferenceJson =
          (await preferenceRes.json()) as PreferenceDetailResponse;
        const promotionJson = (await promotionRes.json()) as ApiResponse<
          PromotionApiItem[]
        >;

        if (!isActive) return;

        const promotionByProductId = new Map<number, PromotionApiItem>();

        if (promotionJson.success) {
          promotionJson.data.forEach((promotion) => {
            if (promotion.isActive) {
              promotionByProductId.set(promotion.product.id, promotion);
            }
          });
        }

        const rawProducts = productJson.success ? productJson.data : [];
        const formattedProducts: Product[] = rawProducts.map((product) => ({
          id: product.id,
          name: product.name,
          price: promotionByProductId.has(product.id)
            ? promotionByProductId.get(product.id)!.price
            : product.price,
          originalPrice: promotionByProductId.has(product.id)
            ? product.price
            : null,
          image: product.imageUrl,
          badge: promotionByProductId.has(product.id) ? "Diskon" : null,
          rating: product.rating,
          sold: product.sold,
          category: product.category.name,
          description: product.description,
          createdAt: product.createdAt,
          isSubscribedPromotion: product.isSubscribedPromotion,
        }));

        const categorySource =
          categoryJson.success && categoryJson.data.length > 0
            ? categoryJson.data
            : Array.from(
                new Map(
                  rawProducts.map((product) => [
                    product.category.id,
                    product.category,
                  ]),
                ).values(),
              );

        const formattedCategories: CategoryFilterItem[] = categorySource.map(
          (category) => ({
            id: category.id,
            name: category.name,
            count: formattedProducts.filter(
              (product) =>
                getProductCategoryName(product.category) === category.name,
            ).length,
          }),
        );

        const preferenceIds = preferenceJson.success
          ? extractPreferenceIds(preferenceJson.data)
          : [];

        setProducts(formattedProducts);
        setCategories(formattedCategories);
        syncPreferenceState(preferenceIds, formattedCategories);
      } catch (error) {
        console.error("Gagal fetch data MyPreferencePage:", error);
      } finally {
        if (isActive) {
          setIsLoadingData(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [sessionKey, isLoadingSession]);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category.name, category.count]),
      ) as Record<string, number>,
    [categories],
  );

  const preferenceScopedProducts = useMemo(
    () =>
      preferenceCategories.length > 0
        ? products.filter((product) =>
            preferenceCategories.includes(
              getProductCategoryName(product.category),
            ),
          )
        : products,
    [products, preferenceCategories],
  );

  const filterCategories = useMemo<CategoryFilterItem[]>(() => {
    const visibleCategories =
      preferenceCategories.length > 0
        ? categories.filter((category) =>
            preferenceCategories.includes(category.name),
          )
        : categories;

    return [
      {
        id: 0,
        name: "Semua",
        count: preferenceScopedProducts.length,
      },
      ...visibleCategories,
    ];
  }, [categories, preferenceCategories, preferenceScopedProducts.length]);

  const filtered = useMemo(() => {
    let list = preferenceScopedProducts.filter((product) => {
      if (
        !selectedCategories.includes("Semua") &&
        !selectedCategories.includes(getProductCategoryName(product.category))
      ) {
        return false;
      }

      if (
        search &&
        !product.name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

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
  }, [preferenceScopedProducts, selectedCategories, search, sortBy]);

  const hasActiveFilter = !selectedCategories.includes("Semua");

  const resetFilters = () => {
    setSelectedCategories(
      preferenceCategories.length > 0 ? preferenceCategories : ["Semua"],
    );
  };

  const openPreferenceModal = () => {
    setPreferenceModalKey((current) => current + 1);
    setPreferenceModalOpen(true);
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

  const handleSavePreference = async (value: string[]) => {
    if (!sessionKey) return;

    const nextCategoryNames = value.filter((category) => category !== "Semua");
    const nextCategoryIds = categories
      .filter((category) => nextCategoryNames.includes(category.name))
      .map((category) => category.id);

    console.log("draft value:", value);
    console.log("nextCategoryNames:", nextCategoryNames);
    console.log("nextCategoryIds:", nextCategoryIds);

    try {
      const response = await fetch(`${API_URL}/user/preference/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryIds: nextCategoryIds }),
      });

      const result = (await response.json()) as ApiResponse<unknown>;

      if (!result.success) {
        throw new Error("Gagal menyimpan preferensi");
      }

      const detailRes = await fetch(`${API_URL}/user/preference/detail`, {
        headers: {
          Authorization: `Bearer ${sessionKey}`,
          "Content-Type": "application/json",
        },
      });

      const detailResult = (await detailRes.json()) as PreferenceDetailResponse;
      const persistedIds = detailResult.success
        ? extractPreferenceIds(detailResult.data)
        : nextCategoryIds;

      syncPreferenceState(persistedIds, categories);
      setPreferenceModalOpen(false);
    } catch (error) {
      console.error("Gagal update preference:", error);
    }
  };

  const handleSkipPreference = () => {
    setPreferenceModalOpen(false);
  };

  const preferenceButtonLabel =
    preferenceCategoryIds.length > 0
      ? "Edit Preferensi Kategori"
      : "Atur Preferensi Kategori";

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        Tunggu ...
      </div>
    );
  }

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
          <span className="font-medium text-slate-700">Preferensi Saya</span>
        </nav>
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Preferensi kategori kamu
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {preferenceCategories.length > 0
                ? preferenceCategories.join(", ")
                : "Belum ada preferensi khusus, semua kategori ditampilkan."}
            </p>
          </div>
          <button
            type="button"
            onClick={openPreferenceModal}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/80"
          >
            {preferenceButtonLabel}
          </button>
        </div>
        <div className="flex gap-6">
          <aside className="hidden w-[28%] shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <FilterContent
                hasActiveFilter={hasActiveFilter}
                categories={filterCategories}
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

            {isLoadingData ? (
              <div className="flex min-h-80 items-center justify-center rounded-2xl bg-white text-sm font-medium text-slate-500 ring-1 ring-slate-100">
                Memuat produk...
              </div>
            ) : null}

            <div className="my-4">
              <p className="text-sm text-slate-400">
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
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-3 xl:grid-cols-3">
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
              categories={filterCategories}
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

      <PreferenceModal
        key={preferenceModalKey}
        isOpen={preferenceModalOpen}
        categories={categories.map((category) => category.name)}
        categoryCounts={categoryCounts}
        value={preferenceCategories}
        onClose={() => setPreferenceModalOpen(false)}
        onSkip={handleSkipPreference}
        onSave={handleSavePreference}
      />
    </main>
  );
}
