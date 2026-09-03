"use client";

import { use, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { WavyHeader } from "@/components/shell/wavy-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { formatShortTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types/database";

export default function ChatThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: me } = useUser();
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  const meta = useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("conversations")
        .select("id, task_id, requester_id, helper_id")
        .eq("id", id)
        .single();
      if (error) throw error;
      const otherId =
        data.requester_id === me?.user.id ? data.helper_id : data.requester_id;
      const [{ data: task }, { data: other }] = await Promise.all([
        supabase.from("tasks").select("title").eq("id", data.task_id).single(),
        supabase.from("profiles").select("display_name").eq("id", otherId).single(),
      ]);
      return { ...data, taskTitle: task?.title, otherName: other?.display_name };
    },
    enabled: Boolean(me?.user.id),
  });

  const messages = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", id)
        .is("read_at", null)
        .neq("sender_id", me!.user.id);
      return data as Message[];
    },
    enabled: Boolean(me?.user.id),
  });

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        () => {
          void qc.invalidateQueries({ queryKey: ["messages", id] });
          void qc.invalidateQueries({ queryKey: ["unread-counts"] });
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [id, qc]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.data?.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !me) return;
    const supabase = createClient();
    const text = body.trim();
    setBody("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: me.user.id,
      body: text,
    });
    if (error) setBody(text);
    void qc.invalidateQueries({ queryKey: ["messages", id] });
  }

  return (
    <div className="flex min-h-dvh flex-col pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-6">
      <WavyHeader>
        <p className="text-xs font-medium uppercase tracking-wide">
          {meta.data?.taskTitle ?? "Task"}
        </p>
        <h1 className="text-xl font-semibold">{meta.data?.otherName ?? "Chat"}</h1>
      </WavyHeader>
      <div className="flex-1 space-y-2 px-4 py-4 md:px-0">
        {messages.data?.map((msg) => {
          const mine = msg.sender_id === me?.user.id;
          return (
            <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-white ring-1 ring-border"
                }`}
              >
                <p>{msg.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "opacity-70" : "text-muted-foreground"}`}>
                  {formatShortTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>
      <form
        onSubmit={(e) => void send(e)}
        className="sticky bottom-20 z-20 flex gap-2 bg-background px-4 py-2 md:bottom-0 md:px-0"
      >
        <Input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Message…"
          className="h-12 flex-1 rounded-full bg-white"
        />
        <Button size="icon-lg" className="rounded-full" type="submit" aria-label="Send">
          <Send />
        </Button>
      </form>
    </div>
  );
}
