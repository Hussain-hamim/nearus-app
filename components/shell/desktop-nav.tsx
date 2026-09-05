"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { UnreadBadge } from "@/components/shell/unread-badge";
import { Input } from "@/components/ui/input";
import { formatUnreadBadge } from "@/lib/format-unread-badge";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home" },
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
  const chatBadge = formatUnreadBadge(unreadChat);

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-white/90 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-6 px-6">
        <Link href="/home" aria-label="NearTask home">
          <Logo />
        </Link>
        <form
          className="relative max-w-md flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            router.push(q ? `/home?q=${encodeURIComponent(String(q))}` : "/home");
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
              link.href === "/home"
                ? pathname === "/home"
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
                aria-label={
                  link.href === "/chat" && chatBadge
                    ? `Chat, ${unreadChat} unread`
                    : undefined
                }
              >
                {link.label}
                {link.href === "/chat" && chatBadge ? (
                  <UnreadBadge count={unreadChat} cap={4} />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            aria-label={
              unreadNotifications > 0
                ? `Notifications, ${unreadNotifications} unread`
                : "Notifications"
            }
            className="relative flex size-10 items-center justify-center"
          >
            <Bell className="size-5 text-muted-foreground" />
            <UnreadBadge count={unreadNotifications} cap={9} />
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
