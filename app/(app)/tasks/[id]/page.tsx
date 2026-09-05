"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, MapPin, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_META, type TaskCategory } from "@/lib/categories";
import { formatAfn, formatTaskWhen, initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/use-user";
import type { Offer, Profile, Task } from "@/types/database";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me } = useUser();
  const [offerMessage, setOfferMessage] = useState("I can help with this. Cash on completion is fine.");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const taskQuery = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data: task, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      const { data: requester } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", task.requester_id)
        .single();
      const { data: helper } = task.helper_id
        ? await supabase.from("profiles").select("*").eq("id", task.helper_id).single()
        : { data: null };
      const { data: address } = await supabase.rpc("get_task_address", {
        p_task_id: id,
      });
      return {
        task: task as Task,
        requester: requester as Profile,
        helper: (helper as Profile | null) ?? null,
        address: (address as string | null) ?? null,
      };
    },
  });

  const offersQuery = useQuery({
    queryKey: ["offers", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("task_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const helperIds = [...new Set((data ?? []).map((o) => o.helper_id))];
      const { data: people } = helperIds.length
        ? await supabase.from("profiles").select("*").in("id", helperIds)
        : { data: [] };
      const map = new Map((people ?? []).map((p) => [p.id, p as Profile]));
      return ((data ?? []) as Offer[]).map((offer) => ({
        ...offer,
        helper: map.get(offer.helper_id),
      }));
    },
  });

  const conversationQuery = useQuery({
    queryKey: ["task-conversation", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("conversations")
        .select("id")
        .eq("task_id", id)
        .maybeSingle();
      return data;
    },
  });

  const isRequester = me?.user.id === taskQuery.data?.task.requester_id;
  const isHelper = me?.user.id === taskQuery.data?.task.helper_id;
  const myOffer = offersQuery.data?.find((o) => o.helper_id === me?.user.id);

  const sendOffer = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.from("offers").insert({
        task_id: id,
        helper_id: me!.user.id,
        message: offerMessage.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Offer sent.");
      void qc.invalidateQueries({ queryKey: ["offers", id] });
      void qc.invalidateQueries({ queryKey: ["task", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const selectHelper = useMutation({
    mutationFn: async (offerId: string) => {
      const res = await fetch(`/api/tasks/${id}/select-helper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not select helper.");
      return json as { conversationId: string };
    },
    onSuccess: (data) => {
      toast.success("Helper selected. Chat is open.");
      router.push(`/chat/${data.conversationId}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const setStatus = useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not update task.");
    },
    onSuccess: () => {
      toast.success("Task updated.");
      void qc.invalidateQueries({ queryKey: ["task", id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not send review.");
    },
    onSuccess: () => toast.success("Review saved. Thank you."),
    onError: (err: Error) => toast.error(err.message),
  });

  const task = taskQuery.data?.task;
  if (taskQuery.isLoading || !task) {
    return <div className="px-5 py-10 text-sm text-muted-foreground">Loading task…</div>;
  }

  const category = CATEGORY_META[task.category as TaskCategory];

  return (
    <div className="pb-dock mx-auto max-w-3xl px-5 pt-6 md:px-0 md:pt-8">
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {category?.label} · {task.status.replaceAll("_", " ")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{task.title}</h1>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold">
            {formatAfn(task.budget_amount)}
          </span>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{task.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span>{formatTaskWhen(task.scheduled_at)}</span>
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {task.area}, {task.locality}, {task.city}
          </span>
          <span>Visible {task.visibility_radius_km} km</span>
        </div>
        {taskQuery.data?.address ? (
          <p className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm">
            Exact address (visible to you): {taskQuery.data.address}
          </p>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Street address is hidden until a helper is selected.
          </p>
        )}
      </div>

      <Link
        href={`/me?user=${task.requester_id}`}
        className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-4"
      >
        <Avatar className="size-12">
          <AvatarImage src={taskQuery.data?.requester.avatar_url ?? undefined} />
          <AvatarFallback>{initials(taskQuery.data?.requester.display_name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{taskQuery.data?.requester.display_name}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            {Number(taskQuery.data?.requester.average_rating ?? 0).toFixed(1)} ·{" "}
            {taskQuery.data?.requester.review_count} reviews
          </p>
        </div>
      </Link>

      {isRequester && (task.status === "open" || task.status === "offer_received") ? (
        <section className="mt-6">
          <h2 className="font-semibold">Offers</h2>
          <div className="mt-3 space-y-3">
            {offersQuery.data?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No offers yet.</p>
            ) : null}
            {offersQuery.data?.map((offer) => (
              <article key={offer.id} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{offer.helper?.display_name ?? "Helper"}</p>
                  <span className="text-xs text-muted-foreground">{offer.status}</span>
                </div>
                <p className="mt-1 text-sm">{offer.message}</p>
                {offer.status === "pending" ? (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-full"
                      onClick={() => selectHelper.mutate(offer.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase
                          .from("offers")
                          .update({ status: "declined" })
                          .eq("id", offer.id);
                        void qc.invalidateQueries({ queryKey: ["offers", id] });
                      }}
                    >
                      Decline
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {!isRequester && (task.status === "open" || task.status === "offer_received") ? (
        <section className="mt-6 rounded-2xl border border-border bg-white p-4">
          <h2 className="font-semibold">Send an offer</h2>
          {myOffer ? (
            <p className="mt-2 text-sm text-muted-foreground">
              You already offered ({myOffer.status}).
            </p>
          ) : (
            <>
              <Textarea
                className="mt-3"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
              <Button
                size="pill"
                className="mt-3 w-full"
                disabled={sendOffer.isPending}
                onClick={() => sendOffer.mutate()}
              >
                Send offer
              </Button>
            </>
          )}
        </section>
      ) : null}

      {(isRequester || isHelper) && conversationQuery.data ? (
        <Link
          href={`/chat/${conversationQuery.data.id}`}
          className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-white text-base font-semibold"
        >
          <MessageCircle className="size-4" /> Open chat
        </Link>
      ) : null}

      {isHelper && task.status === "helper_selected" ? (
        <Button
          size="pill"
          className="mt-4 w-full"
          onClick={() => setStatus.mutate("in_progress")}
        >
          Start job
        </Button>
      ) : null}

      {isRequester && (task.status === "helper_selected" || task.status === "in_progress") ? (
        <Button
          size="pill"
          className="mt-4 w-full"
          onClick={() => setStatus.mutate("completed")}
        >
          Mark complete (pay in cash)
        </Button>
      ) : null}

      {task.status === "completed" && (isRequester || isHelper) ? (
        <section className="mt-6 rounded-2xl border border-border bg-white p-4">
          <h2 className="font-semibold">Leave a review</h2>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setReviewRating(n)}>
                <Star
                  className={`size-6 ${n <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              </button>
            ))}
          </div>
          <Textarea
            className="mt-3"
            placeholder="How did it go?"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
          <Button
            size="pill"
            className="mt-3 w-full"
            onClick={() => submitReview.mutate()}
          >
            Submit review
          </Button>
        </section>
      ) : null}

      {!isRequester ? (
        <div className="mt-6 flex gap-3 text-sm">
          <button
            type="button"
            className="flex items-center gap-1 text-muted-foreground"
            onClick={async () => {
              await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  reported_user_id: task.requester_id,
                  task_id: id,
                  reason: "other",
                }),
              });
              toast.success("Report received. We’ll review it.");
            }}
          >
            <Flag className="size-4" /> Report
          </button>
          <button
            type="button"
            className="text-destructive"
            onClick={async () => {
              await fetch("/api/blocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blocked_id: task.requester_id }),
              });
              toast.success("This person is blocked.");
              router.push("/home");
            }}
          >
            Block
          </button>
        </div>
      ) : null}
    </div>
  );
}
