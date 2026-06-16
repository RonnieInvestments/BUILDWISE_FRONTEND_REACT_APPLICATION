import { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { buildForecast, PROJECTS } from "./constants/weatherData";

// Layout and Pages
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { SiteOverview } from "./pages/SiteOverview";
import { DayForecast } from "./pages/DayForecast";
import { ActivityPlanner } from "./pages/ActivityPlanner";
import { DelayCalculator } from "./pages/DelayCalculator";

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

        {/* Fallback Catch */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}