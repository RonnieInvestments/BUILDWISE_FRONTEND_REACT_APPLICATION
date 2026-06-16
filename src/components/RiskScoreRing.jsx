import { RISK_COLORS } from "../constants/weatherData";

export function RiskScoreRing({ score, level }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
      <svg className="rotate-[-90deg]" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={RISK_COLORS[level]}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-2xl font-bold"
          style={{ color: RISK_COLORS[level] }}
        >
          {score}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Risk
        </span>
      </div>
    </div>
  );
}