type Props = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 28, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="lg-acid" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
        <filter id="lg-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="lg-pulse" cx="0.5" cy="0.5" r="0.5">
          <stop stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* hex container */}
      <path
        d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
        fill="#0f120f"
        stroke="#2a302a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ambient glow inside hex */}
      <circle cx="24" cy="24" r="16" fill="url(#lg-pulse)" />

      {/* broken circuit board lines */}
      <path d="M10 16 L16 16 L16 12" stroke="#2a302a" strokeWidth="1" strokeLinecap="round" />
      <path d="M38 16 L32 16 L32 12" stroke="#2a302a" strokeWidth="1" strokeLinecap="round" />
      <path d="M10 32 L16 32 L16 36" stroke="#2a302a" strokeWidth="1" strokeLinecap="round" />
      <path d="M38 32 L32 32 L32 36" stroke="#2a302a" strokeWidth="1" strokeLinecap="round" />

      {/* circuit nodes at corners */}
      <circle cx="16" cy="12" r="1.5" fill="#2a302a" />
      <circle cx="32" cy="12" r="1.5" fill="#2a302a" />
      <circle cx="16" cy="36" r="1.5" fill="#2a302a" />
      <circle cx="32" cy="36" r="1.5" fill="#2a302a" />

      {/* power arc — bold, open at top = circuit broken */}
      <path
        d="M15 20 A12 12 0 1 0 33 20"
        stroke="url(#lg-acid)"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#lg-glow)"
      />

      {/* power stem */}
      <path
        d="M24 9 L24 24"
        stroke="url(#lg-acid)"
        strokeWidth="4.5"
        strokeLinecap="round"
        filter="url(#lg-glow)"
      />

      {/* spark burst — energy escaping the break */}
      <path d="M19 7 L15 3" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
      <path d="M29 7 L33 3" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M24 4 L24 1" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* crack lines radiating from the break */}
      <path d="M22 10 L19 14" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
      <path d="M26 10 L29 14" stroke="#22d3ee" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark
        size={size}
        className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]"
      />
      <span className="flex flex-col leading-none">
        <span className="text-base font-bold tracking-tight text-fg transition-colors group-hover:text-acid">
          can<span className="text-acid">i</span>turn
          <span className="text-acid">i</span>toff
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-dim">
          the off switch database
        </span>
      </span>
    </span>
  );
}
