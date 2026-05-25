import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Search,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcrumb";
import type { Product } from "@/data/dummy";
import { dummyProducts } from "@/data/dummy";

const columnHelper = createColumnHelper<Product>();

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductPage() {
  const [data] = useState(() => [...dummyProducts]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Produk", url: "/admin/product" },
  ];

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", { header: "ID", size: 60 }),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("category", { header: "Category" }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("createdAt", { header: "Created At" }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleCreatePromoClick(info.row.original)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-sm font-medium transition"
            >
              <Plus size={14} />
              <span>Promo</span>
            </button>
            <button
              onClick={() => handleEdit(info.row.original.id)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition"
            >
              <Pencil size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, pagination },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (id: number) => {
    console.log(`Edit product ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete product ID: ${id}`);
  };

  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    price: "",
    description: "",
    status: "active" as "active" | "inactive",
  });
  const [promoProduct, setPromoProduct] = useState<Product | null>(null);

  const handleCreatePromoClick = (product: Product) => {
    setPromoProduct(product);
    setPromoForm({
      price: String(product.price),
      description: "",
      status: "active",
    });
    setPromoModalOpen(true);
  };

  const handleCreatePromoSave = () => {
    if (!promoProduct) return;
    const newPromo = {
      id: Math.floor(Math.random() * 1000000),
      productName: promoProduct.name,
      price: Number(promoForm.price),
      description: promoForm.description,
      status: promoForm.status,
    };
    setPromoModalOpen(false);
    setPromoProduct(null);
    console.log("Created promo:", newPromo);
  };

  const rows = table.getRowModel().rows;

  return (
    <div>
      <Breadcrumb title="Produk" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <p className="text-gray-600 mb-6">Monitoring Produk</p>

        <div className="flex items-center gap-2 my-6 bg-white p-3 rounded-lg border border-gray-200">
          <Search size={20} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 min-w-0 outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full min-w-[860px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-400"
                  >
                    No data found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 text-sm text-gray-700"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex md:hidden flex-col gap-3">
          {rows.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
              No data found.
            </div>
          ) : (
            rows.map((row) => {
              const product = row.original;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      #{product.id}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {product.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Category</p>
                    <p className="text-sm text-gray-700">{product.category}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price</p>
                    <p className="text-sm text-gray-700">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Created At</p>
                    <p className="text-sm text-gray-700">{product.createdAt}</p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-sm text-gray-600">
              Show{" "}
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="inline-block mx-2 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {[5, 10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              entries
            </span>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {rows.length > 0 ? 1 : 0} to {rows.length} of {data.length}{" "}
          results
        </div>
      </div>

      {promoModalOpen && promoProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Create Promo
                </p>
                <p className="text-sm text-gray-500">{promoProduct.name}</p>
              </div>
              <button
                onClick={() => setPromoModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Harga
                </label>
                <input
                  type="number"
                  value={promoForm.price}
                  onChange={(e) =>
                    setPromoForm((c) => ({ ...c, price: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  value={promoForm.description}
                  onChange={(e) =>
                    setPromoForm((c) => ({ ...c, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={promoForm.status}
                  onChange={(e) =>
                    setPromoForm((c) => ({
                      ...c,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                onClick={() => setPromoModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePromoSave}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Simpan Promo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
