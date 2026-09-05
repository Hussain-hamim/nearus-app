import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {brand.name} uses your account and approximate location to show nearby
        tasks in {brand.country}. Distances appear in {brand.distanceUnit}. Exact
        street addresses stay private until you choose a helper.
      </p>
      <p>
        We do not store payment cards or wallet balances. Cash is arranged
        between neighbors when the work is done.
      </p>
      <p>
        This page is an MVP placeholder and will be replaced with a full privacy
        policy before public launch.
      </p>
    </LegalPage>
  );
}
