"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Plus, Star } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { WavyHeader } from "@/components/shell/wavy-header";
import { TaskCard } from "@/components/tasks/task-card";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/database";

const tabs = ["Posted", "Accepted", "Completed"] as const;

export default function ActivityPage() {
  const { data: me } = useUser();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Posted");
  const userId = me?.user.id;

  const stats = useQuery({
    queryKey: ["activity-stats", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const supabase = createClient();
      const [{ count: posted }, { count: accepted }, { count: reviews }] =
        await Promise.all([
          supabase
            .from("tasks")
            .select("id", { count: "exact", head: true })
            .eq("requester_id", userId!),
          supabase
            .from("tasks")
            .select("id", { count: "exact", head: true })
            .eq("helper_id", userId!),
          supabase
            .from("reviews")
            .select("id", { count: "exact", head: true })
            .eq("reviewee_id", userId!),
        ]);
      return {
        posted: posted ?? 0,
        accepted: accepted ?? 0,
        reviews: reviews ?? 0,
      };
    },
  });

  const list = useQuery({
    queryKey: ["activity-list", userId, tab],
    enabled: Boolean(userId),
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
      if (tab === "Posted") query = query.eq("requester_id", userId!);
      if (tab === "Accepted")
        query = query.eq("helper_id", userId!).in("status", [
          "helper_selected",
          "in_progress",
        ]);
      if (tab === "Completed")
        query = query.or(`requester_id.eq.${userId},helper_id.eq.${userId}`).eq(
          "status",
          "completed"
        );
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Task[];
    },
  });

  const emptyCopy = useMemo(() => {
    if (tab === "Posted")
      return {
        title: "No tasks posted yet",
        description: "Post a task nearby. Helpers can offer, then you pay in cash.",
      };
    if (tab === "Accepted")
      return {
        title: "No accepted tasks",
        description: "Browse nearby jobs and send an offer to start earning.",
      };
    return {
      title: "No completed tasks",
      description: "Finished jobs will show up here for reviews.",
    };
  }, [tab]);

  return (
    <div className="pb-dock md:pb-10">
      <WavyHeader>
        <h1 className="text-2xl font-semibold">My Activity</h1>
      </WavyHeader>
      <div className="-mt-2 grid grid-cols-3 gap-2 px-5 md:px-0">
        {[
          { label: "Tasks posted", value: stats.data?.posted ?? 0, icon: ClipboardList },
          { label: "Tasks accepted", value: stats.data?.accepted ?? 0, icon: Plus },
          { label: "Reviews", value: stats.data?.reviews ?? 0, icon: Star },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border bg-white p-3 text-center"
          >
            <item.icon className="mx-auto size-4 text-primary" />
            <p className="mt-1 text-lg font-semibold">{item.value}</p>
            <p className="text-[11px] text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2 px-5 md:px-0">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium",
              tab === item ? "bg-primary text-primary-foreground" : "bg-white ring-1 ring-border"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-4 px-5 md:px-0">
        {list.data && list.data.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="size-8" />}
            title={emptyCopy.title}
            description={emptyCopy.description}
            action={
              <Link
                href="/post"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground"
              >
                <Plus className="size-4" /> Post a Task
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {list.data?.map((task) => (
              <TaskCard
                key={task.id}
                href={`/tasks/${task.id}`}
                task={{
                  ...task,
                  requester_display_name: me?.profile?.display_name,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        href="/home"
        className="mx-5 mt-6 block rounded-2xl bg-secondary p-4 md:mx-0"
      >
        <p className="font-semibold">Looking to earn?</p>
        <p className="text-sm text-muted-foreground">
          Browse tasks near you and send an offer.
        </p>
      </Link>
    </div>
  );
}
