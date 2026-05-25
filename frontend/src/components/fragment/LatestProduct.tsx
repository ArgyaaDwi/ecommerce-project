"use client";

type ProductStat = {
  category: string;
  nama: string;
  jumlah: number;
  harga: number;
};

const dummyProducts: ProductStat[] = [
  {
    category: "Barang Elektronik",
    nama: "Laptop",
    jumlah: 42,
    harga: 150000,
  },
  {
    category: "Pakaian",
    nama: "Kaos",
    jumlah: 98,
    harga: 150000,
  },
  {
    category: "Peralatan Rumah Tangga",
    nama: "Panci",
    jumlah: 76,
    harga: 150000,
  },
  {
    category: "Buku",
    nama: "Novel",
    jumlah: 54,
    harga: 150000,
  },
  {
    category: "Mainan",
    nama: "Boneka",
    jumlah: 43,
    harga: 150000,
  },
];

export default function LatestProduct() {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg mt-1">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="px-4 py-3">No.</th>
            <th className="px-4 py-3">Nama</th>
            <th className="px-4 py-3">Kategori</th>
            <th className="px-4 py-3">Jumlah</th>
            <th className="px-4 py-3">Harga</th>
          </tr>
        </thead>

        <tbody>
          {dummyProducts.map((item, index) => (
            <tr key={item.category} className=" hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-gray-800">
                {item.nama}
              </td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.jumlah}</td>
              <td className="px-4 py-2">Rp {item.harga.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
