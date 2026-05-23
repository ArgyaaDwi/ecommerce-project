"use client";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/core/Sidebar";
import Header from "@/components/core/Header";
import SidebarItem from "@/components/core/SidebarItem";
import { LayoutDashboard, Handbag, Package, PartyPopper } from "lucide-react";

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <main className="flex h-screen bg-backgroundAdmin">
      <Sidebar
        title="Admin Panel"
        user={null}
        mobileOpen={mobileMenuOpen}
        onMobileClose={handleMobileClose}
      >
        <p className="pl-1 text-gray-400 text-xs font-thin">Menu</p>

        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          url="/admin/dashboard"
        />
        <p className="pl-1 text-gray-400 text-xs font-thin">Kelola</p>
        <SidebarItem
          icon={<Package size={20} />}
          text="Product Category"
          url="/admin/category"
        />
        <SidebarItem
          icon={<Handbag size={20} />}
          text="Product"
          url="/admin/product"
        />
        <SidebarItem
          icon={<PartyPopper size={20} />}
          text="Promo"
          url="/admin/promo"
        />
      </Sidebar>
      <div className="flex-1 flex flex-col h-screen md:ml-0">
        <Header user={null} onMenuClick={handleMenuClick} />
        <div className="flex-1 overflow-y-auto bg-backgroundDash p-4">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </main>
  );
}
