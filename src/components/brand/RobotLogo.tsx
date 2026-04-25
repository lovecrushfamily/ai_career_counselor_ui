import { cn } from "@/lib/utils";

interface RobotLogoProps {
  className?: string;
  /** Wrap trong khung gradient + glow như avatar */
  framed?: boolean;
}

/**
 * SVG đầu robot — trợ lý thông minh phân tích job market.
 * Antenna + glow dot, mắt LED, "data line" trên trán.
 */
export const RobotLogo = ({ className, framed = true }: RobotLogoProps) => {
  const svg = (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5", framed ? "text-primary-foreground" : "text-primary")}
      aria-hidden="true"
    >
      {/* Antenna */}
      <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="3" r="1.6" fill="currentColor" />
      {/* Head */}
      <rect x="6" y="8" width="20" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
      {/* Eyes (LED) */}
      <circle cx="12" cy="15.5" r="1.7" fill="currentColor" />
      <circle cx="20" cy="15.5" r="1.7" fill="currentColor" />
      {/* Data line / smile bar */}
      <path d="M11 19.5 L13 19.5 L14.5 18.2 L17.5 20.5 L19 19.5 L21 19.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Side ports */}
      <line x1="4" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="4" y1="18" x2="6" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="26" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="26" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Neck */}
      <line x1="14" y1="24" x2="14" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="18" y1="24" x2="18" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );

  if (!framed) return svg;

  return (
    <div className={cn("relative inline-flex items-center justify-center rounded-lg bg-gradient-data shadow-glow", className ?? "h-8 w-8")}>
      {svg}
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent border-2 border-background animate-pulse-dot" />
    </div>
  );
};