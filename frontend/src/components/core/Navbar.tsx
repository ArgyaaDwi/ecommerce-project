"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import ModalUser from "../fragment/ModalUser";
import { useSession } from "@/hooks/useSession";
import { API_URL, formatCurrency } from "@/lib/utils";
import type { ApiResponse, PromotionApiItem } from "@/types/interface";

const navItems = [
  { label: "Home", to: "/" },
  { label: "My Preference", to: "/my-preference" },
  { label: "Product", to: "/products" },
];

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [promoItems, setPromoItems] = useState<string[]>([]);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { sessionKey, isLoadingSession } = useSession();

  const user = {
    name: "Argya Awoakwoawk",
    email: "mbg@example.com",
    avatarUrl: "/assets/images/user_img.png",
    role: "",
  };

  useEffect(() => {
    if (isLoadingSession) return;

    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/promotion/list`, {
          headers: {
            "Content-Type": "application/json",
            ...(sessionKey ? { Authorization: `Bearer ${sessionKey}` } : {}),
          },
        });

        const result = (await res.json()) as ApiResponse<PromotionApiItem[]>;

        if (!result.success) return;

        const formattedItems = result.data
          .filter((promotion) => promotion.isActive)
          .map(
            (promotion) =>
              `${promotion.product.name} - ${promotion.description} - ${formatCurrency(promotion.price)}`,
          );

        setPromoItems(
          formattedItems.length > 0
            ? [...formattedItems, ...formattedItems]
            : ["Belum ada promo aktif saat ini"],
        );
      } catch (error) {
        console.error("Gagal fetch promo navbar:", error);
        setPromoItems(["Gagal memuat promo saat ini"]);
      }
    };

    fetchPromotions();
  }, [sessionKey, isLoadingSession]);

  const marqueeItems = useMemo(
    () => (promoItems.length > 0 ? promoItems : ["Memuat promo..."]),
    [promoItems],
  );

  useEffect(() => {
    if (!isModalOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!userMenuRef.current) return;

      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:flex-nowrap md:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-wide text-slate-900">
              ini<span className="text-primary">Toko</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-primary/30 hover:text-primary md:hidden"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navbar-links"
            aria-label="Toggle navigation menu"
          >
            <span className="flex h-4 w-4 flex-col justify-between">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
            Menu
          </button>

          <nav className="hidden flex-1 md:block">
            <div className="mx-auto flex w-fit items-center gap-1 rounded-lg bg-slate-100 p-1 shadow-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "text-slate-600 hover:bg-white hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div
            ref={userMenuRef}
            className="relative order-2 flex items-center justify-end md:order-0"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen((prev) => !prev)}
              className="flex items-center justify-center rounded-full ring-2 ring-transparent transition hover:ring-primary/20 focus:outline-none focus:ring-primary/30"
              aria-label="Open user menu"
            >
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover shadow-sm"
              />
            </button>
            {isModalOpen && (
              <ModalUser
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
              />
            )}
          </div>

          <nav
            id="mobile-navbar-links"
            className={`order-3 w-full md:hidden ${isMobileNavOpen ? "block" : "hidden"}`}
          >
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
      <div className="overflow-hidden border-t border-slate-200/80 bg-slate-50 py-2">
        <div className="animate-[marquee_28s_linear_infinite] flex w-max items-center gap-10 whitespace-nowrap px-6 text-sm font-medium text-amber-500 will-change-transform">
          {marqueeItems.map((item, index) => (
            <span key={`${item}-${index}`} className="shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
