"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LifeBuoy,
  Lock,
  LogOut,
  Pencil,
  Settings,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { WavyHeader } from "@/components/shell/wavy-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { initials } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const rows = [
  { href: "/me/settings", icon: Settings, title: "Settings", subtitle: "Account and app preferences" },
  { href: "/me/notifications", icon: Bell, title: "Notifications", subtitle: "Offers, chat, and task updates" },
  { href: "/me/privacy", icon: Lock, title: "Privacy", subtitle: "Address sharing, reports, and blocks" },
  { href: "/me/help", icon: HelpCircle, title: "Help Center", subtitle: "How NearTask works" },
  { href: "/me/help#support", icon: LifeBuoy, title: "Contact Support", subtitle: "We reply in English" },
];

export default function MePage() {
  const { data: me } = useUser();
  const router = useRouter();
  const profile = me?.profile;

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="pb-dock md:pb-10">
      <WavyHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Me</h1>
          <Link href="/me/settings" aria-label="Settings">
            <Settings className="size-5" />
          </Link>
        </div>
      </WavyHeader>

      <div className="-mt-2 px-5 md:px-0">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6">
          <div className="relative">
            <Avatar className="size-24">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xl">{initials(profile?.display_name)}</AvatarFallback>
            </Avatar>
            <Link
              href="/me/edit"
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card"
              aria-label="Edit profile"
            >
              <Pencil className="size-4" />
            </Link>
          </div>
          <h2 className="mt-3 text-xl font-semibold">{profile?.display_name ?? "Neighbor"}</h2>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-primary text-primary" />
            {Number(profile?.average_rating ?? 0).toFixed(1)} · {profile?.review_count ?? 0} reviews
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[profile?.area, profile?.city].filter(Boolean).join(", ") || "Afghanistan"}
          </p>
          <Link
            href="/me/edit"
            className="mt-4 rounded-full bg-cream px-5 py-2 text-sm font-semibold"
          >
            Edit Profile
          </Link>
        </div>

        <section className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            PAYING FOR TASKS
          </p>
          <h3 className="mt-1 font-semibold">Cash on completion</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            NearTask does not hold money. Agree the ؋ amount up front, meet in a public place
            when you can, and pay in cash when the job is done. Never share bank codes or
            send money to “confirm” a helper.
          </p>
        </section>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary">
                <row.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{row.title}</span>
                <span className="block text-xs text-muted-foreground">{row.subtitle}</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Button
          variant="destructive"
          size="pill"
          className="mt-6 w-full"
          onClick={() => {
            void logout();
            toast.success("Signed out.");
          }}
        >
          <LogOut /> Log Out
        </Button>
      </div>
    </div>
  );
}
