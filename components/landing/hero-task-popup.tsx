import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { brand } from "@/lib/brand";

export function HeroTaskPopup() {
  return (
    <article
      className="hero-card-img hero-card-pop rounded-[1rem] bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.2)] sm:rounded-[1.35rem] sm:p-3.5 sm:shadow-[0_16px_36px_rgba(0,0,0,0.2)]"
      aria-hidden
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-white sm:size-9 sm:text-[10px]">
            AK
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold leading-tight sm:text-sm">
              Ahmad K.
            </p>
            <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-muted-foreground sm:gap-1 sm:text-[11px]">
              <MapPin className="size-2.5 fill-primary text-foreground sm:size-3" />
              2.3 km away
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-black text-primary-foreground sm:px-2 sm:text-xs">
          {brand.currencySymbol}800
        </span>
      </div>

      <h3 className="mt-2 text-[13px] font-black leading-snug tracking-tight sm:mt-3 sm:text-[17px]">
        Help me move a table
      </h3>

      <div className="mt-2 flex items-center gap-1.5 border-t border-border pt-2 sm:mt-3 sm:gap-2 sm:pt-2.5">
        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium sm:gap-1 sm:text-[11px]">
          <CalendarDays className="size-2.5 text-primary sm:size-3" />
          Today
        </span>
        <span className="h-2.5 w-px bg-border sm:h-3" />
        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium sm:gap-1 sm:text-[11px]">
          <Clock className="size-2.5 text-primary sm:size-3" />
          6:00 PM
        </span>
        <span className="ml-auto flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground sm:size-8">
          <ArrowRight className="size-3 sm:size-3.5" />
        </span>
      </div>
    </article>
  );
}
