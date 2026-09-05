"use client";

import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/use-pwa-install";
import { cn } from "@/lib/utils";

export function InstallButton({
  className,
  label = "Install",
}: {
  className?: string;
  label?: string;
}) {
  const { install, installed } = usePwaInstall();

  return (
    <button
      type="button"
      onClick={() => void install()}
      disabled={installed}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70",
        className
      )}
    >
      <Download className="size-4" />
      {installed ? "Installed" : label}
    </button>
  );
}
