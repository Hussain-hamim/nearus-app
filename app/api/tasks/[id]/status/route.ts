import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { z } from "zod";

const bodySchema = z.object({
  status: z.enum(["in_progress", "completed", "cancelled"]),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const { id } = await context.params;
  const parsed = bodySchema.safeParse(await parseJson(request));
  if (!parsed.success) return humanError("That status update is not allowed.");

  const supabase = await createClient();
  const { data: task, error: loadError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  if (loadError || !task) return humanError("Task not found.", 404);

  const isRequester = task.requester_id === user.id;
  const isHelper = task.helper_id === user.id;
  if (!isRequester && !isHelper) return humanError("You cannot update this task.", 403);

  if (parsed.data.status === "in_progress" && !isHelper) {
    return humanError("Only the selected helper can start the job.");
  }
  if (parsed.data.status === "completed" && !isRequester) {
    return humanError("Only the person who posted can mark it complete.");
  }
  if (parsed.data.status === "cancelled" && !isRequester) {
    return humanError("Only the person who posted can cancel.");
  }

  const { error } = await supabase
    .from("tasks")
    .update({
      status: parsed.data.status,
      completed_at:
        parsed.data.status === "completed" ? new Date().toISOString() : task.completed_at,
    })
    .eq("id", id);
  if (error) return humanError("Could not update this task.");

  const other = isRequester ? task.helper_id : task.requester_id;
  if (other) {
    await supabase.rpc("notify_user", {
      p_user_id: other,
      p_type: "task_status",
      p_title: parsed.data.status === "completed" ? "Task completed" : "Task updated",
      p_body:
        parsed.data.status === "completed"
          ? `Pay in cash if you have not already — "${task.title}" is marked complete.`
          : `"${task.title}" is now ${parsed.data.status.replace("_", " ")}.`,
      p_data: { task_id: id },
    });
  }

  return Response.json({ ok: true });
}
