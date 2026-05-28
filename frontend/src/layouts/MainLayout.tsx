import { Outlet } from "react-router-dom";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";

export default function MainLayout() {
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
