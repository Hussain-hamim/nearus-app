import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const parsed = reviewSchema.safeParse(await parseJson(request));
  if (!parsed.success) return humanError("Choose a rating from 1 to 5.");

  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", parsed.data.task_id)
    .single();
  if (!task || task.status !== "completed") {
    return humanError("You can only review after the task is completed.");
  }
  const isRequester = task.requester_id === user.id;
  const isHelper = task.helper_id === user.id;
  if (!isRequester && !isHelper) return humanError("You were not on this task.", 403);
  const revieweeId = isRequester ? task.helper_id : task.requester_id;
  if (!revieweeId) return humanError("No one to review.");

  const { error } = await supabase.from("reviews").insert({
    task_id: task.id,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    rating: parsed.data.rating,
    comment: parsed.data.comment ?? null,
  });
  if (error) return humanError("You may have already reviewed this task.");
  return Response.json({ ok: true });
}
