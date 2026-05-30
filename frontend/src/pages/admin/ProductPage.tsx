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
import ProductModal from "@/components/fragment/ProductModal";
import PromoModal from "@/components/fragment/PromoModal";
import type { Product } from "@/types/interface";
import { formatFullDateTime } from "@/helper/formatDate";
import { API_URL, formatCurrency, getProductCategoryName } from "@/lib/utils";
import type {
  ApiResponse,
  ProductCategory,
  PromotionApiItem,
} from "@/types/interface";

const columnHelper = createColumnHelper<Product>();

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [promoProductIds, setPromoProductIds] = useState<number[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [promoProduct, setPromoProduct] = useState<Product | null>(null);

  const breadcrumbItems = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Produk", url: "/admin/product" },
  ];

  const fetchData = useCallback(async () => {
    setIsLoadingData(true);

    try {
      const [productRes, promoRes] = await Promise.all([
        fetch(`${API_URL}/admin/product/list`),
        fetch(`${API_URL}/admin/promotion/list`),
      ]);

      if (!productRes.ok) {
        throw new Error(`Failed to fetch products: ${productRes.status}`);
      }

      if (!promoRes.ok) {
        throw new Error(`Failed to fetch promotions: ${promoRes.status}`);
      }

      const productResponse = (await productRes.json()) as
        | ApiResponse<Product[]>
        | Product[];
      const promoResponse = (await promoRes.json()) as
        | ApiResponse<PromotionApiItem[]>
        | PromotionApiItem[];

      const productList = Array.isArray(productResponse)
        ? productResponse
        : Array.isArray(productResponse?.data)
          ? productResponse.data
          : [];

      const promoList = Array.isArray(promoResponse)
        ? promoResponse
        : Array.isArray(promoResponse?.data)
          ? promoResponse.data
          : [];

      setProducts(productList);
      setPromoProductIds(promoList.map((promo) => promo.product.id));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [fetchCategories, fetchData]);

  const handleEdit = useCallback(
    (id: number) => {
      const product = products.find((item) => item.id === id) ?? null;

      setSelectedProduct(product);
      setModalMode("edit");
      setIsModalOpen(true);
    },
    [products],
  );

  const handleDelete = (id: number) => {
    console.log(`Delete product ID: ${id}`);
  };

  const handleCreatePromoClick = useCallback((product: Product) => {
    setPromoProduct(product);
  }, []);

  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleProductModalSuccess = () => {
    fetchData();
    fetchCategories();
  };

  const handlePromoClose = () => {
    setPromoProduct(null);
  };

  const handlePromoSuccess = () => {
    if (!promoProduct) return;

    setPromoProductIds((current) =>
      current.includes(promoProduct.id)
        ? current
        : [...current, promoProduct.id],
    );
  };

  const promoProductIdSet = useMemo(
    () => new Set(promoProductIds),
    [promoProductIds],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "no",
        header: "No.",
        size: 60,
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor((row) => getProductCategoryName(row.category), {
        id: "category",
        header: "Category",
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => formatCurrency(info.getValue()),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => formatFullDateTime(info.getValue()),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const product = info.row.original;
          const hasPromo = promoProductIdSet.has(product.id);

          return (
            <div className="flex gap-2">
              {!hasPromo && (
                <button
                  onClick={() => handleCreatePromoClick(product)}
                  className="inline-flex items-center gap-1 rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700 transition hover:bg-green-200"
                >
                  <Plus size={14} />
                  <span>Promo</span>
                </button>
              )}
              <button
                onClick={() => handleEdit(product.id)}
                className="inline-flex items-center gap-1 rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
              >
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(product.id)}
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
    [handleCreatePromoClick, handleEdit, promoProductIdSet],
  );

  const table = useReactTable({
    data: products,
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
      <Breadcrumb title="Produk" breadcrumbItems={breadcrumbItems} />

      <div className="mb-6">
        <p className="mb-6 text-gray-600">Monitoring Produk</p>

        <div className="my-6 flex items-center gap-3">
          <div className="flex flex-1    items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
            <Search size={20} className="shrink-0 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
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
            <span>Add Product</span>
          </button>
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white md:block">
          <table className="w-full" style={{ minWidth: 860 }}>
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
              Loading products...
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-400">
              No data found.
            </div>
          ) : (
            rows.map((row) => {
              const product = row.original;
              const hasPromo = promoProductIdSet.has(product.id);

              return (
                <div
                  key={row.id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">
                      #{product.id}
                    </span>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Name</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {product.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Category</p>
                    <p className="text-sm text-gray-700">
                      {getProductCategoryName(product.category)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Price</p>
                    <p className="text-sm text-gray-700">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Stock</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-gray-400">Created At</p>
                    <p className="text-sm text-gray-700">
                      {formatFullDateTime(product.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-1">
                    {!hasPromo && (
                      <button
                        onClick={() => handleCreatePromoClick(product)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-green-100 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-200"
                      >
                        <Plus size={14} />
                        <span>Promo</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-200"
                    >
                      <Pencil size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
          Showing {rows.length > 0 ? 1 : 0} to {rows.length} of{" "}
          {products.length} results
        </div>
      </div>

      <PromoModal
        key={promoProduct?.id ?? "promo-closed"}
        isOpen={promoProduct !== null}
        product={promoProduct}
        onClose={handlePromoClose}
        onSuccess={handlePromoSuccess}
      />

      <ProductModal
        key={`${modalMode}-${selectedProduct?.id ?? "new"}`}
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        categories={categories}
        onClose={closeProductModal}
        onSuccess={handleProductModalSuccess}
      />
    </div>
  );
}
