import { useState } from "react";
import {
  ALL_ACTIVITIES,
  ACTIVITY_LABELS,
  calculateRisk,
  fullDayLabel,
  fmtDate
} from "../constants/weatherData";

import { ConditionIcon } from "../components/ConditionIcon";
import { RiskBadge } from "../components/RiskBadge";

export function DayForecast({ forecast }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const activeDay = forecast[selectedDay];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          7-Day Operational Window
        </h1>
        <p className="text-slate-500 text-sm">
          Select a day to evaluate site-wide operational parameter risks.
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 overflow-x-auto pb-2">
        {forecast.map((day, idx) => {
          const mainRisk = Math.max(
            ...ALL_ACTIVITIES.map((a) => calculateRisk(a, day).score)
          );

          const level =
            mainRisk >= 75
              ? "critical"
              : mainRisk >= 50
              ? "high"
              : mainRisk >= 25
              ? "medium"
              : "safe";

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`p-3 rounded-xl border transition flex flex-col items-center text-center min-w-[75px] ${
                selectedDay === idx
                  ? "border-slate-900 bg-white shadow-md ring-1 ring-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="text-xs text-slate-500 font-medium">
                {fullDayLabel(day.date, idx)}
              </span>

              <span className="text-[11px] text-slate-400 mb-2">
                {fmtDate(day.date).split(" ").slice(1).join(" ")}
              </span>

              <ConditionIcon condition={day.condition} size={20} />

              <span className="text-sm font-semibold mt-2 font-mono">
                {day.tempHigh}°
              </span>

              <span
                className="text-[9px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor:
                    level === "critical"
                      ? "#FEF2F2"
                      : level === "high"
                      ? "#FFF7ED"
                      : level === "medium"
                      ? "#FFFBEB"
                      : "#F0FDF4",
                  color:
                    level === "critical"
                      ? "#EF4444"
                      : level === "high"
                      ? "#F97316"
                      : level === "medium"
                      ? "#F59E0B"
                      : "#22C55E"
                }}
              >
                {level}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Risk Manifest for {fmtDate(activeDay.date)}
        </h3>

        <div className="divide-y divide-slate-100">
          {ALL_ACTIVITIES.map((act) => {
            const risk = calculateRisk(act, activeDay);

            return (
              <div
                key={act}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {ACTIVITY_LABELS[act]}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {risk.recommendation}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    Score: {risk.score}
                  </span>
                  <RiskBadge level={risk.level} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}