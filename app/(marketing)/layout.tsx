import { LandingNav } from "@/components/landing/landing-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-brand-1">
      <LandingNav />
      {children}
    </div>
  );
}
