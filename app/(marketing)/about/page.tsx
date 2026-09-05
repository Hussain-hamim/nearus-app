import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { AFGHAN_CITIES } from "@/lib/categories";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `How ${brand.name} works in ${brand.country}.`,
};

export default function AboutPage() {
  return (
    <LegalPage title={`About ${brand.name}`}>
      <p>
        {brand.name} is a local task marketplace for {brand.country}. Post a job,
        find a helper nearby, and pay in cash when the work is done.
      </p>
      <p>
        Distances are shown in {brand.distanceUnit}. Prices are listed in{" "}
        {brand.currency} ({brand.currencySymbol}). There is no in-app wallet,
        card checkout, or UPI.
      </p>
      <p>
        We start in {AFGHAN_CITIES.join(", ")}. More cities later.
      </p>
    </LegalPage>
  );
}
