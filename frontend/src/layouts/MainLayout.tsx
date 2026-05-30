import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import ActivePromoModal from "@/components/fragment/ActivePromoModal";
import { useSession } from "@/hooks/useSession";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, PromotionPayload } from "@/types/interface";

export default function MainLayout() {
  const { sessionKey, isLoadingSession } = useSession();
  const [activePromo, setActivePromo] = useState<PromotionPayload | null>(null);

  useEffect(() => {
    if (sessionKey) {
      console.log("SessionKey aktif:", sessionKey);
      const fetchUserData = async () => {
        try {
          const res = await fetch(`${API_URL}/user/get_session`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionKey}`,
            },
          });
          const result = await res.json();
          if (result.success) {
            console.log("User:", result.data);
          }
        } catch (error) {
          console.error("Gagal get data user:", error);
        }
      };
      fetchUserData();

      const sseUrl = `${API_URL}/promotion/stream?sessionKey=${sessionKey}`;
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("connected", (event) => {
        console.log("[success] SSE Connected:", event.data);
      });

      eventSource.addEventListener("promotion", async (event) => {
        try {
          const rawData = JSON.parse(event.data) as PromotionPayload;
          console.log("PROMO MASUK (Awal):", rawData);
          let fetchedProductName = "Produk Pilihan";

          try {
            const productRes = await fetch(`${API_URL}/product/list`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${sessionKey}`,
                "Content-Type": "application/json",
              },
            });

            type ProductLookupItem = {
              id: number;
              name: string;
            };

            const productJson = (await productRes.json()) as
              | ApiResponse<ProductLookupItem[]>
              | ProductLookupItem[];

            const productList = Array.isArray(productJson)
              ? productJson
              : Array.isArray(productJson?.data)
                ? productJson.data
                : [];

            const matchedProduct = productList.find(
              (item) => item.id === rawData.productId,
            );

            if (matchedProduct) {
              fetchedProductName = matchedProduct.name;
            }
          } catch (fetchErr) {
            console.error("gagal ambil nama produk via API:", fetchErr);
          }

          const finalPromoData = {
            ...rawData,
            productName: fetchedProductName,
          };

          console.log("Final Data:", finalPromoData);
          setActivePromo(finalPromoData);
        } catch (err) {
          console.error("gagal parse data SSE promo:", err);
        }
      });
      return () => {
        eventSource.close();
      };
    }
  }, [sessionKey]);

  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-medium text-slate-500">Tunggu ...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 relative">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
      <ActivePromoModal
        promo={activePromo}
        onClose={() => setActivePromo(null)}
      />
    </main>
  );
}
