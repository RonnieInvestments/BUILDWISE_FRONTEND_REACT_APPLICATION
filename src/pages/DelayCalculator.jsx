import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

import { Clock, TrendingUp } from "lucide-react";

import {
  ALL_ACTIVITIES,
  calculateRisk,
  fullDayLabel,
  RISK_COLORS
} from "../constants/weatherData";

export function DelayCalculator({ forecast }) {
  const chartData = useMemo(() => {
    return forecast.map((day, idx) => {
      let delayHours = 0;

      ALL_ACTIVITIES.forEach((act) => {
        const risk = calculateRisk(act, day);

        if (risk.level === "critical") delayHours += 3.5;
        else if (risk.level === "high") delayHours += 1.5;
      });

      const cumulativeRiskScore = Math.round(
        ALL_ACTIVITIES.reduce(
          (acc, act) => acc + calculateRisk(act, day).score,
          0
        ) / ALL_ACTIVITIES.length
      );

      return {
        name: fullDayLabel(day.date, idx),
        "Delay Exposure (Hrs)": Number(Math.min(8, delayHours).toFixed(1)),
        riskScore: cumulativeRiskScore
      };
    });
  }, [forecast]);

  const totalProjectedDelays = useMemo(() => {
    return chartData.reduce(
      (acc, curr) => acc + curr["Delay Exposure (Hrs)"],
      0
    );
  }, [chartData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Project Delay Risk Matrix
        </h1>
        <p className="text-slate-500 text-sm">
          Algorithmic weather parameter calculation engine forecasting
          structural downtime hours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-red-50 text-red-500">
            <Clock size={24} />
          </div>

          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {totalProjectedDelays.toFixed(1)} Hrs
            </div>
            <div className="text-xs text-slate-500 font-medium uppercase">
              Total Standby Labor Exposure
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="p-3 rounded-lg bg-amber-50 text-amber-500">
            <TrendingUp size={24} />
          </div>

          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono">
              {(
                totalProjectedDelays * 380
              ).toLocaleString("en-KE", {
                style: "currency",
                currency: "KES"
              })}
            </div>

            <div className="text-xs text-slate-500 font-medium uppercase">
              Estimated Operational Deficit Variance
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-md font-bold text-slate-900 mb-4">
          Projected Daily Downtime Allocation
        </h3>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
              />
              <Tooltip />

              <Bar
                dataKey="Delay Exposure (Hrs)"
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => {
                  const color =
                    entry.riskScore > 65
                      ? RISK_COLORS.critical
                      : entry.riskScore > 40
                      ? RISK_COLORS.high
                      : RISK_COLORS.safe;

                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={color}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}