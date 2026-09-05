"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { TaskCard } from "@/components/tasks/task-card";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  async function google() {
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      toast.error("Google sign-in is not enabled yet. Continue with email.");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative flex flex-1 flex-col bg-primary pt-safe">
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-10">
          <Logo className="size-14" />
          <p className="mt-3 text-sm font-medium text-primary-foreground/80">
            {brand.tagline}
          </p>
          <div className="mt-10 w-full max-w-sm">
            <TaskCard
              className="shadow-lg"
              task={{
                id: "sample",
                title: "Need a plumber this afternoon",
                budget_amount: 800,
                scheduled_at: new Date().toISOString(),
                distance_km: 1.2,
                requester_display_name: "Ahmad K.",
                category: "services",
              }}
            />
            <div className="mt-2 flex justify-end">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-card">
                <ArrowRight className="size-5" />
              </span>
            </div>
          </div>
        </div>
        <svg
          className="h-10 w-full text-card"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0 24c180 18 360-18 540-6s360 30 540 12 270-24 360-18v36H0V24Z"
          />
        </svg>
      </div>
      <div className="bg-card px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
          <Button
            size="pill"
            className="w-full"
            onClick={() => void google()}
          >
            Continue with Google
          </Button>
          <Button
            size="pill"
            variant="outline"
            className="w-full border-primary bg-card text-foreground hover:bg-primary/10"
            onClick={() => router.push("/login/email")}
          >
            <Mail />
            Continue with Email
          </Button>
          <p className="px-2 text-center text-xs text-muted-foreground">
            By continuing you agree to cash-on-completion payments in Afghanistan.
            No cards or wallets.{" "}
            <Link href="/login/email" className="underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
