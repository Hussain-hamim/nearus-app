import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORY_META, type TaskCategory } from "@/lib/categories";
import { formatAfn, formatKm, formatTaskWhen, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export type TaskCardData = {
  id: string;
  title: string;
  category?: TaskCategory | string;
  budget_amount: number | string;
  scheduled_at?: string | null;
  distance_km?: number | null;
  area?: string;
  offer_count?: number | null;
  requester_display_name?: string | null;
  requester_avatar_url?: string | null;
};

export function TaskCard({
  task,
  href,
  className,
}: {
  task: TaskCardData;
  href?: string;
  className?: string;
}) {
  const category = task.category as TaskCategory | undefined;
  const label = category ? CATEGORY_META[category]?.label : undefined;
  const content = (
    <article
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-card p-3",
        className
      )}
    >
      <Avatar className="size-12">
        <AvatarImage src={task.requester_avatar_url ?? undefined} alt="" />
        <AvatarFallback>{initials(task.requester_display_name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">
              {task.requester_display_name ?? "Neighbor"}
              {task.distance_km != null ? ` · ${formatKm(task.distance_km)}` : task.area ? ` · ${task.area}` : ""}
            </p>
            <h3 className="truncate font-semibold leading-snug">{task.title}</h3>
          </div>
          <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
            {formatAfn(task.budget_amount)}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTaskWhen(task.scheduled_at)}</span>
          {label ? (
            <span className="rounded-full bg-muted px-2 py-0.5">{label}</span>
          ) : null}
          {task.offer_count ? (
            <span>
              {task.offer_count} offer{task.offer_count === 1 ? "" : "s"}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!href) return content;
  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
