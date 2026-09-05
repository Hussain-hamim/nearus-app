import type { Metadata } from "next";
import { LegalPage } from "@/components/landing/legal-page";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        {brand.name} helps neighbors in {brand.country} arrange local tasks. You
        are responsible for the work you post or accept, and for paying the
        agreed cash amount in {brand.currency} when the job is done.
      </p>
      <p>
        {brand.name} does not process card payments, wallets, or in-app balances.
        Task prices are informational. Helpers are paid in cash on completion.
      </p>
      <p>
        These terms are an MVP placeholder and will be replaced with a full legal
        agreement before public launch.
      </p>
    </LegalPage>
  );
}
