"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn("inline-flex h-9 w-[6.5rem] items-center rounded-full bg-muted p-0.5", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn("inline-flex items-center rounded-full bg-muted p-0.5", className)}
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors",
              active && "bg-card text-foreground shadow-sm ring-1 ring-border"
            )}
          >
            <Icon className="size-3.5" />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
