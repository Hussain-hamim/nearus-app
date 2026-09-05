import Image from "next/image";
import { InstallButton } from "@/components/landing/install-button";
import { brand } from "@/lib/brand";

const WAVE =
  "M0,224L60,208C120,192,240,160,360,170.7C480,181,600,235,720,245.3C840,256,960,224,1080,192C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z";

export function GetAppSection() {
  return (
    <section
      id="get-app"
      className="relative z-10 flex min-h-[650px] scroll-mt-24 flex-col items-center overflow-hidden bg-brand-1 pt-16 sm:min-h-[700px] sm:scroll-mt-28 sm:pt-24 lg:min-h-[720px] lg:pt-32"
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image
          src="/illustrations/get-app-bg.jpg"
          alt=""
          fill
          className="object-cover object-top opacity-30 mix-blend-multiply"
          sizes="100vw"
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 z-10 w-full" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          className="h-auto min-w-[1440px] w-full translate-y-64 fill-brand-3 opacity-90"
        >
          <path d={WAVE} />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 z-[15] w-full" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          className="h-auto min-w-[1440px] w-full translate-y-48 fill-brand-4"
        >
          <path d={WAVE} />
        </svg>
      </div>

      <div className="get-app-phone-pop relative z-20 mx-auto mt-4 flex w-full max-w-5xl justify-center pt-6 pb-12 sm:mt-0 sm:pb-20 lg:pb-32">
        {/* Native img keeps PNG alpha — next/image was flattening it to white. */}
        <img
          src="/hero/get-app-phone.png"
          alt={`${brand.name} app`}
          width={864}
          height={1152}
          className="relative h-auto w-[150px] bg-transparent object-contain drop-shadow-2xl sm:w-[28%] lg:w-[22%]"
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 z-[25] w-full" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          className="h-auto min-w-[1440px] w-full translate-y-32 fill-brand-5"
        >
          <path d="M0,256L48,229.3C96,203,192,149,288,144C384,139,480,181,576,197.3C672,213,768,203,864,186.7C960,171,1056,149,1152,149.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute bottom-0 z-30 w-full" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          className="h-auto min-w-[1440px] w-full translate-y-16 fill-brand-4"
        >
          <path d="M0,128L40,149.3C80,171,160,213,240,213.3C320,213,400,171,480,170.7C560,171,640,213,720,229.3C800,245,880,235,960,202.7C1040,171,1120,117,1200,106.7C1280,96,1360,128,1400,144L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z" />
        </svg>
      </div>

      <div className="relative z-40 mx-auto mb-16 mt-[-15%] w-[80vw] max-w-md overflow-hidden rounded-[28px] bg-white p-6 text-center shadow-xl sm:w-[55%] lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: `
              linear-gradient(160deg, #ffffff 0%, color-mix(in oklab, var(--brand-1) 80%, white) 55%, color-mix(in oklab, var(--brand-2) 55%, white) 100%)
            `,
          }}
        />
        <h2 className="mb-2 text-[22px] font-extrabold tracking-tight text-foreground lg:text-[26px]">
          Get the app
        </h2>
        <p className="mx-auto mb-6 max-w-md px-2 text-sm font-medium leading-relaxed text-foreground/70">
          Install {brand.name} for faster access, a home-screen icon, and nearby
          tasks without the browser chrome.
        </p>
        <InstallButton
          label="Install App"
          className="w-full bg-brand-4 text-foreground shadow-md hover:bg-brand-3 sm:w-auto"
        />
      </div>

      <div className="pointer-events-none absolute bottom-0 z-50 w-full" aria-hidden>
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          className="h-auto min-w-[1440px] w-full translate-y-px fill-[#171717]"
        >
          <path d={WAVE} />
        </svg>
      </div>
    </section>
  );
}
