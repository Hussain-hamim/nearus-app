import { createClient, getUser } from "@/lib/supabase/server";
import { humanError } from "@/lib/api";

export async function DELETE() {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const supabase = await createClient();

  await supabase.from("blocks").delete().eq("blocker_id", user.id);
  await supabase.from("reports").delete().eq("reporter_id", user.id);
  await supabase.from("notifications").delete().eq("user_id", user.id);
  await supabase.from("saved_tasks").delete().eq("user_id", user.id);
  await supabase.from("tasks").delete().eq("requester_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);
  await supabase.auth.signOut();

  return Response.json({ ok: true });
}
