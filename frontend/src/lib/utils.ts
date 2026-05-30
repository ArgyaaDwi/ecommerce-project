import type { Product } from "@/types/interface";
export const formatCurrency = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export const discount = (orig: number, price: number) =>
  Math.round(((orig - price) / orig) * 100);

export const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL;

export const getProductCategoryName = (category: Product["category"]) =>
  typeof category === "string" ? category : category.name;
