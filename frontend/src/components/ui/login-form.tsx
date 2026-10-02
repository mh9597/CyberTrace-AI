import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => Promise<void> | void;
  onGoogleSignIn?: () => void;
  loading?: boolean;
  externalError?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  title?: string;
  description?: string;
  onSelectRole?: (email: string, pass: string) => void;
  extraFooter?: React.ReactNode;
  heroImage?: string;
}

export default function Example({
  onSubmit,
  onGoogleSignIn,
  loading = false,
  externalError = "",
  defaultEmail = "investigator@cybertrace.gov.in",
  defaultPassword = "Investigator@123",
  title = "Sign in",
  description = "Welcome back! Please sign in to continue",
  onSelectRole,
  extraFooter,
  heroImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  React.useEffect(() => {
    if (defaultPassword) setPassword(defaultPassword);
  }, [defaultPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");

    if (onSubmit) {
      await onSubmit({ email, password });
    } else {
      alert("Sign in successful! (Demo)");
    }
  };

  const displayError = externalError || error;

  return (
    <div className="flex min-h-[700px] w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
      {/* Left Side Visual Banner */}
      <div className="w-full hidden md:block relative bg-slate-900 overflow-hidden">
        <img
          className="h-full w-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
          src={heroImage}
          alt="CyberTrace AI Terminal"
          onError={(e) => {
            // Fallback to secondary high-availability Unsplash tech asset
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-semibold w-fit mb-3">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>CyberTrace AI • SIH 2026</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            Predictive Cybercrime Intelligence
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            AI-assisted money trail reconstruction, ATM centroid forecasting, and rapid decision support.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 bg-white">
        <form
          onSubmit={handleSubmit}
          className="md:w-96 w-full max-w-sm flex flex-col items-center justify-center"
        >
          <h2 className="text-3xl sm:text-4xl text-gray-900 font-medium tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500/90 mt-2 text-center">
            {description}
          </p>

          {/* Social Sign-in Option */}
          <button
            type="button"
            onClick={() => {
              if (onGoogleSignIn) {
                onGoogleSignIn();
              } else {
                alert("Google SSO Integration active for Gov domains.");
              }
            }}
            className="w-full mt-6 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-3 h-12 rounded-full border border-gray-200 shadow-xs hover:border-gray-300 group cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              Sign in with Google
            </span>
          </button>

          <div className="flex items-center gap-4 w-full my-4">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-xs text-gray-500/90 text-center">
              or sign in with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {displayError && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
              {displayError}
            </div>
          )}

          {/* Email input with SVG */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 focus-within:border-indigo-500 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email id"
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm w-full h-full"
              required
            />
          </div>

          {/* Password input with SVG */}
          <div className="flex items-center mt-4 w-full bg-transparent border border-gray-300/60 focus-within:border-indigo-500 h-12 rounded-full overflow-hidden pl-6 pr-4 gap-2 transition">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="w-full flex items-center justify-between mt-5 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                type="checkbox"
                id="checkbox"
                defaultChecked
              />
              <label className="text-xs text-gray-600 cursor-pointer" htmlFor="checkbox">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => alert("Please contact department administrator to reset credentials.")}
              className="text-xs text-gray-600 hover:text-indigo-600 underline font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Quick Demo Credentials Selector for Investigators */}
          {onSelectRole && (
            <div className="w-full pt-4 mt-4 border-t border-gray-100 space-y-2">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block text-center">
                Quick Switch Demo Roles:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("investigator@cybertrace.gov.in");
                    setPassword("Investigator@123");
                    setError("");
                    onSelectRole("investigator@cybertrace.gov.in", "Investigator@123");
                  }}
                  className="px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 text-[10px] font-mono text-gray-700 transition text-center"
                >
                  Investigator
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("senior.officer@cybertrace.gov.in");
                    setPassword("Officer@123");
                    setError("");
                    onSelectRole("senior.officer@cybertrace.gov.in", "Officer@123");
                  }}
                  className="px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 text-[10px] font-mono text-gray-700 transition text-center"
                >
                  Senior Off.
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@cybertrace.gov.in");
                    setPassword("Admin@123");
                    setError("");
                    onSelectRole("admin@cybertrace.gov.in", "Admin@123");
                  }}
                  className="px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 border border-gray-200 text-[10px] font-mono text-gray-700 transition text-center"
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition font-medium shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Authenticating Officer..." : "Login"}
          </button>

          <p className="text-gray-500/90 text-xs mt-4 text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </form>

        {extraFooter}
      </div>
    </div>
  );
}

export { Example as LoginForm };
