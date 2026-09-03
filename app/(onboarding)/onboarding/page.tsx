"use client";

import { useRouter } from "next/navigation";
import { Briefcase, HandHelping } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { OnboardingIntent } from "@/types/database";

export default function OnboardingPage() {
  const router = useRouter();

  async function choose(intent: OnboardingIntent, href: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({ intent, onboarding_completed_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) {
      toast.error("Could not save your choice.");
      return;
    }
    router.replace(href);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-10">
      <h1 className="text-2xl font-semibold">What are you here to do?</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You can always do both later. This just sets your home screen.
      </p>
      <div className="mt-8 grid gap-4">
        <button
          type="button"
          onClick={() => void choose("need_help", "/post")}
          className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 text-left"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary">
            <HandHelping className="size-7" />
          </span>
          <span>
            <span className="block text-lg font-semibold">Need Help?</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Post a task nearby. Pay in cash when it is done.
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => void choose("want_to_earn", "/")}
          className="flex items-start gap-4 rounded-2xl border border-border bg-white p-5 text-left"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Briefcase className="size-7" />
          </span>
          <span>
            <span className="block text-lg font-semibold">Want to Earn?</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Browse tasks near you and send an offer.
            </span>
          </span>
        </button>
      </div>
      <Button
        variant="ghost"
        className="mt-8 self-center"
        onClick={() => void choose("skipped", "/")}
      >
        Skip for now
      </Button>
    </div>
  );
}
