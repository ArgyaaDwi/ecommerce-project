"use client";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/fragment/ProductCard";
import { banners } from "@/data/dummy/banners";

import {
  Laptop,
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Home,
  Car,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categories: {
  id: number;
  name: string;
  icon: LucideIcon;
  count: number;
}[] = [
  { id: 1, name: "Elektronik", icon: Laptop, count: 1240 },
  { id: 2, name: "Fashion", icon: Shirt, count: 3850 },
  { id: 3, name: "Makanan & Minuman", icon: UtensilsCrossed, count: 920 },
  { id: 4, name: "Kecantikan", icon: Sparkles, count: 2100 },
  { id: 5, name: "Olahraga", icon: Dumbbell, count: 670 },
  { id: 6, name: "Rumah & Taman", icon: Home, count: 1530 },
  { id: 7, name: "Otomotif", icon: Car, count: 440 },
  { id: 8, name: "Buku", icon: BookOpen, count: 810 },
];
const latestProducts = [
  {
    id: 1,
    name: "Wireless Earbuds Pro X1",
    price: 349000,
    originalPrice: 499000,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Bahlil_Lahadalia_at_the_Indonesia_Naik_Kelas_book_launching%2C_21_November_2025_24_%28cropped%29.jpg/250px-Bahlil_Lahadalia_at_the_Indonesia_Naik_Kelas_book_launching%2C_21_November_2025_24_%28cropped%29.jpg",
    badge: null,
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
      "https://sultranesia.com/wp-content/uploads/2025/09/67c6a70245c01.jpg",
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
      "https://satujabar.com/wp-content/uploads/2024/08/Bahlil-Lahadalia.jpg",
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
      "https://cdn.antaranews.com/cache/1200x800/2026/04/06/WhatsApp-Image-2026-04-06-at-13.56.13.jpeg",
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
      "https://cdn-jjmn.jawapos.com/images/4/2025/06/25/BAHLIL-LAHADIA-1222435210.jpg",
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
      "https://asset.kompas.com/crops/3yxbBJ5Re-WbhZV0Va06Kp1ar-w=/500x335:4500x3002/1200x800/data/photo/2025/10/28/6900cd55dace1.jpg",
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
      "https://img2.beritasatu.com/cache/investor/480x310-3/1669735189.jpeg",
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
      "https://imgcdn.espos.id/@espos/images/2020/03/191219-ZAM-BISNIS-18-HEADSHOT-Kepala-Badan-Koordinasi-Penanaman-Modal-_BKPM_-Bahlil-Lahadalia-1_6599.jpg",
    badge: "Diskon",
    rating: 4.9,
    sold: 455,
    category: "Buku",
  },
];
export default function Homepage() {
  const navigate = useNavigate();
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
            { fn: prev, side: "left-4", icon: "M15 19l-7-7 7-7" },
            { fn: next, side: "right-4", icon: "M9 5l7 7-7 7" },
          ].map(({ fn, side, icon }) => (
            <button
              key={side}
              onClick={fn}
              className={`absolute top-1/2 ${side} -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition hover:bg-white/40`}
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
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
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-2 rounded-lg border-2 border-primary px-8 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-95"
          >
            Lihat Semua Produk
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
