import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions about ${brand.name}.`,
};

export default function FaqPage() {
  return (
    <LegalPage title="FAQ">
      <p>
        <strong>How do I get help?</strong> Post a task with a cash price in{" "}
        {brand.currency}, wait for nearby offers, then choose a helper.
      </p>
      <p>
        <strong>How do I earn?</strong> Browse tasks near you (distances in{" "}
        {brand.distanceUnit}), send an offer, and get paid in cash when the job
        is complete.
      </p>
      <p>
        <strong>Is there a wallet?</strong> No. {brand.name} is cash on
        completion only — no cards, wallets, or app balances.
      </p>
      <p>
        <strong>Where does it work?</strong> {brand.country} first, starting in
        major cities like Kabul, Herat, Mazar-i-Sharif, Kandahar, and Jalalabad.
      </p>
    </LegalPage>
  );
}
