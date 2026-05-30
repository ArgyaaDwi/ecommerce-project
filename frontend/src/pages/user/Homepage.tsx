"use client";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/fragment/ProductCard";
import { banners } from "@/data/dummy/banners";
import { useSession } from "@/hooks/useSession";
import { API_URL } from "@/lib/utils";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  Product,
  ApiResponse,
  ProductApiItem,
  CategoryApiItem,
} from "@/types/interface";
import { getCategoryIcon } from "@/helper/getCategoryIcon";

export default function Homepage() {
  const navigate = useNavigate();
  const { sessionKey, isLoadingSession } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    { id: number; name: string; icon: LucideIcon; count: number }[]
  >([]);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % banners.length),
    [],
  );
  const prev = () =>
    setCurrent((c) => (c - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 2500);
    return () => clearInterval(t);
  }, [paused, next]);

  useEffect(() => {
    if (isLoadingSession || !sessionKey) return;
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
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
        ]);

        const productJson = (await productRes.json()) as ApiResponse<
          ProductApiItem[]
        >;
        const categoryJson = (await categoryRes.json()) as ApiResponse<
          CategoryApiItem[]
        >;

        if (productJson.success) {
          const top8Products = productJson.data.slice(0, 8);
          const formattedProducts: Product[] = top8Products.map((product) => ({
            ...product,
            image: product.imageUrl,
            category: product.category.name,
          }));
          setProducts(formattedProducts);

          if (categoryJson.success) {
            const formattedCategories = categoryJson.data.map((category) => ({
              id: category.id,
              name: category.name,
              icon: getCategoryIcon(category.name),
              count: productJson.data.filter(
                (product) => product.category.name === category.name,
              ).length,
            }));

            setCategories(formattedCategories);
          }
        }
      } catch (error) {
        console.error("Gagal fetch data Homepage:", error);
      }
    };

    fetchData();
  }, [sessionKey, isLoadingSession]);

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Tunggu ...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl shadow-[0_18px_45px_rgba(21,145,220,0.12)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="relative min-w-full">
                <div className="relative h-80 w-full overflow-hidden sm:h-100 md:h-115">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${banner.bg} opacity-75`}
                  />
                  <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
                      <div className="max-w-lg">
                        <h1 className="text-3xl font-bold leading-tight text-white drop-shadow sm:text-4xl md:text-5xl">
                          {banner.title}
                        </h1>
                        <p className="mt-3 text-base text-white/85 sm:text-lg">
                          {banner.subtitle}
                        </p>
                        <button className="mt-6 rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary shadow-lg transition hover:bg-primary hover:text-white active:scale-95">
                          {banner.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {[
            { fn: prev, side: "left-4", Icon: ArrowLeft },
            { fn: next, side: "right-4", Icon: ArrowRight },
          ].map(({ fn, side, Icon }) => (
            <button
              key={side}
              onClick={fn}
              className={`absolute top-1/2 ${side} -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/40`}
            >
              <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
            </button>
          ))}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Jelajahi
            </p>
            <p className="text-2xl font-bold text-slate-600">Kategori Produk</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:shadow-md hover:shadow-primary/20 hover:ring-primary"
            >
              <cat.icon className="h-7 w-7 text-primary transition-colors group-hover:text-white" />
              <span className="text-center text-xs font-semibold text-slate-700 group-hover:text-white">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Baru Masuk
            </p>
            <p className="text-2xl font-bold text-slate-600">Produk Terbaru</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95"
          >
            Lihat Semua Produk
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </section>
    </main>
  );
}
