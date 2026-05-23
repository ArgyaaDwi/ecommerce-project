import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminProductPage from "@/pages/admin/ProductPage";
import AdminPromoPage from "@/pages/admin/PromoPage";
import AdminCategoryPage from "@/pages/admin/CategoryPage";

function PublicHome() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Homepage</h1>
      <p className="mt-2 text-gray-600">Halaman public untuk user biasa.</p>
    </main>
  );
}

function MyPreferencePage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">My Preference</h1>
      <p className="mt-2 text-gray-600">Placeholder halaman preferensi user.</p>
    </main>
  );
}

function ProductsPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold">Products</h1>
      <p className="mt-2 text-gray-600">Placeholder halaman daftar produk.</p>
    </main>
  );
}

// admin pages are imported above from src/pages/admin

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/my-preference" element={<MyPreferencePage />} />
      <Route path="/products" element={<ProductsPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="category" element={<AdminCategoryPage />} />
        <Route path="product" element={<AdminProductPage />} />
        <Route path="promo" element={<AdminPromoPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
