"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, PenSquare, Search } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { WavyHeader } from "@/components/shell/wavy-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { formatShortTime, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type Row = {
  id: string;
  task_id: string;
  requester_id: string;
  helper_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  task: { title: string } | null;
  other: { display_name: string; avatar_url: string | null } | null;
  unread: number;
};

export default function ChatListPage() {
  const { data: me } = useUser();
  const [q, setQ] = useState("");

  const list = useQuery({
    queryKey: ["conversations", me?.user.id],
    enabled: Boolean(me?.user.id),
    queryFn: async () => {
      const supabase = createClient();
      const uid = me!.user.id;
      const { data, error } = await supabase
        .from("conversations")
        .select("id, task_id, requester_id, helper_id, last_message_at, last_message_preview")
        .or(`requester_id.eq.${uid},helper_id.eq.${uid}`)
        .order("last_message_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      const rows = data ?? [];
      const otherIds = rows.map((c) => (c.requester_id === uid ? c.helper_id : c.requester_id));
      const taskIds = rows.map((c) => c.task_id);
      const [{ data: people }, { data: tasks }, { data: unreadMsgs }] = await Promise.all([
        otherIds.length
          ? supabase.from("profiles").select("id, display_name, avatar_url").in("id", otherIds)
          : Promise.resolve({ data: [] }),
        taskIds.length
          ? supabase.from("tasks").select("id, title").in("id", taskIds)
          : Promise.resolve({ data: [] }),
        supabase
          .from("messages")
          .select("conversation_id")
          .is("read_at", null)
          .neq("sender_id", uid),
      ]);
      const unread = new Map<string, number>();
      for (const m of unreadMsgs ?? []) {
        unread.set(m.conversation_id, (unread.get(m.conversation_id) ?? 0) + 1);
      }
      return rows.map((c) => {
        const otherId = c.requester_id === uid ? c.helper_id : c.requester_id;
        return {
          ...c,
          task: (tasks ?? []).find((t) => t.id === c.task_id) ?? null,
          other: (people ?? []).find((p) => p.id === otherId) ?? null,
          unread: unread.get(c.id) ?? 0,
        } as Row;
      });
    },
  });

  const filtered = (list.data ?? []).filter((row) => {
    if (!q.trim()) return true;
    const hay = `${row.other?.display_name ?? ""} ${row.task?.title ?? ""} ${row.last_message_preview ?? ""}`;
    return hay.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="pb-dock md:pb-10">
      <WavyHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Chat</h1>
          <Link href="/" aria-label="Browse tasks">
            <PenSquare className="size-5" />
          </Link>
        </div>
      </WavyHeader>
      <div className="px-5 md:px-0">
        <div className="relative -mt-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search messages…"
            className="h-12 rounded-full bg-white pl-11"
          />
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<MessageCircle className="size-8" />}
            title="No conversations yet"
            description="Chat opens after you select a helper."
            action={
              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground"
              >
                Browse Tasks
              </Link>
            }
          />
        ) : (
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-white md:mt-6">
            {filtered.map((row) => (
              <Link
                key={row.id}
                href={`/chat/${row.id}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <Avatar className="size-12">
                  <AvatarImage src={row.other?.avatar_url ?? undefined} />
                  <AvatarFallback>{initials(row.other?.display_name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">{row.other?.display_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {row.last_message_at ? formatShortTime(row.last_message_at) : ""}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {row.last_message_preview ?? "No messages yet"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{row.task?.title}</p>
                </div>
                {row.unread > 0 ? (
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
