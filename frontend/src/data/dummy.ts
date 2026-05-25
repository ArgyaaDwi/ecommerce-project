export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  createdAt: string;
}

export interface Promo {
  id: number;
  productName: string;
  price: number;
  description: string;
  status: "active" | "inactive";
}

export const dummyCategories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic products and gadgets",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Clothing",
    description: "Fashion and apparel",
    createdAt: "2024-01-16",
  },
  {
    id: 3,
    name: "Books",
    description: "Educational and recreational books",
    createdAt: "2024-01-17",
  },
  {
    id: 4,
    name: "Home & Kitchen",
    description: "Home appliances and kitchenware",
    createdAt: "2024-01-18",
  },
  {
    id: 5,
    name: "Sports",
    description: "Sports equipment and accessories",
    createdAt: "2024-01-19",
  },
  {
    id: 6,
    name: "Beauty",
    description: "Beauty and personal care products",
    createdAt: "2024-01-20",
  },
  {
    id: 7,
    name: "Toys",
    description: "Toys and games for all ages",
    createdAt: "2024-01-21",
  },
  {
    id: 8,
    name: "Furniture",
    description: "Furniture and home decor",
    createdAt: "2024-01-22",
  },
];

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15",
    category: "Electronics",
    price: 18999000,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Adidas Running Shoes",
    category: "Sports",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    name: "Office Chair",
    category: "Furniture",
    price: 2200000,
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    name: "Skin Care Set",
    category: "Beauty",
    price: 350000,
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    name: "Novel Bestseller",
    category: "Books",
    price: 125000,
    createdAt: "2024-01-14",
  },
];

export const dummyPromos: Promo[] = [
  {
    id: 1,
    productName: "iPhone 15",
    price: 17999000,
    description: "Promo launch khusus minggu ini",
    status: "active",
  },
  {
    id: 2,
    productName: "Adidas Running Shoes",
    price: 1299000,
    description: "Diskon untuk kategori sports",
    status: "inactive",
  },
  {
    id: 3,
    productName: "Office Chair",
    price: 1990000,
    description: "Potongan harga untuk stok terbatas",
    status: "active",
  },
  {
    id: 4,
    productName: "Skin Care Set",
    price: 299000,
    description: "Promo beauty bundle",
    status: "active",
  },
];

// Helpers to persist promos to localStorage so different pages can share changes during development
const PROMO_STORAGE_KEY = "promos";

export function loadPromosFromStorage(): Promo[] {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY);
    if (!raw) return [...dummyPromos];
    const parsed = JSON.parse(raw) as Promo[];
    return parsed;
  } catch (e) {
    return [...dummyPromos];
  }
}

export function savePromosToStorage(promos: Promo[]) {
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promos));
  } catch (e) {
    // ignore
  }
}
