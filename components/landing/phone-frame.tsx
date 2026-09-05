import { cn } from "@/lib/utils";

const widths = {
  sm: "w-[220px] sm:w-[240px]",
  md: "w-[260px] sm:w-[280px]",
  lg: "w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-[420px]",
};

export function PhoneFrame({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof widths;
}) {
  return (
    <div className={cn("relative mx-auto", widths[size], className)}>
      <div className="rounded-[2.6rem] bg-zinc-900 p-[8px] shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:rounded-[2.8rem] sm:p-[9px] lg:rounded-[3rem] lg:p-[10px]">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-primary sm:rounded-[2.25rem] lg:rounded-[2.4rem]">
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-2.5">
            <span className="h-5 w-20 rounded-full bg-zinc-900/90 sm:h-6 sm:w-24" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
