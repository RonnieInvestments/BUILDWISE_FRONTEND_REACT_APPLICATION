export const PROJECTS = [
  { id: "p1", name: "Alpha Site", location: "Houston, TX", type: "Commercial" },
  { id: "p2", name: "Beta Infrastructure", location: "Miami, FL", type: "Infrastructure" }
];

export const ACTIVITY_LABELS = {
  concrete_pouring: "Concrete Pouring",
  roofing: "Roofing",
  earthworks: "Earthworks",
  excavation: "Excavation",
  crane_operations: "Crane Operations",
  steel_erection: "Steel Erection",
  exterior_painting: "Exterior Painting",
};

export const ALL_ACTIVITIES = [
  "concrete_pouring", "roofing", "earthworks", "excavation",
  "crane_operations", "steel_erection", "exterior_painting",
];

export const RISK_COLORS = {
  safe: "#22C55E",
  medium: "#F59E0B",
  high: "#F97316",
  critical: "#EF4444",
};

export const RISK_BG = {
  safe: "#F0FDF4",
  medium: "#FFFBEB",
  high: "#FFF7ED",
  critical: "#FEF2F2",
};

export const RISK_LABELS = {
  safe: "Safe",
  medium: "Medium Risk",
  high: "High Risk",
  critical: "Critical",
};

export function buildForecast() {
  const base = [
    { tempHigh: 26, tempLow: 18, tempCurrent: 23, humidity: 62, windSpeed: 11, windGust: 16, precipitation: 0, condition: "partly_cloudy", uvIndex: 7, visibility: 12, description: "Partly cloudy with a gentle breeze" },
    { tempHigh: 21, tempLow: 16, tempCurrent: 19, humidity: 82, windSpeed: 19, windGust: 28, precipitation: 9.5, condition: "rain", uvIndex: 2, visibility: 6, description: "Heavy rain showers throughout the day" },
    { tempHigh: 17, tempLow: 14, tempCurrent: 15, humidity: 91, windSpeed: 34, windGust: 47, precipitation: 18.2, condition: "storm", uvIndex: 1, visibility: 3, description: "Severe storm — site safety warning" },
    { tempHigh: 22, tempLow: 17, tempCurrent: 20, humidity: 74, windSpeed: 14, windGust: 20, precipitation: 1.8, condition: "cloudy", uvIndex: 4, visibility: 9, description: "Overcast with occasional drizzle" },
    { tempHigh: 29, tempLow: 19, tempCurrent: 26, humidity: 54, windSpeed: 7, windGust: 11, precipitation: 0, condition: "sunny", uvIndex: 9, visibility: 15, description: "Clear skies and excellent visibility" },
    { tempHigh: 31, tempLow: 20, tempCurrent: 28, humidity: 51, windSpeed: 6, windGust: 9, precipitation: 0, condition: "sunny", uvIndex: 10, visibility: 16, description: "Hot and sunny — ideal work window" },
    { tempHigh: 27, tempLow: 18, tempCurrent: 24, humidity: 63, windSpeed: 10, windGust: 15, precipitation: 0, condition: "partly_cloudy", uvIndex: 7, visibility: 13, description: "Comfortable conditions with light cloud" },
  ];

  const today = new Date();

  return base.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return { ...d, date };
  });
}

