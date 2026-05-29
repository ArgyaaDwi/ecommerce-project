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
    Electronics: Laptop,
    Fashion: Shirt,
    "Food and Drink": UtensilsCrossed,
    Beauty: Sparkles,
    Sports: Dumbbell,
    "Home & Garden": Home,
    Automotive: Car,
    Books: BookOpen,
  };
  return iconMap[categoryName] || Package;
};
