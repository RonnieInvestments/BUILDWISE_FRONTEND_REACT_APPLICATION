import { useMemo } from "react";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  CloudRain
} from "lucide-react";

import {
  ALL_ACTIVITIES,
  ACTIVITY_LABELS,
  RISK_BG,
  RISK_COLORS,
  RISK_LABELS,
  calculateRisk,
  fmtDate
} from "../constants/weatherData";

import { RiskBadge } from "../components/RiskBadge";
import { ConditionIcon } from "../components/ConditionIcon";

export function SiteOverview({ project, forecast }) {
  const today = forecast[0];

  const allRisks = useMemo(
    () =>
      ALL_ACTIVITIES.map((a) => ({
        activity: a,
        ...calculateRisk(a, today)
      })),
    [today]
  );

  const counts = useMemo(() => {
    const c = { safe: 0, medium: 0, high: 0, critical: 0 };
    allRisks.forEach((r) => c[r.level]++);
    return c;
  }, [allRisks]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {project.name}
          </h1>

          <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
            <MapPin size={13} />
            <span>
              {project.location} · {project.type}
            </span>
          </div>
        </div>
      </div>

      {/* Current conditions template banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap gap-6 items-start justify-between">
          <div>
            <p className="text-white/60 text-sm uppercase tracking-widest mb-1">
              Current Conditions
            </p>

            <div className="flex items-center gap-4">
              <ConditionIcon
                condition={today.condition}
                size={52}
              />

              <div>
                <div className="font-mono text-6xl font-bold text-white leading-none">
                  {today.tempCurrent}°C
                </div>
                <div className="text-white/70 mt-1 capitalize">
                  {today.description}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-5">
              {[
                {
                  icon: <Thermometer size={14} />,
                  label: "High / Low",
                  val: `${today.tempHigh}° / ${today.tempLow}°`
                },
                {
                  icon: <Droplets size={14} />,
                  label: "Humidity",
                  val: `${today.humidity}%`
                },
                {
                  icon: <Wind size={14} />,
                  label: "Wind",
                  val: `${today.windSpeed} mph`
                },
                {
                  icon: <Eye size={14} />,
                  label: "Visibility",
                  val: `${today.visibility} mi`
                },
                {
                  icon: <CloudRain size={14} />,
                  label: "Precipitation",
                  val: `${today.precipitation} mm`
                }
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center gap-1 text-white/50 text-xs mb-0.5">
                    {m.icon}
                    {m.label}
                  </div>
                  <div className="font-mono font-semibold text-sm text-white">
                    {m.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/50 text-xs mb-1">
              {fmtDate(today.date)}
            </p>
            <p className="text-white/40 text-xs">
              UV Index {today.uvIndex} · Gusts {today.windGust} mph
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["safe", "medium", "high", "critical"].map((level) => (
          <div
            key={level}
            className="rounded-xl border p-4"
            style={{
              backgroundColor: RISK_BG[level],
              borderColor: RISK_COLORS[level] + "33"
            }}
          >
            <div
              className="font-mono text-3xl font-bold"
              style={{ color: RISK_COLORS[level] }}
            >
              {counts[level]}
            </div>

            <div
              className="text-sm font-semibold mt-0.5"
              style={{ color: RISK_COLORS[level] }}
            >
              {RISK_LABELS[level]}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          Activity Risk Assessment — Today
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {allRisks.map((r) => (
            <div
              key={r.activity}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-sm text-slate-900">
                  {ACTIVITY_LABELS[r.activity]}
                </span>
                <RiskBadge level={r.level} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${r.score}%`,
                        backgroundColor: RISK_COLORS[r.level]
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold">
                    {r.score}%
                  </span>
                </div>

                {r.reasons.length > 0 && (
                  <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                    {r.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                )}

                <p className="text-xs italic text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                  {r.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}