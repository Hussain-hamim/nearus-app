"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/activity", label: "Activity" },
  { href: "/chat", label: "Chat" },
  { href: "/me", label: "Me" },
];

export function DesktopNav({
  unreadChat = 0,
  unreadNotifications = 0,
}: {
  unreadChat?: number;
  unreadNotifications?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-white/90 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-6 px-6">
        <Link href="/" aria-label="NearTask home">
          <Logo />
        </Link>
        <form
          className="relative max-w-md flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            router.push(q ? `/?q=${encodeURIComponent(String(q))}` : "/");
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search for tasks…"
            className="h-10 rounded-full bg-muted pl-9"
            defaultValue=""
            aria-label="Search for tasks"
          />
        </form>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium",
                  active
                    ? "bg-primary/20 text-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
                {link.href === "/chat" && unreadChat > 0 ? (
                  <span className="absolute right-1.5 top-1 size-1.5 rounded-full bg-primary" />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/notifications" aria-label="Notifications" className="relative">
            <Bell className="size-5 text-muted-foreground" />
            {unreadNotifications > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" />
            ) : null}
          </Link>
          <Link href="/chat" className="md:hidden" aria-label="Chat">
            <MessageCircle className="size-5" />
          </Link>
          <Link
            href="/post"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="size-4" />
            Post
          </Link>
        </div>
      </div>
    </header>
  );
}
