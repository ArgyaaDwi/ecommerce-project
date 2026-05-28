import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Homepage from "@/pages/user/Homepage";
import MyPreferencePage from "@/pages/user/MyPreferencePage";
import ProductPage from "@/pages/user/ProductPage";
import ProfilePage from "@/pages/user/ProfilePage";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminProductPage from "@/pages/admin/ProductPage";
import AdminPromoPage from "@/pages/admin/PromoPage";
import AdminCategoryPage from "@/pages/admin/CategoryPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/my-preference" element={<MyPreferencePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

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
