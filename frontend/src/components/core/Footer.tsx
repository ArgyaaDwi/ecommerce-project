import { ShieldCheck, RotateCcw, Zap, ClockFading } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    label: "100% Aman",
  },
  {
    icon: RotateCcw,
    label: "Mudah Retur",
  },
  {
    icon: Zap,
    label: "Pengiriman Cepat",
  },
  {
    icon: ClockFading,
    label: "Dukungan 24/7",
  },
];
const Footer = () => {
  const footerLinks = {
    Belanja: [
      { label: "Semua Produk", href: "#" },
      { label: "Promo & Diskon", href: "#" },
      { label: "Produk Baru", href: "#" },
      { label: "Best Seller", href: "#" },
    ],
    Bantuan: [
      { label: "Cara Pemesanan", href: "#" },
      { label: "Pembayaran", href: "#" },
      { label: "Pengiriman", href: "#" },
      { label: "FAQ", href: "#" },
    ],
    Perusahaan: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog", href: "#" },
    ],
  };
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl font-black tracking-tight text-white">
                ini<span className="text-gray-800">Toko</span>
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs mb-7">
              Kayaknya ini toko e-commerce, siap menyaingin Koperasi Desa Merah
              Putih.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/75 hover:text-white transition-colors duration-150 hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap justify-center md:justify-center gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;

              return (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-white"
                >
                  <Icon
                    className="w-4 h-4 text-icon shrink-0"
                    strokeWidth={1.8}
                  />

                  <span className="text-xs font-medium">{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/80 text-center sm:text-left">
            © 2026 Argya Awokwaowkawo. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Syarat & Ketentuan", "Kebijakan Privasi"].map((item, i, arr) => (
              <span key={item} className="flex items-center gap-5">
                <a
                  href="#"
                  className="text-xs text-white/80 hover:text-white transition-colors duration-150"
                >
                  {item}
                </a>
                {i < arr.length - 1 && (
                  <span className="text-white/15 text-xs">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
