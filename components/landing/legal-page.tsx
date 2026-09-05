import Link from "next/link";
import { LandingContainer } from "@/components/landing/landing-container";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="pt-28 pb-16 md:pt-32">
        <LandingContainer className="max-w-3xl">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {title}
          </h1>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
            {children}
          </div>
        </LandingContainer>
      </main>
      <LandingFooter />
    </>
  );
}
