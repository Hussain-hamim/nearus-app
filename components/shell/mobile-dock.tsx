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
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/me", label: "Me", icon: User },
];

export function MobileDock({ unreadChat = 0 }: { unreadChat?: number }) {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pt-8 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] md:hidden"
      aria-label="Main"
    >
      <div className="pointer-events-auto relative mx-auto flex max-w-md items-center justify-between overflow-visible rounded-full border border-border bg-white px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {items.slice(0, 2).map((item) => (
          <DockItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            pathname={pathname}
            unreadChat={unreadChat}
          />
        ))}

        <span className="w-14 shrink-0" aria-hidden />

        {items.slice(2).map((item) => (
          <DockItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            pathname={pathname}
            unreadChat={unreadChat}
          />
        ))}

        <Link
          href="/post"
          aria-label="Post a task"
          className="absolute left-1/2 top-0 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(245,196,0,0.55)] ring-4 ring-white"
        >
          <Plus className="size-7 stroke-[2.5]" />
        </Link>
      </div>
    </nav>
  );
}

function DockItem({
  href,
  label,
  icon: Icon,
  pathname,
  unreadChat,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  pathname: string;
  unreadChat: number;
}) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className="relative flex min-w-14 flex-col items-center gap-0.5 px-2 py-1 text-[11px] font-medium"
    >
      <span className="relative">
        <Icon
          className={cn(
            "size-5",
            active ? "text-primary" : "text-muted-foreground"
          )}
        />
        {href === "/chat" && unreadChat > 0 ? (
          <span className="absolute -right-1 -top-0.5 size-2 rounded-full bg-primary" />
        ) : null}
      </span>
      <span className={cn(active ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      {active ? (
        <span className="mt-0.5 size-1 rounded-full bg-primary" />
      ) : (
        <span className="mt-0.5 size-1" />
      )}
    </Link>
  );
}
