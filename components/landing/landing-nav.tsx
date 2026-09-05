"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { InstallButton } from "@/components/landing/install-button";
import { cn } from "@/lib/utils";

const SHRINK_AT = 72;
const EXPAND_AT = 24;

export function LandingNav() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setCompact((wasCompact) => {
        if (!wasCompact && y > SHRINK_AT) return true;
        if (wasCompact && y < EXPAND_AT) return false;
        return wasCompact;
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-safe">
      <div
        className={cn(
          "pointer-events-auto mx-auto mt-3 flex h-12 items-center justify-between rounded-full bg-white/92 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-black/5 backdrop-blur transition-[max-width,padding,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:mt-5 md:h-14",
          compact
            ? "w-[min(92vw,100%)] max-w-[240px] gap-2 px-1.5 pl-2.5 md:max-w-[260px]"
            : "w-[min(92vw,100%)] max-w-[420px] px-2 pl-3 md:max-w-[520px]"
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="NearTask home"
        >
          <Logo
            className={compact ? "size-7 md:size-8" : "size-8 md:size-9"}
            nameClassName={compact ? "text-base" : undefined}
          />
        </Link>
        <InstallButton
          className={
            compact
              ? "h-8 min-h-8 shrink-0 px-3 text-xs md:h-9 md:min-h-9 md:px-3.5 md:text-sm"
              : "h-9 min-h-9 shrink-0 px-3.5 md:h-10 md:min-h-10 md:px-4"
          }
        />
      </div>
    </header>
  );
}
