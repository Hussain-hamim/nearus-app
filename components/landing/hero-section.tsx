import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroPhoneStage } from "@/components/landing/hero-phone-stage";

export function HeroSection() {
  return (
    <section className="relative overflow-x-clip bg-primary px-4 pt-28 pb-28 sm:px-6 sm:pt-32 sm:pb-32 lg:px-12 lg:pt-[150px] lg:pb-[180px]">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/illustrations/hero-mosque.jpg"
          alt=""
          fill
          className="object-cover object-top opacity-35 mix-blend-multiply"
          sizes="100vw"
          priority
        />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="relative">
          <span
            aria-hidden
            className="mb-3 inline-flex gap-0.5 text-foreground/70"
          >
            <span className="h-4 w-0.5 -rotate-12 bg-foreground" />
            <span className="h-5 w-0.5 -rotate-12 bg-foreground" />
            <span className="h-3.5 w-0.5 -rotate-12 bg-foreground" />
          </span>
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Need help{" "}
            <span className="relative inline-block text-white">
              nearby
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-white/90"
              />
            </span>
            ? Someone close can do it.
          </h1>
          <p className="mt-5 max-w-md text-base text-foreground/80 sm:text-lg">
            Everyday jobs in your area. Find a helper, finish the work, and pay
            in cash when it is done.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-base font-semibold text-white transition hover:bg-foreground/90 sm:w-auto"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <HeroPhoneStage />
      </div>
      <div className="wave-divider" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="shape-fill"
            d="M0,320 L0,280 C200,150 450,50 720,180 C900,260 1200,220 1440,140 L1440,320 Z"
          />
        </svg>
      </div>
    </section>
  );
}
