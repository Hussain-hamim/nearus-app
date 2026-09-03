"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListTodo,
  MessageCircle,
  Plus,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/activity", label: "Activity", icon: ListTodo },
  { href: "/post", label: "Post", icon: Plus, fab: true },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/me", label: "Me", icon: User },
];

export function MobileDock({ unreadChat = 0 }: { unreadChat?: number }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-md items-end justify-between rounded-full border border-border bg-white px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          if (item.fab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Post a task"
                className="-mt-7 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(245,196,0,0.55)] ring-4 ring-white"
              >
                <Plus className="size-7 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-w-[3.5rem] flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium"
            >
              <span className="relative">
                <Icon
                  className={cn(
                    "size-5",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {item.href === "/chat" && unreadChat > 0 ? (
                  <span className="absolute -right-1 -top-0.5 size-2 rounded-full bg-primary" />
                ) : null}
              </span>
              <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
              {active ? (
                <span className="mt-0.5 size-1 rounded-full bg-primary" />
              ) : (
                <span className="mt-0.5 size-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
