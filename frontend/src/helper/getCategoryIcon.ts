import {
  Laptop,
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Home,
  Car,
  BookOpen,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const getCategoryIcon = (categoryName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Elektronik: Laptop,
    Fashion: Shirt,
    Clothing: Shirt,
    "Makanan & Minuman": UtensilsCrossed,
    Kecantikan: Sparkles,
    Beauty: Sparkles,
    Olahraga: Dumbbell,
    Sports: Dumbbell,
    "Rumah & Taman": Home,
    "Home & Garden": Home,
    Otomotif: Car,
    Buku: BookOpen,
    Books: BookOpen,
  };
  return iconMap[categoryName] || Package;
};
