import { Banknote, MapPin, MapPinned } from "lucide-react";
import { LandingContainer } from "@/components/landing/landing-container";
import { brand } from "@/lib/brand";

const FACTS = [
  {
    icon: MapPin,
    title: "Nearby",
    body: `Distances in ${brand.distanceUnit}. You see people close to you, not the whole city.`,
  },
  {
    icon: Banknote,
    title: "Cash on completion",
    body: "No wallet, no card, no app balance. Pay in cash when the work is done.",
  },
  {
    icon: MapPinned,
    title: `${brand.country} first`,
    body: `Built for local areas and prices in ${brand.currency} (${brand.currencySymbol}).`,
  },
] as const;

export function TrustStrip() {
  return (
    <section className="bg-white py-14 md:py-20">
      <LandingContainer>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Help next door. Pay in cash.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {brand.name} is built for neighbors in {brand.country} — not for
            wallets or cards.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-3">
          {FACTS.map((fact) => (
            <article
              key={fact.title}
              className="rounded-[1.5rem] border border-border bg-brand-1 p-5 sm:p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <fact.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{fact.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {fact.body}
              </p>
            </article>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}
