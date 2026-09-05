import Link from "next/link";
import { Gavel, Headset, Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LandingContainer } from "@/components/landing/landing-container";
import { brand } from "@/lib/brand";

const links = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#171717] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-10 text-white sm:pt-14">
      <LandingContainer className="flex flex-col items-center text-center">
        <Logo className="size-12" inverted />
        <p className="mt-3 max-w-sm text-sm text-white/60">
          Local tasks in {brand.country}. Pay in cash when the work is done.
        </p>
        <nav className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 text-sm font-medium text-white/90 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <ul className="mt-8 flex flex-col items-center gap-3 text-sm text-white/80">
          <li>
            <a
              href={`mailto:${brand.emails.contact}`}
              className="inline-flex min-h-11 items-center gap-2 hover:text-primary"
            >
              <Mail className="size-4 text-primary" />
              {brand.emails.contact}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${brand.emails.support}`}
              className="inline-flex min-h-11 items-center gap-2 hover:text-primary"
            >
              <Headset className="size-4 text-primary" />
              {brand.emails.support}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${brand.emails.legal}`}
              className="inline-flex min-h-11 items-center gap-2 hover:text-primary"
            >
              <Gavel className="size-4 text-primary" />
              {brand.emails.legal}
            </a>
          </li>
        </ul>
        <p className="mt-10 text-xs text-white/45">
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
      </LandingContainer>
    </footer>
  );
}
