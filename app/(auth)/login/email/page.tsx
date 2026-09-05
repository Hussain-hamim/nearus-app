"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { emailSchema } from "@/lib/validations";

function EmailAuthForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/home";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          router.replace("/onboarding");
          router.refresh();
          return;
        }
        toast.success("Check your email to confirm your account.");
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      router.replace(next);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
      <Link href="/login" className="mb-8">
        <Logo />
      </Link>
      <h1 className="text-2xl font-semibold">
        {mode === "signin" ? "Sign in with email" : "Create your account"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use the email you check most. You can post and earn from the same account.
      </p>
      <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
            required
            minLength={8}
          />
        </div>
        {mode === "signin" ? (
          <Link
            href="/forgot-password"
            className="block text-sm text-muted-foreground underline"
          >
            Forgot password?
          </Link>
        ) : null}
        <Button size="pill" className="w-full" type="submit" disabled={loading}>
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <button
        type="button"
        className="mt-6 text-sm text-muted-foreground underline"
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        {mode === "signin"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

export default function EmailAuthPage() {
  return (
    <Suspense>
      <EmailAuthForm />
    </Suspense>
  );
}
