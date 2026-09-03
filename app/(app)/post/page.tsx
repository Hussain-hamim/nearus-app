/* eslint-disable react-hooks/incompatible-library -- react-hook-form watch() */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AFGHAN_CITIES,
  CATEGORY_META,
  TASK_CATEGORIES,
  VISIBILITY_RADII_KM,
  type TaskCategory,
} from "@/lib/categories";
import { useGeolocation } from "@/hooks/use-geolocation";
import { createClient } from "@/lib/supabase/client";
import { taskSchema, type TaskInput } from "@/lib/validations";
import { cn } from "@/lib/utils";

export default function PostTaskPage() {
  const router = useRouter();
  const geo = useGeolocation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleLocal, setScheduleLocal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "services",
      area: "",
      locality: "",
      city: "Kabul",
      budget_amount: 500,
      visibility_radius_km: 5,
      lat: 34.532,
      lng: 69.1715,
      scheduled_at: null,
    },
  });

  const title = form.watch("title");
  const description = form.watch("description");
  const category = form.watch("category");
  const radius = form.watch("visibility_radius_km");

  useEffect(() => {
    if (geo.state.status !== "ready") return;
    if (form.getValues("area")) return;
    form.setValue("area", geo.state.area);
    form.setValue("locality", geo.state.locality);
    form.setValue("city", geo.state.city);
    form.setValue("lat", geo.state.coords.lat);
    form.setValue("lng", geo.state.coords.lng);
    form.setValue("formatted_address", geo.state.formatted_address);
  }, [form, geo.state]);

  async function onSubmit(values: TaskInput) {
    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in again.");
      setSubmitting(false);
      return;
    }
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        requester_id: user.id,
        title: values.title,
        description: values.description,
        category: values.category,
        budget_amount: values.budget_amount,
        visibility_radius_km: values.visibility_radius_km,
        area: values.area,
        locality: values.locality,
        city: values.city,
        lat: values.lat,
        lng: values.lng,
        scheduled_at: values.scheduled_at ?? null,
      })
      .select("id")
      .single();
    if (error || !task) {
      setSubmitting(false);
      toast.error(error?.message ?? "Could not post this task.");
      return;
    }
    const address =
      values.formatted_address ||
      `${values.area}, ${values.locality}, ${values.city}, Afghanistan`;
    await supabase.from("task_addresses").insert({
      task_id: task.id,
      formatted_address: address,
    });
    toast.success("Task posted. Helpers nearby can now offer.");
    router.replace(`/tasks/${task.id}`);
    router.refresh();
  }

  const locationBlocked =
    geo.state.status === "denied" || geo.state.status === "error";

  return (
    <div className="pb-dock md:pb-10">
      <div className="px-5 pt-6 md:px-0 md:pt-8">
        <h1 className="text-2xl font-semibold">Post a Task</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One page. Cash on completion. Helpers see your area, not your street, until you select them.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 space-y-4 px-5 pb-28 md:grid md:grid-cols-2 md:gap-6 md:space-y-0 md:px-0"
      >
        <div className="space-y-4">
          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              className="mt-2 h-12 rounded-xl"
              maxLength={120}
              {...form.register("title")}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {title.length}/120
            </p>
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              className="mt-2 min-h-28 rounded-xl"
              maxLength={2000}
              {...form.register("description")}
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {description.length}/2000
            </p>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label>Category *</Label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {TASK_CATEGORIES.map((item) => {
                const meta = CATEGORY_META[item as TaskCategory];
                const Icon = meta.icon;
                const selected = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => form.setValue("category", item)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-2xl border px-1 py-3 text-xs font-medium",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/40"
                    )}
                  >
                    <Icon className="size-5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="space-y-4">
          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label>Address *</Label>
            <p className="mb-3 text-xs text-muted-foreground">
              Area + locality (district / neighborhood)
            </p>
            <div className="grid gap-3">
              <Input
                placeholder="Area"
                className="h-12 rounded-xl"
                {...form.register("area")}
              />
              <Input
                placeholder="Locality / District"
                className="h-12 rounded-xl"
                {...form.register("locality")}
              />
              <select
                className="h-12 rounded-xl border border-input bg-transparent px-2.5"
                {...form.register("city")}
              >
                {AFGHAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {locationBlocked ? (
              <div className="mt-3 flex items-center justify-between rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4" />
                  Location is off
                </span>
                <button type="button" className="font-semibold" onClick={() => void geo.request()}>
                  Fix
                </button>
              </div>
            ) : (
              <div className="mt-3 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                Pin: {form.watch("lat").toFixed(4)}, {form.watch("lng").toFixed(4)} · map adapter ready
              </div>
            )}
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label htmlFor="budget">Pricing * (؋ cash)</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold">؋</span>
              <Input
                id="budget"
                type="number"
                min={1}
                className="h-12 rounded-xl pl-8"
                {...form.register("budget_amount", { valueAsNumber: true })}
              />
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setScheduleOpen(true)}
            >
              <span>
                <span className="block text-sm font-medium">Schedule (optional)</span>
                <span className="text-sm text-muted-foreground">
                  {scheduleLocal
                    ? new Date(scheduleLocal).toLocaleString()
                    : "Flexible · tap to set date and time"}
                </span>
              </span>
              <CalendarClock className="size-5 text-muted-foreground" />
            </button>
          </fieldset>

          <fieldset className="rounded-2xl border border-border bg-white p-4">
            <Label>Visible radius</Label>
            <div className="mt-3 flex gap-2">
              {VISIBILITY_RADII_KM.map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => form.setValue("visibility_radius_km", km)}
                  className={cn(
                    "flex-1 rounded-full py-2 text-sm font-medium",
                    radius === km
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {km} km
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:static md:col-span-2 md:border-0 md:bg-transparent md:p-0">
          <Button size="pill" className="w-full md:max-w-sm" type="submit" disabled={submitting}>
            {submitting ? "Posting…" : "Post Task"}
          </Button>
        </div>
      </form>

      <Sheet open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl p-5">
          <SheetHeader>
            <SheetTitle>When do you need this?</SheetTitle>
          </SheetHeader>
          <Input
            type="datetime-local"
            className="mt-4 h-12 rounded-xl"
            value={scheduleLocal}
            onChange={(e) => setScheduleLocal(e.target.value)}
          />
          <Button
            size="pill"
            className="mt-4 w-full"
            onClick={() => {
              form.setValue(
                "scheduled_at",
                scheduleLocal ? new Date(scheduleLocal).toISOString() : null
              );
              setScheduleOpen(false);
            }}
          >
            Save
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
