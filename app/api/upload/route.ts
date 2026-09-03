import { createClient, getUser } from "@/lib/supabase/server";
import { humanError, parseJson } from "@/lib/api";
import { z } from "zod";

const bodySchema = z.object({
  filename: z.string().min(1).max(120),
  contentType: z.string().min(3).max(80),
});

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return humanError("Please sign in.", 401);
  const parsed = bodySchema.safeParse(await parseJson(request));
  if (!parsed.success) return humanError("Choose a photo to upload.");

  const supabase = await createClient();
  const path = `${user.id}/${Date.now()}-${parsed.data.filename}`;
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUploadUrl(path);
  if (error || !data) return humanError("Could not start upload.");
  return Response.json({ path, token: data.token, signedUrl: data.signedUrl });
}
