export type ProductCategory = {
  id: number;
  name: string;
};

export type Product = {
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
};
