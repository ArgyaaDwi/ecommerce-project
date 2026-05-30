"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Breadcrumb from "@/components/fragment/Breadcrumb";
import CategoryModal from "@/components/fragment/CategoryModal";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, ProductCategory } from "@/types/interface";

const columnHelper = createColumnHelper<ProductCategory>();

export default function CategoryPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Kategori Produk", url: "/admin/category" },
  ];

  const fetchCategories = useCallback(async () => {
    setIsLoadingData(true);

    try {
      const response = await fetch(`${API_URL}/admin/product/category/list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const json = (await response.json()) as
        | ApiResponse<ProductCategory[]>
        | ProductCategory[];
      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : [];

      setCategories(list);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: ProductCategory) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete category ID: ${id}`);
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(false);
  };

  const handleModalSuccess = () => {
    fetchCategories();
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No.",
        size: 60,
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(info.row.original)}
              className="inline-flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
            >
              <Pencil size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(info.row.original.id)}
              className="inline-flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        ),
      }),
    ],
    [handleEdit],
  );

  const table = useReactTable({
    data: categories,
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
      <Breadcrumb title="Kategori Produk" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-gray-600">Monitoring Kategori Produk</p>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
            <Search size={20} className="shrink-0 text-gray-500" />
            <input
              type="text"
              placeholder="Search categories..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="min-w-0 flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded bg-primaryKu px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
          <table className="w-full" style={{ minWidth: 640 }}>
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
              Loading categories...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              No data found.
            </div>
          ) : (
            rows.map((row) => {
              const category = row.original;

              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      #{category.id}
                    </span>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="whitespace-nowrap text-sm text-gray-600">
              Show{" "}
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="mx-1 rounded border border-gray-300 px-2 py-1 text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </span>
            <span className="whitespace-nowrap text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex-1 rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex-1 rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {rows.length > 0 ? 1 : 0} to {rows.length} of{" "}
          {categories.length} results
        </div>
      </div>

      <CategoryModal
        key={`${modalMode}-${selectedCategory?.id ?? "new"}`}
        isOpen={isModalOpen}
        mode={modalMode}
        category={selectedCategory}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
