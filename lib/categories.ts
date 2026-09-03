import {
  GraduationCap,
  KeyRound,
  Laptop,
  MoreHorizontal,
  Shirt,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const TASK_CATEGORIES = [
  "services",
  "rentals",
  "study",
  "fashion",
  "food",
  "tech",
  "errands",
  "other",
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];

export const CATEGORY_META: Record<
  TaskCategory,
  { label: string; icon: LucideIcon }
> = {
  services: { label: "Services", icon: Wrench },
  rentals: { label: "Rentals", icon: KeyRound },
  study: { label: "Study", icon: GraduationCap },
  fashion: { label: "Fashion", icon: Shirt },
  food: { label: "Food", icon: UtensilsCrossed },
  tech: { label: "Tech", icon: Laptop },
  errands: { label: "Errands", icon: ShoppingBag },
  other: { label: "Other", icon: MoreHorizontal },
};

export const VISIBILITY_RADII_KM = [2, 5, 10] as const;
export type VisibilityRadiusKm = (typeof VISIBILITY_RADII_KM)[number];

export const AFGHAN_CITIES = [
  "Kabul",
  "Herat",
  "Mazar-i-Sharif",
  "Kandahar",
  "Jalalabad",
] as const;
