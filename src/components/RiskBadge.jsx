import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { RISK_BG, RISK_COLORS, RISK_LABELS } from "../constants/weatherData";

export function RiskBadge({ level }) {
  const icons = {
    safe: <CheckCircle size={12} />,
    medium: <AlertTriangle size={12} />,
    high: <AlertTriangle size={12} />,
    critical: <XCircle size={12} />,
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: RISK_BG[level],
        color: RISK_COLORS[level],
      }}
    >
      {icons[level]}
      {RISK_LABELS[level]}
    </span>
  );
}