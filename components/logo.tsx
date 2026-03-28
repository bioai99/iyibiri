interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon";
  className?: string;
}

const sizes = {
  sm:  { icon: 28,  text: "text-sm",   gap: "gap-1.5" },
  md:  { icon: 38,  text: "text-base", gap: "gap-2"   },
  lg:  { icon: 52,  text: "text-xl",   gap: "gap-2.5" },
  xl:  { icon: 88,  text: "text-3xl",  gap: "gap-3"   },
};

export default function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const { icon, text, gap } = sizes[size];

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* SVG Icon */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="İyiBiri logo"
      >
        <defs>
          <linearGradient id={`pg-${size}`} x1="50" y1="8" x2="50" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F9C355" />
            <stop offset="100%" stopColor="#E8901A" />
          </linearGradient>
        </defs>

        {/* Head */}
        <circle cx="50" cy="27" r="17" fill={`url(#pg-${size})`} />

        {/* Body — dome shape (shoulders/torso) */}
        <path
          d="M14 88 Q14 54 50 54 Q86 54 86 88 Z"
          fill={`url(#pg-${size})`}
        />

        {/* Heart on chest */}
        <path
          d="M50 80
             C50 80 38 71 38 64
             C38 59.5 41.5 57 45 57
             C47.5 57 50 59.5 50 59.5
             C50 59.5 52.5 57 55 57
             C58.5 57 62 59.5 62 64
             C62 71 50 80 50 80 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Verification badge — bottom right of body */}
        <g transform="translate(60, 60)">
          {/* Outer sunburst ring */}
          <circle cx="18" cy="18" r="17" fill="#1B3A5C" />
          {/* Spike rays */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 18 + 13 * Math.cos(angle);
            const y1 = 18 + 13 * Math.sin(angle);
            const x2 = 18 + 17 * Math.cos(angle);
            const y2 = 18 + 17 * Math.sin(angle);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B3A5C" strokeWidth="3" strokeLinecap="round" />
            );
          })}
          {/* Inner circle */}
          <circle cx="18" cy="18" r="12" fill="#1B3A5C" />
          {/* Checkmark */}
          <path
            d="M11 18 L16 23 L25 13"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Wordmark */}
      {variant === "full" && (
        <span
          className={`font-bold ${text}`}
          style={{ color: "#1B3A5C", letterSpacing: "-0.01em" }}
        >
          İyiBiri
        </span>
      )}
    </div>
  );
}
