import { createClient, getUser } from "@/lib/supabase/server";
import { humanError } from "@/lib/api";

export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const cleaned = q.replace(/[%_,]/g, " ").slice(0, 80);
  if (!cleaned) return Response.json({ tasks: [] });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .in("status", ["open", "offer_received"])
    .or(`title.ilike.%${cleaned}%,description.ilike.%${cleaned}%`)
    .limit(30);
  if (error) return humanError("Search failed.");
  return Response.json({ tasks: data ?? [] });
}
