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
  X,
} from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcrumb";
import type { Promo } from "@/data/dummy";
import { dummyPromos } from "@/data/dummy";

const columnHelper = createColumnHelper<Promo>();

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PromoPage() {
  const [data, setData] = useState(() => [...dummyPromos]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    price: "",
    description: "",
    status: "active" as Promo["status"],
  });

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Promo", url: "/admin/promo" },
  ];

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", { header: "ID", size: 60 }),
      columnHelper.accessor("productName", { header: "Product" }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("description", { header: "Description" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          return (
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status === "active" ? "Active" : "Inactive"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(info.row.original)}
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

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setFormState({
      price: String(promo.price),
      description: promo.description,
      status: promo.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setData((current) => current.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!editingPromo) return;

    setData((current) =>
      current.map((item) =>
        item.id === editingPromo.id
          ? {
              ...item,
              price: Number(formState.price),
              description: formState.description,
              status: formState.status,
            }
          : item,
      ),
    );

    setModalOpen(false);
    setEditingPromo(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPromo(null);
  };

  const rows = table.getRowModel().rows;

  return (
    <div>
      <Breadcrumb title="Promo" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <p className="text-gray-600 mb-6">Monitoring Promo dan Diskon</p>

        <div className="flex items-center gap-2 my-6 bg-white p-3 rounded-lg border border-gray-200">
          <Search size={20} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search promos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 min-w-0 outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full min-w-[760px]">
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
              const promo = row.original;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-gray-400">
                      #{promo.id}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        promo.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {promo.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Product</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {promo.productName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price</p>
                    <p className="text-sm text-gray-700">
                      {formatCurrency(promo.price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Description</p>
                    <p className="text-sm text-gray-700">{promo.description}</p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
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

      {modalOpen && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Edit Promo
                </p>
                <p className="text-sm text-gray-500">
                  {editingPromo.productName}
                </p>
              </div>
              <button
                onClick={closeModal}
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
                  value={formState.price}
                  onChange={(e) =>
                    setFormState((current) => ({
                      ...current,
                      price: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Deskripsi
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
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
                  value={formState.status}
                  onChange={(e) =>
                    setFormState((current) => ({
                      ...current,
                      status: e.target.value as Promo["status"],
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
                onClick={closeModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
