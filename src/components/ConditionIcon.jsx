import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudDrizzle } from "lucide-react";

export function ConditionIcon({ condition, size = 24 }) {
  const map = {
    sunny: <Sun size={size} className="text-amber-400" />,
    partly_cloudy: <Cloud size={size} className="text-slate-400" />,
    cloudy: <Cloud size={size} className="text-slate-500" />,
    rain: <CloudRain size={size} className="text-blue-400" />,
    storm: <CloudLightning size={size} className="text-purple-500" />,
    snow: <Snowflake size={size} className="text-blue-200" />,
    fog: <CloudDrizzle size={size} className="text-slate-300" />,
  };

  return <>{map[condition] || <Sun size={size} />}</>;
}