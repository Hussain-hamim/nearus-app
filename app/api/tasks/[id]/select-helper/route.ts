import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { z } from "zod";

const bodySchema = z.object({ offerId: z.uuid() });

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const { id } = await context.params;
  const json = await parseJson<unknown>(request);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return humanError("Choose an offer to accept.");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("select_helper", {
    p_task_id: id,
    p_offer_id: parsed.data.offerId,
  });
  if (error) return humanError(error.message.replace("P0001: ", ""), 400);
  return Response.json({ conversationId: data });
}
