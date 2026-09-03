import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { z } from "zod";

const bodySchema = z.object({ blocked_id: z.uuid() });

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const parsed = bodySchema.safeParse(await parseJson(request));
  if (!parsed.success) return humanError("Choose someone to block.");
  if (parsed.data.blocked_id === user.id) return humanError("You cannot block yourself.");

  const supabase = await createClient();
  const { error } = await supabase.from("blocks").insert({
    blocker_id: user.id,
    blocked_id: parsed.data.blocked_id,
  });
  if (error) return humanError("Could not block this person.");
  return Response.json({ ok: true });
}
