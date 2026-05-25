import { useState, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";
import type { Category } from "@/data/dummy";
import { dummyCategories } from "@/data/dummy";
import Breadcrumb from "@/components/fragment/Breadcrumb";

const columnHelper = createColumnHelper<Category>();

export default function CategoryPage() {
  const [data] = useState(() => [...dummyCategories]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Kategori Produk", url: "/admin/category" },
  ];

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        size: 60,
      }),
      columnHelper.accessor("name", {
        header: "Name",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
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
    console.log(`Edit category ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete category ID: ${id}`);
  };

  const rows = table.getRowModel().rows;

  return (
    <div>
      <Breadcrumb title="Kategori Produk" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <p className="text-gray-600 mb-6">Monitoring Kategori Produk</p>

        <div className="flex items-center gap-2 my-6 bg-white p-3 rounded-lg border border-gray-200">
          <Search size={20} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search categories..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 min-w-0 outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full min-w-[640px]">
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
              const id = row.original.id;
              const name = row.original.name;
              const description = row.original.description;
              const createdAt = row.original.createdAt;

              return (
                <div
                  key={row.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      #{id}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {name}
                    </p>
                  </div>
                  {description && (
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {description}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Created At</p>
                    <p className="text-sm text-gray-700">{createdAt}</p>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Show{" "}
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="mx-1 px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              entries
            </span>
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
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
    </div>
  );
}
