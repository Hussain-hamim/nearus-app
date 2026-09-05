import type { Metadata } from "next";
import { GetAppSection } from "@/components/landing/get-app-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksCarousel } from "@/components/landing/how-it-works-carousel";
import { LandingFooter } from "@/components/landing/landing-footer";
import { NearbyNow } from "@/components/landing/nearby-now";
import { StartPaths } from "@/components/landing/start-paths";
import { TrustStrip } from "@/components/landing/trust-strip";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Get help nearby. Pay in cash.",
  description: brand.description,
};

export default function LandingPage() {
  return (
    <>
      <main>
        <HeroSection />
        <NearbyNow />
        <HowItWorksCarousel />
        <StartPaths />
        <TrustStrip />
        <GetAppSection />
      </main>
      <LandingFooter />
    </>
  );
}
