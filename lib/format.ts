import { format, formatDistanceToNowStrict, isToday, isTomorrow } from "date-fns";
import { brand } from "@/lib/brand";

export function formatAfn(amount: number | string) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return `${brand.currencySymbol}0`;
  return `${brand.currencySymbol}${Math.round(value).toLocaleString("en-US")}`;
}

export function formatKm(km: number | null | undefined) {
  if (km == null || Number.isNaN(km)) return "Nearby";
  if (km < 0.1) return "Nearby";
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export function formatTaskWhen(iso: string | null | undefined) {
  if (!iso) return "Flexible";
  const date = new Date(iso);
  if (isToday(date)) return `Today · ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow · ${format(date, "h:mm a")}`;
  return format(date, "d MMM · h:mm a");
}

export function formatShortTime(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) return format(date, "h:mm a");
  return formatDistanceToNowStrict(date, { addSuffix: false });
}

export function initials(name: string | null | undefined) {
  if (!name) return "NT";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "NT";
}
