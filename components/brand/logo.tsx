import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Logo({
  className = "size-9",
  markOnly = false,
  inverted = false,
  nameClassName,
}: {
  className?: string;
  markOnly?: boolean;
  inverted?: boolean;
  nameClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 40 40"
        className={className}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="12" fill="#A5B4FC" />
        <path
          d="M20 8.5c-5.2 0-9.4 3.9-9.4 9.3 0 6.9 8.2 13.2 8.9 13.7a.9.9 0 0 0 1 0c.7-.5 8.9-6.8 8.9-13.7 0-5.4-4.2-9.3-9.4-9.3Zm0 12.4a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Z"
          fill="#111827"
        />
      </svg>
      {!markOnly ? (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            inverted ? "text-white" : "text-foreground",
            nameClassName
          )}
        >
          {brand.name}
        </span>
      ) : null}
    </span>
  );
}
