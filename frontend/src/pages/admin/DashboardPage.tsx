import Card from "@/components/fragment/Card";
import CardChart from "@/components/fragment/CardChart";
import BarChart from "@/components/chart/BarChart";
import { dummyCategoryProduct } from "@/data/dummy/dummyCategoryProduct";
import Breadcrumb from "@/components/fragment/Breadcrumb";
import { Handbag, PartyPopper, Package } from "lucide-react";
import LatestProduct from "@/components/fragment/LatestProduct";
export default function AdminDashboardPage() {
  const breadcrumbItems = [
    {
      name: "Dashboard",
      url: "/dashboard",
    },
  ];
  const barLabels = dummyCategoryProduct.map((item) => item.category);
  const barData = dummyCategoryProduct.map((item) => item.jumlah);

  return (
    <div>
      <Breadcrumb title="Dashboard Admin" breadcrumbItems={breadcrumbItems} />
      <div className="mb-5">
        <p className="text-gray-600 mb-5">Monitoring Keperluan Admin</p>
      </div>
      <p className="text-black mt-5 font-semibold">Overview</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2 mb-5">
        <Card
          icon={<Package color="gray" />}
          text="Total Kategori Produk"
          count="8"
          color="#63C2EB"
          url="/admin/lecturer"
        />
        <Card
          icon={<Handbag color="gray" />}
          text="Total Produk"
          count="30"
          color="#8CC0EB"
          url="/admin/publisher"
        />
        <Card
          icon={<PartyPopper color="gray" />}
          text="Total Promo Aktif"
          count="7"
          color="#427AB5"
          url="/admin/proposal"
        />
      </div>
      <p className="text-black font-semibold mt-4">Informasi Singkat</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <CardChart
          title="Statistik Kategori Produk"
          subtitle="Jumlah Produk Tiap Kategori"
        >
          <BarChart labels={barLabels} data={barData} />
        </CardChart>
        <CardChart
          title="Statistik Produk Terbaru"
          subtitle="Daftar Produk Terbaru"
        >
          <LatestProduct />
        </CardChart>
      </div>
    </div>
  );
}
