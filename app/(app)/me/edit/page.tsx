"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { AFGHAN_CITIES } from "@/lib/categories";
import { createClient } from "@/lib/supabase/client";

type Draft = {
  id: string;
  displayName: string;
  bio: string;
  area: string;
  locality: string;
  city: string;
};

export default function EditProfilePage() {
  const { data: me, refetch } = useUser();
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const profile = me?.profile ?? null;

  if (profile && draft?.id !== profile.id) {
    setDraft({
      id: profile.id,
      displayName: profile.display_name,
      bio: profile.bio ?? "",
      area: profile.area ?? "",
      locality: profile.locality ?? "",
      city: profile.city ?? "Kabul",
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!me || !draft) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: draft.displayName.trim(),
        bio: draft.bio.trim() || null,
        area: draft.area.trim() || null,
        locality: draft.locality.trim() || null,
        city: draft.city,
      })
      .eq("id", me.user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refetch();
    toast.success("Profile updated.");
    router.push("/me");
  }

  async function onAvatar(file: File) {
    if (!me) return;
    const supabase = createClient();
    const path = `${me.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, {
      upsert: true,
    });
    if (error) {
      toast.error("Could not upload photo.");
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: data.publicUrl }).eq("id", me.user.id);
    await refetch();
    toast.success("Photo updated.");
  }

  if (!draft) {
    return <div className="px-5 py-10 text-sm text-muted-foreground">Loading profile…</div>;
  }

  return (
    <div className="pb-dock mx-auto max-w-lg px-5 pt-8 md:px-0">
      <h1 className="text-2xl font-semibold">Edit profile</h1>
      <form onSubmit={(e) => void save(e)} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="photo">Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            className="mt-2 h-12 rounded-xl"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onAvatar(file);
            }}
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className="mt-2 h-12 rounded-xl"
            value={draft.displayName}
            onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            className="mt-2"
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          />
        </div>
        <Input
          placeholder="Area"
          className="h-12 rounded-xl"
          value={draft.area}
          onChange={(e) => setDraft({ ...draft, area: e.target.value })}
        />
        <Input
          placeholder="Locality"
          className="h-12 rounded-xl"
          value={draft.locality}
          onChange={(e) => setDraft({ ...draft, locality: e.target.value })}
        />
        <select
          className="h-12 w-full rounded-xl border border-input bg-transparent px-2.5"
          value={draft.city}
          onChange={(e) => setDraft({ ...draft, city: e.target.value })}
        >
          {AFGHAN_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Button size="pill" className="w-full" type="submit" disabled={saving}>
          Save
        </Button>
      </form>
    </div>
  );
}
