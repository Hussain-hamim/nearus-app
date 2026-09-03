"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, MapPin, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { CategoryChips } from "@/components/tasks/category-chips";
import { TaskCard } from "@/components/tasks/task-card";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeolocation } from "@/hooks/use-geolocation";
import type { TaskCategory } from "@/lib/categories";
import { createClient } from "@/lib/supabase/client";
import type { NearbyTask } from "@/types/database";

export default function HomePage() {
  const { state, request, previewKabul } = useGeolocation();
  const [category, setCategory] = useState<"all" | TaskCategory>("all");
  const [q, setQ] = useState("");
  const [radius, setRadius] = useState(10);

  const coords = state.status === "ready" ? state.coords : null;

  const tasksQuery = useQuery({
    queryKey: ["nearby", coords?.lat, coords?.lng, category, q, radius],
    enabled: Boolean(coords),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("nearby_tasks", {
        p_lat: coords!.lat,
        p_lng: coords!.lng,
        p_radius_km: radius,
        p_category: category === "all" ? undefined : category,
        p_search: q.trim() || undefined,
      });
      if (error) throw error;
      return (data ?? []) as NearbyTask[];
    },
  });

  const areaLabel = useMemo(() => {
    if (state.status === "ready") {
      return state.preview
        ? `${state.area}, ${state.city} (preview)`
        : `${state.area}, ${state.city}`;
    }
    if (state.status === "denied") return "Location unavailable";
    if (state.status === "loading") return "Finding you…";
    return "Location unavailable";
  }, [state]);

  return (
    <div className="pb-dock min-h-dvh md:pb-10">
      <header className="flex items-center justify-between gap-3 px-5 pt-5 md:px-0 md:pt-8">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Nearby</p>
            <p className="truncate font-semibold">{areaLabel}</p>
          </div>
        </div>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-border"
        >
          <Bell className="size-5" />
        </Link>
      </header>

      <div className="mt-4 px-5 md:px-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for tasks…"
            className="h-12 rounded-full bg-white pl-11 pr-12"
            aria-label="Search for tasks"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SlidersHorizontal className="size-4" />
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          {[2, 5, 10].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => setRadius(km)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                radius === km
                  ? "bg-primary text-primary-foreground"
                  : "bg-white ring-1 ring-border"
              }`}
            >
              {km} km
            </button>
          ))}
        </div>
      </div>

      <section className="mx-5 mt-4 flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-lavender px-5 py-4 md:mx-0">
        <div>
          <p className="text-xs font-semibold tracking-wide text-violet-700">
            CASH ON COMPLETION
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-snug">
            Need help nearby? Post a task. Want to earn? Send an offer.
          </h2>
        </div>
        <div className="hidden size-16 shrink-0 items-center justify-center rounded-full bg-white/70 text-3xl sm:flex">
          ؋
        </div>
      </section>

      <div className="mt-5 px-5 md:px-0">
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      <div className="mt-5 flex items-center justify-between px-5 md:px-0">
        <h2 className="font-semibold">Tasks near you</h2>
        <button
          type="button"
          onClick={() => void tasksQuery.refetch()}
          className="flex items-center gap-1 text-sm text-muted-foreground"
          aria-label="Refresh tasks"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <div className="mt-3 px-5 md:px-0">
        {state.status === "denied" || state.status === "error" ? (
          <EmptyState
            icon={<MapPin className="size-8" />}
            title="Turn on location to see nearby tasks"
            description="We use your area to show distance in km. Exact street addresses stay private until you pick a helper."
            action={
              <div className="flex flex-col gap-2">
                <Button size="pill" onClick={() => void request()}>
                  Fix location
                </Button>
                <button
                  type="button"
                  className="text-sm underline"
                    onClick={() => void previewKabul()}
                >
                  Preview Kabul instead
                </button>
              </div>
            }
          />
        ) : null}

        {state.status === "loading" || tasksQuery.isLoading ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {state.status === "ready" && tasksQuery.data && tasksQuery.data.length === 0 ? (
          <EmptyState
            icon={<Search className="size-8" />}
            title="No tasks near you yet"
            description="Try a wider radius, another category, or preview Kabul seed tasks."
            action={
              <div className="flex flex-col gap-2">
                <Link
                  href="/post"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground"
                >
                  Post a Task
                </Link>
                {!state.preview ? (
                  <button
                    type="button"
                    className="text-sm underline"
                    onClick={() => void previewKabul()}
                  >
                    Preview Kabul
                  </button>
                ) : null}
              </div>
            }
          />
        ) : null}

        {tasksQuery.data && tasksQuery.data.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {tasksQuery.data.map((task) => (
              <TaskCard key={task.id} href={`/tasks/${task.id}`} task={task} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
