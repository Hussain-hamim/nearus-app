import Link from "next/link";
import { LandingContainer } from "@/components/landing/landing-container";
import { TaskCard } from "@/components/tasks/task-card";
import { brand } from "@/lib/brand";

const SAMPLE_TASKS = [
  {
    id: "sample-kabul",
    title: "Help me move a table",
    budget_amount: 800,
    scheduled_at: new Date().toISOString(),
    distance_km: 2.3,
    area: "Kabul",
    requester_display_name: "Ahmad K.",
    category: "errands" as const,
  },
  {
    id: "sample-herat",
    title: "Fix a leaking tap",
    budget_amount: 650,
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    distance_km: 1.1,
    area: "Herat",
    requester_display_name: "Sara R.",
    category: "services" as const,
  },
  {
    id: "sample-mazar",
    title: "Help carry market bags",
    budget_amount: 300,
    scheduled_at: new Date().toISOString(),
    distance_km: 0.8,
    area: "Mazar-i-Sharif",
    requester_display_name: "Farid M.",
    category: "errands" as const,
  },
  {
    id: "sample-kandahar",
    title: "Need help hanging shelves",
    budget_amount: 500,
    scheduled_at: new Date(Date.now() + 172800000).toISOString(),
    distance_km: 1.6,
    area: "Kandahar",
    requester_display_name: "Omar S.",
    category: "services" as const,
  },
];

export function NearbyNow() {
  return (
    <section className="bg-brand-1 py-14 md:py-20">
      <LandingContainer>
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            Jobs near people like you
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Sample tasks in {brand.currency} with distances in{" "}
            {brand.distanceUnit}. Sign in to see what is open near you.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-2">
          {SAMPLE_TASKS.map((task) => (
            <TaskCard
              key={task.id}
              href="/login?next=/home"
              task={task}
              className="shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
            />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login?next=/home" className="font-medium underline">
            Sign in
          </Link>{" "}
          to see tasks in your area.
        </p>
      </LandingContainer>
    </section>
  );
}
