"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DesktopNav } from "@/components/shell/desktop-nav";
import { MobileDock } from "@/components/shell/mobile-dock";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["unread-counts"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("unread_counts");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return {
        messages: Number(row?.messages ?? 0),
        notifications: Number(row?.notifications ?? 0),
      };
    },
    refetchInterval: 20_000,
  });

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
