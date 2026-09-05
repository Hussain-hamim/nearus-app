"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { WavyHeader } from "@/components/shell/wavy-header";
import { useUser } from "@/hooks/use-user";
import { formatShortTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/types/database";

export default function NotificationsPage() {
  const { data: me } = useUser();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["notifications", me?.user.id],
    enabled: Boolean(me?.user.id),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", me!.user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Notification[];
    },
  });

  async function markAll() {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", me!.user.id)
      .is("read_at", null);
    void qc.invalidateQueries({ queryKey: ["notifications"] });
    void qc.invalidateQueries({ queryKey: ["unread-counts"] });
  }

  return (
    <div className="pb-dock md:pb-10">
      <WavyHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <button type="button" className="text-sm font-medium" onClick={() => void markAll()}>
            Mark all read
          </button>
        </div>
      </WavyHeader>
      <div className="px-5 md:px-0">
        {list.data?.length === 0 ? (
          <p className="flex flex-col items-center py-16 text-sm text-muted-foreground">
            <Bell className="mb-2 size-8 text-primary" />
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-2">
            {list.data?.map((item) => {
              const data = item.data as { task_id?: string; conversation_id?: string };
              const href = data.conversation_id
                ? `/chat/${data.conversation_id}`
                : data.task_id
                  ? `/tasks/${data.task_id}`
                  : "/activity";
              return (
                <Link
                  key={item.id}
                  href={href}
                  className={`block rounded-2xl border border-border p-4 ${
                    item.read_at ? "bg-card" : "bg-secondary"
                  }`}
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatShortTime(item.created_at)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
