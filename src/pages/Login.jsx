import { useState } from "react";
import { AlertTriangle, RefreshCw, HardHat } from "lucide-react";

export function Login({ onLogin }) {
  const [email, setEmail] = useState("manager@buildwise.com");
  const [password, setPassword] = useState("build2024");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your credentials.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (
        email === "manager@buildwise.com" &&
        password === "build2024"
      ) {
        onLogin();
      } else {
        setError(
          "Invalid credentials. Try manager@buildwise.com / build2024"
        );
      }
    }, 900);
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1599707254554-027aeb4deacd?w=1200&h=900&fit=crop&auto=format"
          alt="Site Construction"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-900/50" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center">
              <HardHat size={22} className="text-slate-900" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wide">
              BUILDWISE
            </span>
          </div>

          <div>
            <h1 className="font-display text-5xl font-bold leading-tight mb-4">
              Weather Risk.
              <br />
              Smarter Decisions.
            </h1>
            <p className="text-slate-300 text-lg max-w-sm">
              Real-time construction weather intelligence for site managers.
            </p>
          </div>

          <p className="text-slate-500 text-sm">© 2026 Buildwise</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-slate-900 mb-1">
            Welcome back
          </h2>
          <p className="text-slate-500 mb-8">
            Sign in to access your project dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2"
            >
              {loading && (
                <RefreshCw size={16} className="animate-spin" />
              )}
              {loading ? "Signing in…" : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}