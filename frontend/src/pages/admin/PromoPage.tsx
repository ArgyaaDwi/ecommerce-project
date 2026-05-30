"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
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
  Search,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcrumb";
import PromoStatusModal from "@/components/fragment/PromoStatusModal";
import { formatFullDateTime } from "@/helper/formatDate";
import { API_URL, formatCurrency } from "@/lib/utils";
import type { ApiResponse, PromotionApiItem } from "@/types/interface";

const columnHelper = createColumnHelper<PromotionApiItem>();

export default function PromoPage() {
  const [data, setData] = useState<PromotionApiItem[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [statusModalPromotion, setStatusModalPromotion] =
    useState<PromotionApiItem | null>(null);

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Promo", url: "/admin/promo" },
  ];

  const fetchPromotions = useCallback(async () => {
    setIsLoadingData(true);

    try {
      const response = await fetch(`${API_URL}/admin/promotion/list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch promotions: ${response.status}`);
      }

      const json = (await response.json()) as
        | ApiResponse<PromotionApiItem[]>
        | PromotionApiItem[];
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : [];

      setData(list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleDelete = useCallback((id: number) => {
    console.log(`Delete promo ID: ${id}`);
  }, []);

  const openStatusModal = useCallback((promotion: PromotionApiItem) => {
    setStatusModalPromotion(promotion);
  }, []);

  const closeStatusModal = () => {
    setStatusModalPromotion(null);
  };

  const handleStatusSuccess = (promotionId: number, isActive: boolean) => {
    setData((current) =>
      current.map((item) =>
        item.id === promotionId ? { ...item, isActive } : item,
      ),
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No.",
        size: 60,
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor((row) => row.product.name, {
        id: "product",
        header: "Product",
      }),
      columnHelper.accessor("name", {
        header: "Promotion Name",
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("description", { header: "Description" }),
      columnHelper.accessor("isActive", {
        header: "Status",
        cell: (info) => {
          const isActive = info.getValue();
          return (
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => formatFullDateTime(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const promo = info.row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => openStatusModal(promo)}
                className={`inline-flex items-center gap-1 rounded px-3 py-1 text-sm font-medium transition ${
                  promo.isActive
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                <RefreshCcw size={14} />
                <span>{promo.isActive ? "Deactivate" : "Activate"}</span>
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          );
        },
      }),
    ],
    [handleDelete, openStatusModal],
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

  const rows = table.getRowModel().rows;

  return (
    <div>
      <Breadcrumb title="Promo" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <p className="mb-6 text-gray-600">Monitoring Promo dan Diskon</p>

        <div className="my-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
          <Search size={20} className="shrink-0 text-gray-500" />
          <input
            type="text"
            placeholder="Search promos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-0 flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
          <table className="w-full" style={{ minWidth: 920 }}>
            <thead className="border-b border-gray-200 bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="cursor-pointer select-none px-6 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100"
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
              {isLoadingData ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    Tunggu ...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
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
                    className="border-b border-gray-200 transition hover:bg-gray-50"
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

        <div className="flex flex-col gap-3 md:hidden">
          {isLoadingData ? (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              Loading promos...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              No data found.
            </div>
          ) : (
            rows.map((row) => {
              const promo = row.original;

              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-gray-400">
                      #{promo.id}
                    </span>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        promo.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Product</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {promo.product.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">
                      Promotion Name
                    </p>
                    <p className="text-sm text-gray-700">{promo.name}</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Price</p>
                    <p className="text-sm text-gray-700">
                      {formatCurrency(promo.price)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Description</p>
                    <p className="text-sm text-gray-700">{promo.description}</p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => openStatusModal(promo)}
                      className={`flex-1 inline-flex items-center justify-center gap-1 rounded px-3 py-2 text-sm font-medium transition ${
                        promo.isActive
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      <RefreshCcw size={14} />
                      <span>{promo.isActive ? "Deactivate" : "Activate"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
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

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm text-gray-600">
              Show{" "}
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="mx-2 inline-block rounded border border-gray-300 px-2 py-1 text-sm"
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

          <div className="flex w-full gap-2 md:w-auto">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex-1 rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex-1 rounded bg-gray-100 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
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

      <PromoStatusModal
        key={statusModalPromotion?.id ?? "status-closed"}
        isOpen={statusModalPromotion !== null}
        promotion={statusModalPromotion}
        onClose={closeStatusModal}
        onSuccess={handleStatusSuccess}
      />
    </div>
  );
}
