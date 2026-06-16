import { useState } from "react";
import { Plus, Trash2, Calendar } from "lucide-react";

import {
  ALL_ACTIVITIES,
  ACTIVITY_LABELS,
  calculateRisk,
  fmtDate,
  fullDayLabel
} from "../constants/weatherData";

import { RiskBadge } from "../components/RiskBadge";

export function ActivityPlanner({ forecast }) {
  const [plans, setPlans] = useState([
    { id: "1", activity: "concrete_pouring", dayIndex: 0, createdAt: new Date() },
    { id: "2", activity: "crane_operations", dayIndex: 4, createdAt: new Date() }
  ]);

  const [activity, setActivity] = useState("concrete_pouring");
  const [dayIdx, setDayIdx] = useState(0);

  function handleAdd() {
    const newPlan = {
      id: crypto.randomUUID(),
      activity,
      dayIndex: Number(dayIdx),
      createdAt: new Date()
    };

    setPlans([...plans, newPlan]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Task Scheduler Planner
        </h1>
        <p className="text-slate-500 text-sm">
          Schedule workflows matching risk mitigation allowances window.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 grid gap-4 sm:grid-cols-3 items-end shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
            Select Discipline
          </label>

          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
          >
            {ALL_ACTIVITIES.map((a) => (
              <option key={a} value={a}>
                {ACTIVITY_LABELS[a]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
            Target Schedule Window
          </label>

          <select
            value={dayIdx}
            onChange={(e) => setDayIdx(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg p-2 text-sm"
          >
            {forecast.map((d, idx) => (
              <option key={idx} value={idx}>
                {fullDayLabel(d.date, idx)} ({fmtDate(d.date)})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-slate-800 transition"
        >
          <Plus size={16} /> Add to Schedule
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
              <th className="p-4">Discipline Title</th>
              <th className="p-4">Assigned Workdate</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {plans.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No operations currently arranged.
                </td>
              </tr>
            ) : (
              plans.map((p) => {
                const weather = forecast[p.dayIndex];
                const risk = calculateRisk(p.activity, weather);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-semibold text-slate-900">
                      {ACTIVITY_LABELS[p.activity]}
                    </td>

                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {fmtDate(weather.date)}
                      </div>
                    </td>

                    <td className="p-4">
                      <RiskBadge level={risk.level} />
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() =>
                          setPlans(plans.filter((item) => item.id !== p.id))
                        }
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}