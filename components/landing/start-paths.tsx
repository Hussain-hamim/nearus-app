import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plus, Search } from "lucide-react";
import { LandingContainer } from "@/components/landing/landing-container";
import { brand } from "@/lib/brand";

const BLOB =
  "M45.7,-76.4C58.9,-69.3,69,-55.4,77.7,-40.7C86.4,-26,93.6,-10.5,91.2,3.3C88.8,17.1,76.8,29.3,66,41.2C55.2,53.1,45.6,64.7,33.2,71.1C20.8,77.5,5.6,78.7,-8.4,75.4C-22.4,72.1,-35.3,64.3,-48.1,55.9C-60.9,47.5,-73.6,38.5,-80.6,25.6C-87.6,12.7,-88.9,-4.1,-84.6,-19.1C-80.3,-34.1,-70.4,-47.3,-58.2,-55.4C-46,-63.5,-31.5,-66.5,-17.8,-68.8C-4.1,-71.1,8.8,-72.7,22.3,-74.6C35.8,-76.5,47.9,-78.7,45.7,-76.4Z";

export function StartPaths() {
  return (
    <section className="bg-brand-1 py-14 md:py-20">
      <LandingContainer>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          How do you want to start?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          You can do both later. This just opens the right screen first.
        </p>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
          <PathCard
            icon={<Plus className="size-6" />}
            title="Need help?"
            body={`Post a task. Find a neighbor nearby. Pay in ${brand.currencySymbol} cash when it is done.`}
            href="/login?next=/post"
            cta="Post a Task"
            imageSrc="/illustrations/path-help.png"
            imageAlt="Post a nearby task"
            primary
          />
          <PathCard
            icon={<Search className="size-6" />}
            title="Want to earn?"
            body="Browse tasks near you. Send an offer. Get paid in cash on completion."
            href="/login?next=/home"
            cta="Browse Tasks"
            imageSrc="/illustrations/path-earn.png"
            imageAlt="Find nearby paid tasks"
          />
        </div>
      </LandingContainer>
    </section>
  );
}

function PathCard({
  icon,
  title,
  body,
  href,
  cta,
  imageSrc,
  imageAlt,
  primary = false,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  primary?: boolean;
}) {
  return (
    <article className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:min-h-[380px] sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 flex h-[220px] w-[220px] -translate-y-1/2 items-start justify-end sm:h-[250px] sm:w-[250px]"
      >
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full fill-brand-1 text-brand-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={BLOB} transform="translate(100 100) scale(1.15)" />
        </svg>
        <div className="absolute top-10 right-4 flex items-center justify-center sm:top-14 sm:right-8">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={155}
            height={185}
            className="h-[150px] w-[125px] -translate-y-1 object-contain transition duration-300 group-hover:-translate-y-2 sm:h-[185px] sm:w-[155px]"
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-foreground shadow-sm">
          {icon}
        </span>
        <h3 className="text-2xl font-bold sm:text-[2rem]">{title}</h3>
        <span aria-hidden className="mt-3 block h-1.5 w-10 rounded-full bg-primary" />
        <p className="mt-4 max-w-[240px] flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {body}
        </p>
        <Link
          href={href}
          className={
            primary
              ? "mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground transition hover:bg-primary/85"
              : "mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-primary bg-white px-5 text-base font-semibold transition hover:bg-primary/10"
          }
        >
          {cta}
          {primary ? (
            <ArrowRight className="size-4" />
          ) : (
            <span className="flex size-6 items-center justify-center rounded-full bg-primary">
              <ArrowRight className="size-3.5" />
            </span>
          )}
        </Link>
      </div>
    </article>
  );
}
