import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import { useSession } from "@/hooks/useSession";
import { API_URL } from "@/lib/utils";

export default function MainLayout() {
  const { sessionKey, isLoadingSession } = useSession();
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
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
