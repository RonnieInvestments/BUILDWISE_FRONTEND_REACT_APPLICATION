import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Calculator,
  MapPin,
  HardHat,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export function Layout({ project, projects, onProjectChange, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false); // views
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Site Overview", icon: <LayoutDashboard size={18} /> },
    { path: "/window", label: "7-Day Window", icon: <CalendarDays size={18} /> },
    { path: "/planner", label: "Activity Planner", icon: <ClipboardList size={18} /> },
    { path: "/calculator", label: "Delay Calculator", icon: <Calculator size={18} /> },
  ];

  const sidebarContent = (
    <aside className="flex flex-col h-full w-64 bg-[#1E293B] text-white">
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
            <HardHat size={20} className="text-[#1E293B]" />
          </div>
          <span className="font-display text-xl font-bold tracking-wide">BUILDWISE</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 px-1">
          Active Project
        </p>

        <select
          value={project.id}
          onChange={e => onProjectChange(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white appearance-none cursor-pointer focus:outline-none"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id} className="bg-[#1E293B] text-white">
              {p.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 mt-2 px-1">
          <MapPin size={11} className="text-white/40" />
          <span className="text-[11px] text-white/50 truncate">
            {project.location}
          </span>
        </div>

        <div className="mt-2 px-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-white/50">Completion</span>
            <span className="text-[11px] font-mono text-amber-400">
              {project.completion}%
            </span>
          </div>

          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${project.completion}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3 px-2">
          Navigation
        </p>

        {navItems.map(item => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-amber-400 text-[#1E293B]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
              {isActive && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
            <User size={14} className="text-[#1E293B]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              Site Manager
            </p>
            <p className="text-[11px] text-white/50 truncate">
              manager@buildwise.com
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="hidden lg:flex h-full flex-shrink-0">
        {sidebarContent}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full">{sidebarContent}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-slate-600"
          >
            <Menu size={24} />
          </button>

          <span className="font-bold tracking-wider text-slate-800">
            BUILDWISE
          </span>

          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

