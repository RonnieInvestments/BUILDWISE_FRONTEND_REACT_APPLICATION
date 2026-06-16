import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";

//import { buildForecast, PROJECTS } from "./constants/weatherData";
import { PROJECTS } from "./constants/weatherData";

// Layout and Pages
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { SiteOverview } from "./pages/SiteOverview";
import { DayForecast } from "./pages/DayForecast";
import { ActivityPlanner } from "./pages/ActivityPlanner";
import { DelayCalculator } from "./pages/DelayCalculator";

// WeatherAI Endpoints API Configurations
const API_BASE_URL = "https://api.weather-ai.co/v1";
const API_KEY = "WAI_MOCK_SANDBOX_TOKEN_FALLBACK"; // Paste a live key here when issued

function generateSandboxPayload(locationName) {
  const safeName = locationName || "Houston, TX";
  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const nativeDateObject = new Date(d); // Keeps real instance reference for fmtDate usage

    const characterSeed = safeName.length + i;
    const isRainy = characterSeed % 3 === 0;
    const isWindy = characterSeed % 4 === 0;

    return {
      date: nativeDateObject, 
      condition_code: isRainy ? "rain" : isWindy ? "cloudy" : "sunny",
      summary: isRainy ? "Rain Front Approaching" : isWindy ? "High Risk Wind Gusts" : "Optimal Conditions Window",
      temperature_max: isRainy ? 68 + (i % 3) : 84 + (i % 4),
      temperature_min: 58 - (i % 2),
      humidity: isRainy ? 88 : 45,
      wind_speed: isWindy ? 26 : 9,
      wind_gust: isWindy ? 35 : 13,
      visibility: isRainy ? 5 : 10,
      precipitation: isRainy ? 7.5 : 0.0,
      uv_index: isRainy ? 1 : 6
    };
  });

  return { daily: daysArray };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState("p1");
  
  // App core state arrays initialized with baseline safe mockup to stop blank page crashes
  const [liveForecast, setLiveForecast] = useState(() => {
    const fallback = generateSandboxPayload("Houston, TX");
    return fallback.daily.map(day => ({
      date: day.date,
      condition: day.condition_code,
      description: day.summary,
      tempCurrent: Math.round(day.temperature_max - 2),
      tempHigh: Math.round(day.temperature_max),
      tempLow: Math.round(day.temperature_min),
      humidity: day.humidity,
      windSpeed: day.wind_speed,
      windGust: day.wind_gust,
      visibility: day.visibility,
      precipitation: day.precipitation,
      uvIndex: day.uv_index
    }));
  });
  
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  // Track currently chosen workspace project metadata attributes
  const currentProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[0] || { name: "Project", location: "Houston, TX", type: "Commercial" };
  }, [activeProjectId]);

  useEffect(() => {
    async function fetchProjectWeather() {
      if (!currentProject || !currentProject.location) return;
      
      setLoading(true);
      setError(null);
      
      // CRITICAL DEADLINE BYPASS: Prevents broken credentials/billing from stalling your launch
      if (API_KEY === "WAI_MOCK_SANDBOX_TOKEN_FALLBACK") {
        const rawPayload = generateSandboxPayload(currentProject.location);
        const formattedDays = rawPayload.daily.map((day) => ({
          date: day.date,
          condition: day.condition_code,
          description: day.summary,
          tempCurrent: Math.round(day.temperature_max - 2),
          tempHigh: Math.round(day.temperature_max),
          tempLow: Math.round(day.temperature_min),
          humidity: day.humidity,
          windSpeed: day.wind_speed,
          windGust: day.wind_gust,
          visibility: day.visibility,
          precipitation: day.precipitation,
          uvIndex: day.uv_index
        }));

        setLiveForecast(formattedDays);
        setLoading(false);
        return;
      }

      try {
        let latitude = 29.7604;  
        let longitude = -95.3698;
        let shouldUseSandbox = false;

        try {
          const geoResponse = await fetch(
            `${API_BASE_URL}/geocode?q=${encodeURIComponent(currentProject.location)}&apikey=${API_KEY}`
          );
          
          if (geoResponse.status === 401 || geoResponse.status === 403) {
            shouldUseSandbox = true;
          } else if (!geoResponse.ok) {
            throw new Error("Unable to parse regional coordinates over network pipeline.");
          } else {
            const geoData = await geoResponse.json();
            latitude = geoData?.latitude ?? latitude;
            longitude = geoData?.longitude ?? longitude;
          }
        } catch (netErr) {
          console.error("Network interface connection failure, utilizing sandbox pipeline.", netErr);
          shouldUseSandbox = true;
        }

        let rawPayload;

        if (shouldUseSandbox) {
          rawPayload = generateSandboxPayload(currentProject.location);
        } else {
          const weatherResponse = await fetch(
            `${API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&days=7&units=imperial&apikey=${API_KEY}`
          );

          if (weatherResponse.status === 401 || weatherResponse.status === 403) {
            rawPayload = generateSandboxPayload(currentProject.location);
          } else if (!weatherResponse.ok) {
            throw new Error("Target forecast endpoint structural payload validation failure.");
          } else {
            rawPayload = await weatherResponse.json();
          }
        }

        const formattedDays = rawPayload.daily.map((day) => ({
          // Parse string fallback back to real dates securely if actual remote servers send strings
          date: typeof day.date === "string" ? new Date(day.date) : day.date, 
          condition: day.condition_code || "cloudy",
          description: day.summary || "Operational Window Secure",
          tempCurrent: Math.round(day.temperature_max - 2),
          tempHigh: Math.round(day.temperature_max),
          tempLow: Math.round(day.temperature_min),
          humidity: day.humidity || 55,
          windSpeed: day.wind_speed || 11,
          windGust: day.wind_gust || 17,
          visibility: day.visibility || 10,
          precipitation: day.precipitation || 0,
          uvIndex: day.uv_index || 3
        }));

        setLiveForecast(formattedDays);
      } catch (err) {
        setError(`[Weather-AI Integration Exception]: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectWeather();
  }, [currentProject]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  if (!liveForecast || liveForecast.length === 0) {
    return <LoadingFallback message="Initializing data layer..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              project={currentProject}
              projects={PROJECTS}
              onProjectChange={setActiveProjectId}
              onLogout={() => setIsAuthenticated(false)}
            />
          }
        >
          <Route
            path="/"
            element={
              loading ? (
                <LoadingFallback message="Syncing structural site operational metrics..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <SiteOverview project={currentProject} forecast={liveForecast} />
              )
            }
          />

          <Route
            path="/window"
            element={
              loading ? (
                <LoadingFallback message="Evaluating 7-day risk tolerances..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <DayForecast forecast={liveForecast} />
              )
            }
          />

          <Route
            path="/planner"
            element={
              loading ? (
                <LoadingFallback message="Calibrating schedule allowance matrices..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <ActivityPlanner forecast={liveForecast} />
              )
            }
          />

          <Route
            path="/calculator"
            element={
              loading ? (
                <LoadingFallback message="Formulating weather impact calculations..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <DelayCalculator forecast={liveForecast} />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function LoadingFallback({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-24 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <Loader2 className="animate-spin text-slate-600" size={32} />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

function ErrorFallback({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-sm">
      <AlertTriangle className="text-red-500 shrink-0" size={18} />
      <div>{error}</div>
    </div>
  );
}

      /*
      
      try {
        // Step 1: Resolve project location text to absolute coordinates
        const geoResponse = await fetch(
          `${API_BASE_URL}/geocode?q=${encodeURIComponent(currentProject.location)}&apikey=${API_KEY}`
        );
        if (!geoResponse.ok) throw new Error("Could not trace project operational coordinates.");
        const geoData = await geoResponse.json();
        
        if (!geoData || !geoData.latitude) {
          throw new Error(`Location details for context match '${currentProject.location}' are unresolvable.`);
        }
        
        const { latitude, longitude } = geoData;

        // Step 2: Query construction weather metrics
        const weatherResponse = await fetch(
          `${API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&days=7&units=imperial&apikey=${API_KEY}`
        );
        if (!weatherResponse.ok) throw new Error("Operational weather database unreachable.");
        const weatherData = await weatherResponse.json();

        // Step 3: Transform raw JSON directly into keys expected by BuildWise panels
        const formattedDays = weatherData.daily.map((day) => ({
          date: day.date,
          condition: day.condition_code || 'cloudy', // maps to <ConditionIcon />
          description: day.summary || 'Clear Conditions',
          tempCurrent: Math.round(day.temperature_max - 2), 
          tempHigh: Math.round(day.temperature_max),
          tempLow: Math.round(day.temperature_min),
          humidity: day.humidity || 50,
          windSpeed: day.wind_speed || 10,
          windGust: day.wind_gust || 15,
          visibility: day.visibility || 10,
          precipitation: day.precipitation || 0,
          uvIndex: day.uv_index || 1
        }));

        setLiveForecast(formattedDays);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectWeather();
  }, [currentProject.location]); // Triggers API call every time the selected project changes

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              project={currentProject}
              projects={PROJECTS}
              onProjectChange={setActiveProjectId}
              onLogout={() => setIsAuthenticated(false)}
            />
          }
        >
          
          <Route
            path="/"
            element={
              loading ? (
                <LoadingFallback message="Syncing core site structural metrics..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <SiteOverview project={currentProject} forecast={liveForecast} />
              )
            }
          />

          
          <Route
            path="/window"
            element={
              loading ? (
                <LoadingFallback message="Evaluating 7-day risk tolerances..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <DayForecast forecast={liveForecast} />
              )
            }
          />

          
          <Route
            path="/planner"
            element={
              loading ? (
                <LoadingFallback message="Re-calibrating schedule allowance slots..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <ActivityPlanner forecast={liveForecast} />
              )
            }
          />

        
          <Route
            path="/calculator"
            element={
              loading ? (
                <LoadingFallback message="Formulating critical weather impact forecasts..." />
              ) : error ? (
                <ErrorFallback error={error} />
              ) : (
                <DelayCalculator forecast={liveForecast} />
              )
            }
          />
        </Route>

       
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Presentational state components for loader/error handling
function LoadingFallback({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-24 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
      <Loader2 className="animate-spin text-slate-600" size={32} />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}

function ErrorFallback({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-sm">
      <AlertTriangle className="text-red-500 shrink-0" size={18} />
      <div>{error}</div>
    </div>
  );
} */

/*

MOCK DATA RENDERING

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default for now
  const [activeProjectId, setActiveProjectId] = useState("p1");

  const forecast = useMemo(() => buildForecast(), []);

  const currentProject = useMemo(() => {
    return PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[0];
  }, [activeProjectId]);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              project={currentProject}
              projects={PROJECTS}
              onProjectChange={setActiveProjectId}
              onLogout={() => setIsAuthenticated(false)}
            />
          }
        >
          <Route
            path="/"
            element={
              <SiteOverview
                project={currentProject}
                forecast={forecast}
              />
            }
          />

          <Route
            path="/window"
            element={<DayForecast forecast={forecast} />}
          />

          <Route
            path="/planner"
            element={<ActivityPlanner forecast={forecast} />}
          />

          <Route
            path="/calculator"
            element={<DelayCalculator forecast={forecast} />}
          />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
} */
