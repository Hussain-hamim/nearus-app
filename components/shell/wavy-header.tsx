export function WavyHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={`relative bg-primary pt-safe ${className}`}>
      <div className="relative z-10 px-5 pb-8 pt-4 md:px-0">{children}</div>
      <svg
        className="absolute inset-x-0 bottom-0 h-7 w-full text-background"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 24c180 18 360-18 540-6s360 30 540 12 270-24 360-18v36H0V24Z"
        />
      </svg>
    </header>
  );
}
