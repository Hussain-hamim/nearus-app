import { formatUnreadBadge } from "@/lib/format-unread-badge";
import { cn } from "@/lib/utils";

export function UnreadBadge({
  count,
  cap = 4,
  className,
}: {
  count: number;
  cap?: number;
  className?: string;
}) {
  const label = formatUnreadBadge(count, cap);
  if (!label) return null;

  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white",
        className
      )}
    >
      {label}
    </span>
  );
}
