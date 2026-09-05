"use client";

import { DesktopNav } from "@/components/shell/desktop-nav";
import { MobileDock } from "@/components/shell/mobile-dock";
import { useUnreadCounts } from "@/hooks/use-unread-counts";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = useUnreadCounts();

  return (
    <div className="min-h-dvh bg-background">
      <DesktopNav
        unreadChat={data?.messages}
        unreadNotifications={data?.notifications}
      />
      <div className="mx-auto w-full max-w-[1120px] md:px-6">{children}</div>
      <MobileDock unreadChat={data?.messages} />
    </div>
  );
}
