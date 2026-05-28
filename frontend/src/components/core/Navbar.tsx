"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import ModalUser from "../fragment/ModalUser";

const navItems = [
  { label: "Home", to: "/" },
  { label: "My Preference", to: "/my-preference" },
  { label: "Product", to: "/products" },
];

const promoItems = [
  "Promo hari ini: Gratis ongkir untuk minimal belanja Rp150.000",
  "Diskon sampai 30% untuk produk pilihan",
  "Cek update promo terbaru setiap hari",
];

const marqueeItems = [...promoItems, ...promoItems];

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const user = {
    name: "Argya Awoakwoawk",
    email: "mbg@example.com",
    avatarUrl: "/assets/images/user_img.png",
    role: "",
  };

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
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-wide text-slate-900">
              ini<span className="text-primary">Toko</span>
            </span>
          </div>

          <nav className="flex-1">
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
            className="relative flex items-center justify-end"
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
        </div>
      </div>
      <div className="overflow-hidden border-t border-slate-200/80 bg-slate-50 py-2">
        <div className="animate-[marquee_28s_linear_infinite] flex w-max items-center gap-10 whitespace-nowrap px-6 text-sm font-medium text-amber-500">
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
