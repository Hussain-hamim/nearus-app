"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  async function deleteAccount() {
    if (!confirm("Delete your NearTask account and public data?")) return;
    const res = await fetch("/api/account", { method: "DELETE" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(json.error ?? "Could not delete account.");
      return;
    }
    toast.success("Account data removed.");
    router.replace("/login");
  }

  return (
    <div className="pb-dock mx-auto max-w-lg px-5 pt-8 md:px-0">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        NearTask is cash only. There are no wallets, cards, or transaction histories to manage.
      </p>
      <div className="mt-6 rounded-2xl border border-border bg-white p-4 text-sm">
        <p className="font-medium">Language</p>
        <p className="text-muted-foreground">English for MVP. Dari and Pashto later.</p>
      </div>
      <Button variant="destructive" size="pill" className="mt-8 w-full" onClick={() => void deleteAccount()}>
        Delete account
      </Button>
    </div>
  );
}
