export interface ProductCategory {
  id: number;
  name: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  originalPrice: number | null;
  image?: string;
  imageUrl?: string;
  badge: string | null;
  rating: number;
  sold: number;
  category: string | ProductCategory;
  createdAt?: string;
  isSubscribedPromotion?: boolean;
}

export interface UserSessionData {
  id: number;
  name: string;
  sessionKey: string;
  productPreferenceType: string;
  createdAt: string;
}

export interface SessionResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    sessionKey: string;
    productPreferenceType: string;
    createdAt: string;
  };
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type ProductApiItem = Omit<Product, "image" | "category"> & {
  imageUrl: string;
  category: ProductCategory;
};

export type PromotionApiItem = {
  id: number;
  product: ProductApiItem;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  createdAt: string;
};

export type CategoryApiItem = ProductCategory;

export type CategoryFilterItem = {
  id: number;
  name: string;
  count: number;
};

export interface PromotionPayload {
  type: string;
  promotionId: number;
  productId: number;
  promotionName: string;
  promotionPrice: number;
  description: string;
  createdAt: string;
  productName?: string;
}