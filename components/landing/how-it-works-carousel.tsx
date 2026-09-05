"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Check, Star } from "lucide-react";
import { LandingContainer } from "@/components/landing/landing-container";
import {
  HOW_IT_WORKS_STEPS,
  type HowItWorksStepId,
} from "@/lib/landing/how-it-works-steps";
import { cn } from "@/lib/utils";

const AUTO_MS = 2000;

export function HowItWorksCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });
  const [selected, setSelected] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.28);
      },
      { threshold: [0.2, 0.28, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || !inView || paused || reduceMotion) return;
    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, inView, paused, reduceMotion, selected]);

  const step = HOW_IT_WORKS_STEPS[selected];

  return (
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-white py-16 md:py-24"
    >
      <LandingContainer className="text-center">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p
          className="mt-2 text-sm font-semibold tracking-[0.18em] text-muted-foreground"
          aria-live="polite"
        >
          STEP {step.number} OF {String(HOW_IT_WORKS_STEPS.length).padStart(2, "0")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground md:hidden">
          Steps play automatically. Swipe to jump ahead.
        </p>
      </LandingContainer>

      <div
        className="relative mt-8 outline-none md:mt-10"
        role="region"
        aria-roledescription="carousel"
        aria-label="How NearTask works"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onKeyDown={(event) => {
          if (!emblaApi) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            emblaApi.scrollPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            emblaApi.scrollNext();
          }
        }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {HOW_IT_WORKS_STEPS.map((item, index) => {
              const active = index === selected;
              return (
                <div
                  key={item.id}
                  className="min-w-0 shrink-0 grow-0 basis-[82%] px-2 sm:basis-[70%] md:basis-[420px] lg:basis-[460px]"
                  aria-hidden={!active}
                >
                  <article
                    className={cn(
                      "flex h-full min-h-[320px] flex-col rounded-[1.75rem] bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.08)] ring-1 ring-black/5 sm:p-8",
                      !reduceMotion && "transition duration-300",
                      active
                        ? "scale-100 opacity-100"
                        : reduceMotion
                          ? "opacity-55"
                          : "scale-[0.86] opacity-45 blur-[1.5px]"
                    )}
                  >
                    <p className="text-5xl font-black text-primary">{item.number}</p>
                    <h3 className="mt-3 text-xl font-bold sm:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      {item.description}
                    </p>
                    <div className="mt-auto pt-6">
                      <StepMock id={item.id} />
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-center gap-2">
        {HOW_IT_WORKS_STEPS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Go to step ${item.number}`}
            aria-current={index === selected ? "true" : undefined}
            className={cn(
              "h-2 rounded-full transition",
              index === selected ? "w-7 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}

function StepMock({ id }: { id: HowItWorksStepId }) {
  if (id === "post") {
    return (
      <div className="rounded-2xl border border-border bg-muted/60 px-4 py-3 text-left text-sm text-muted-foreground">
        Need help moving…
      </div>
    );
  }

  if (id === "offers") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-sm font-medium">3 offers found</span>
        <span className="flex -space-x-2">
          {["AK", "SR", "FM"].map((initials) => (
            <span
              key={initials}
              className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-bold ring-2 ring-white"
            >
              {initials}
            </span>
          ))}
        </span>
      </div>
    );
  }

  if (id === "choose") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-border px-4 py-3">
        <div className="text-left">
          <p className="text-sm font-semibold">Sara R.</p>
          <p className="text-xs text-muted-foreground">1.1 km · 4.9 rating</p>
        </div>
        <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check className="size-4" />
        </span>
      </div>
    );
  }

  if (id === "done") {
    return (
      <div className="rounded-2xl border border-border px-4 py-4">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>In progress</span>
          <span>70%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[70%] rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1 rounded-2xl border border-border py-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="size-5 fill-primary text-primary" />
      ))}
    </div>
  );
}
