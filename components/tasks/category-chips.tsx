"use client";

import { CATEGORY_META, TASK_CATEGORIES, type TaskCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryChips({
  value,
  onChange,
}: {
  value: "all" | TaskCategory;
  onChange: (value: "all" | TaskCategory) => void;
}) {
  const items: Array<"all" | TaskCategory> = ["all", ...TASK_CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const active = value === item;
        const label = item === "all" ? "All" : CATEGORY_META[item].label;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground ring-1 ring-border"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
