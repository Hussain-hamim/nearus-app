import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { reportSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const parsed = reportSchema.safeParse(await parseJson(request));
  if (!parsed.success) return humanError("Tell us why you are reporting.");

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_user_id: parsed.data.reported_user_id,
    task_id: parsed.data.task_id ?? null,
    reason: parsed.data.reason,
    details: parsed.data.details ?? null,
  });
  if (error) return humanError("Could not send this report.");
  return Response.json({ ok: true });
}
