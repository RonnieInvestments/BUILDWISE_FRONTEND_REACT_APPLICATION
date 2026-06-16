export const WeatherCondition = "sunny" | "partly_cloudy" | "cloudy" | "rain" | "storm" | "snow" | "fog";
export const RiskLevel = "safe" | "medium" | "high" | "critical";
export const Page = "overview" | "window" | "planner" | "calculator";

export const ActivityType =
  "concrete_pouring" | "roofing" | "earthworks" | "excavation" |
  "crane_operations" | "steel_erection" | "exterior_painting";

export const WeatherDay = {
  date: Date,
  tempHigh: Number,
  tempLow: Number,
  tempCurrent: Number,
  humidity: Number,
  windSpeed: Number,
  windGust: Number,
  precipitation: Number,
  condition: WeatherCondition,
  uvIndex: Number,
  visibility: Number,
  description: String,
};

export const Project = {
  id: String,
  name: String,
  location: String,
  type: String,
  completion: Number,
};

export const ActivityPlan = {
  id: String,
  activity: ActivityType,
  dayIndex: Number,
  createdAt: Date,
};

export const RiskResult = {
  score: Number,
  level: RiskLevel,
  reasons: Array,
  recommendation: String,
};