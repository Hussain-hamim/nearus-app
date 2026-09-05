/** Full-bleed neighborhood map plane — visual anchor for the landing hero. */
export function HeroNeighborhood() {
  return (
    <div className="hero-neighborhood relative w-full max-w-4xl" aria-hidden>
      <svg
        viewBox="0 0 800 360"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        {/* Soft terrain bands */}
        <path
          d="M0 220 C120 180 220 250 340 210 C460 170 520 250 640 200 C720 170 760 190 800 175 L800 360 L0 360 Z"
          fill="url(#heroTerrain)"
          opacity="0.9"
        />
        <path
          d="M0 260 C140 230 260 290 400 255 C540 220 620 290 800 250 L800 360 L0 360 Z"
          fill="#eef2ff"
          opacity="0.55"
        />

        {/* Road network */}
        <g stroke="#a5b4fc" strokeOpacity="0.35" strokeWidth="1.5">
          <path d="M40 300 C180 270 280 320 400 290 C520 260 620 310 760 280" />
          <path d="M120 340 C250 300 350 340 480 310 C600 280 680 320 740 300" />
          <path d="M200 200 C240 250 280 280 320 320" strokeDasharray="4 6" />
          <path d="M480 190 C520 240 560 270 620 330" strokeDasharray="4 6" />
          <path d="M360 180 C380 230 400 270 410 340" strokeDasharray="4 6" />
        </g>

        {/* You-are-here pulse */}
        <g transform="translate(400 250)">
          <circle className="hero-pulse" r="54" fill="#a5b4fc" fillOpacity="0.12" />
          <circle className="hero-pulse hero-pulse-delay" r="36" fill="#a5b4fc" fillOpacity="0.18" />
          <circle r="10" fill="#a5b4fc" />
          <circle r="4" fill="#0c1020" />
        </g>

        {/* City pins */}
        <g>
          <Pin x={160} y={210} label="Kabul" />
          <Pin x={560} y={195} label="Herat" />
          <Pin x={280} y={155} label="Mazar" />
          <Pin x={640} y={255} label="Kandahar" />
        </g>

        <defs>
          <linearGradient id="heroTerrain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#eef2ff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Pin({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 -22 C-9 -22 -16 -15 -16 -6 C-16 6 0 22 0 22 C0 22 16 6 16 -6 C16 -15 9 -22 0 -22 Z"
        fill="#818cf8"
      />
      <circle cy={-8} r="5" fill="#0c1020" />
      <text
        y={36}
        textAnchor="middle"
        fill="#f8fafc"
        fontSize="13"
        fontWeight="600"
        opacity="0.9"
      >
        {label}
      </text>
    </g>
  );
}