export function calculateRisk(activity, w) {
  let score = 0;
  const reasons = [];
  let recommendation = "";

  if (w.condition === "storm") {
    score += 50;
    reasons.push("Active storm conditions — immediate site hazard");
  }

  switch (activity) {
    case "concrete_pouring":
      if (w.tempHigh > 35) { score += 30; reasons.push(`High temp ${w.tempHigh}°C accelerates curing, reduces strength`); }
      if (w.tempLow < 5) { score += 35; reasons.push(`Low temp ${w.tempLow}°C risks freeze damage to fresh mix`); }
      else if (w.tempLow < 10) { score += 15; reasons.push(`Cool temp ${w.tempLow}°C — use warm water in mix`); }
      if (w.precipitation > 5) { score += 30; reasons.push(`Heavy rain ${w.precipitation}mm dilutes and washes surface`); }
      else if (w.precipitation > 1) { score += 15; reasons.push(`Rain ${w.precipitation}mm may affect surface finish`); }
      if (w.humidity > 85) { score += 10; reasons.push(`High humidity ${w.humidity}% slows curing`); }
      if (w.windSpeed > 25) { score += 15; reasons.push("Strong wind causes rapid surface evaporation"); }
      if (score < 25) recommendation = "Good conditions. Proceed with standard mix and curing protocol.";
      else if (score < 50) recommendation = "Use retarding admixtures. Cover pours immediately after placing.";
      else if (score < 75) recommendation = "Delay if possible. If proceeding, use fiber reinforcement and plastic sheeting.";
      else recommendation = "Do not pour today. Reschedule when temperature and rain allow.";
      break;

    case "roofing":
      if (w.windSpeed > 20) { score += 50; reasons.push(`Wind ${w.windSpeed}mph exceeds 20mph safe roofing limit`); }
      else if (w.windSpeed > 12) { score += 25; reasons.push(`Wind ${w.windSpeed}mph — verify all safety harness anchors`); }
      if (w.precipitation > 0.5) { score += 40; reasons.push(`Rain ${w.precipitation}mm creates slippery roof surfaces`); }
      else if (w.precipitation > 0) { score += 20; reasons.push("Trace moisture — slip hazard on pitched surfaces"); }
      if (w.tempLow < 2) { score += 35; reasons.push("Near-freezing temp — roofing materials brittle"); }
      if (score < 25) recommendation = "Safe to work. Apply standard fall-arrest systems.";
      else if (score < 50) recommendation = "Proceed with caution. Double-check all anchor points.";
      else if (score < 75) recommendation = "Suspend at-height work. Ground-level prep only.";
      else recommendation = "All roofing suspended. Wind/rain risk is unacceptable.";
      break;

    case "earthworks":
      if (w.precipitation > 10) { score += 40; reasons.push(`Heavy rain ${w.precipitation}mm causes ground instability`); }
      else if (w.precipitation > 3) { score += 20; reasons.push(`Moderate rain ${w.precipitation}mm softens bearing strata`); }
      if (w.tempLow < 0) { score += 25; reasons.push("Frozen ground affects compaction and load-bearing"); }
      if (w.humidity > 88) { score += 10; reasons.push(`Saturated soil ${w.humidity}% — compaction unreliable`); }
      if (w.windSpeed > 40) { score += 15; reasons.push("High wind creates dust hazard and visibility issues"); }
      if (score < 25) recommendation = "Proceed normally. Standard compaction testing applies.";
      else if (score < 50) recommendation = "Test moisture content before compaction. Allow drainage.";
      else if (score < 75) recommendation = "Halt compaction. Remove water, allow 24h drainage.";
      else recommendation = "Suspend all earthworks. Ground conditions unsafe for machinery.";
      break;

    case "excavation":
      if (w.precipitation > 15) { score += 45; reasons.push(`Severe rain ${w.precipitation}mm risks trench collapse`); }
      else if (w.precipitation > 5) { score += 25; reasons.push(`Rain ${w.precipitation}mm weakens trench walls`); }
      if (w.windSpeed > 40) { score += 20; reasons.push("High wind affects shoring equipment stability"); }
      if (w.visibility < 4) { score += 15; reasons.push(`Visibility ${w.visibility}mi — machinery safety hazard`); }
      if (score < 25) recommendation = "Proceed. Inspect trench walls every 2 hours.";
      else if (score < 50) recommendation = "Increase shoring depth. Monitor groundwater levels.";
      else if (score < 75) recommendation = "Halt deep excavation. Shore existing trenches now.";
      else recommendation = "Evacuate trenches immediately. Do not resume until assessed.";
      break;

    case "crane_operations":
      if (w.windSpeed > 20) { score += 65; reasons.push(`Wind ${w.windSpeed}mph critically exceeds 20mph crane limit`); }
      else if (w.windSpeed > 15) { score += 40; reasons.push(`Wind ${w.windSpeed}mph approaching crane operational limit`); }
      else if (w.windSpeed > 10) { score += 15; reasons.push(`Moderate wind ${w.windSpeed}mph — monitor gusts`); }
      if (w.windGust > 25) { score += 20; reasons.push(`Gusts ${w.windGust}mph — sudden load swing risk`); }
      if (w.visibility < 5) { score += 30; reasons.push(`Visibility ${w.visibility}mi — signaller communication impaired`); }
      if (w.condition === "rain") { score += 10; reasons.push("Rain affects operator visibility and load security"); }
      if (score < 25) recommendation = "Full crane operations authorized. Standard lift plan applies.";
      else if (score < 50) recommendation = "Reduce max lift 20%. Assign dedicated wind spotter.";
      else if (score < 75) recommendation = "Short pre-planned lifts only. Brief all riggers on abort conditions.";
      else recommendation = "All cranes grounded. Lower boom and secure immediately.";
      break;

    case "steel_erection":
      if (w.windSpeed > 25) { score += 55; reasons.push(`Wind ${w.windSpeed}mph makes handling steel sections dangerous`); }
      else if (w.windSpeed > 15) { score += 30; reasons.push(`Strong wind ${w.windSpeed}mph — beam stability risk during erection`); }
      if (w.precipitation > 1) { score += 25; reasons.push("Wet steel surfaces — fall and connection hazards"); }
      if (w.tempLow < 0) { score += 20; reasons.push("Sub-zero temp risks brittle fracture in structural steel"); }
      if (w.visibility < 6) { score += 15; reasons.push("Poor visibility affects alignment and bolting accuracy"); }
      if (score < 25) recommendation = "Proceed with erection. Standard torque and connection checks.";
      else if (score < 50) recommendation = "Use taglines on all members. Increase inspection points.";
      else if (score < 75) recommendation = "Suspend column erection. Bolting and small components only.";
      else recommendation = "Stop all steel erection. Critical fall and structural risk.";
      break;

    case "exterior_painting":
      if (w.humidity > 85) { score += 45; reasons.push(`Humidity ${w.humidity}% prevents paint adhesion and drying`); }
      else if (w.humidity > 70) { score += 20; reasons.push(`Humidity ${w.humidity}% may cause blistering`); }
      if (w.tempHigh < 10) { score += 35; reasons.push(`Temp ${w.tempHigh}°C below minimum paint application temperature`); }
      if (w.tempHigh > 38) { score += 25; reasons.push(`Heat ${w.tempHigh}°C causes solvent flash and brush marks`); }
      if (w.precipitation > 0) { score += 50; reasons.push("Any rain ruins fresh paint applications"); }
      if (w.windSpeed > 15) { score += 20; reasons.push("Wind causes uneven application and contamination"); }
      if (score < 25) recommendation = "Ideal painting conditions. Apply full coats as scheduled.";
      else if (score < 50) recommendation = "Apply thin coat. Avoid direct sun on dark surfaces.";
      else if (score < 75) recommendation = "Interior/sheltered painting only. Protect outdoor surfaces.";
      else recommendation = "No exterior painting. Rain or humidity will destroy any coating.";
      break;
  }

  score = Math.min(100, score);
  const level = score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "safe";
  return { score, level, reasons, recommendation };
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FULL_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function fmtDate(d) {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function fullDayLabel(d, idx) {
  if (idx === 0) return "Today";
  if (idx === 1) return "Tomorrow";
  return FULL_DAYS[d.getDay()];
}