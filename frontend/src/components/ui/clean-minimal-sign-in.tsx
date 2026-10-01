"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";

export interface SignIn2Props {
  onSubmit?: (data: { email: string; password: string }) => Promise<void> | void;
  loading?: boolean;
  externalError?: string;
  defaultEmail?: string;
  defaultPassword?: string;
  title?: string;
  description?: string;
  onSelectRole?: (email: string, pass: string) => void;
  extraFooter?: React.ReactNode;
}

const SignIn2: React.FC<SignIn2Props> = ({
  onSubmit,
  loading = false,
  externalError = "",
  defaultEmail = "",
  defaultPassword = "",
  title = "Sign in with email",
  description = "Authorized Law Enforcement & Investigator Access Portal",
  onSelectRole,
  extraFooter,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  React.useEffect(() => {
    if (defaultPassword) setPassword(defaultPassword);
  }, [defaultPassword]);
 
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
 
  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
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
    <div className="w-full flex items-center justify-center bg-white z-1 py-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-sky-50/50 to-white rounded-3xl shadow-xl shadow-opacity-10 p-8 flex flex-col items-center border border-blue-100 text-black">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white mb-6 shadow-lg shadow-opacity-5">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-slate-900">
          {title}
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          {description}
        </p>

        <form onSubmit={handleSignIn} className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-gray-50 text-black text-sm"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xs select-none"></span>
          </div>

          <div className="w-full flex justify-between items-center">
            {displayError ? (
              <div className="text-xs text-red-500 text-left">{displayError}</div>
            ) : <span />}
            <button
              type="button"
              onClick={() => alert("Contact system administrator to reset credentials.")}
              className="text-xs hover:underline font-medium text-slate-600 ml-auto"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-b from-gray-700 to-gray-900 text-white font-medium py-2 rounded-xl shadow hover:brightness-105 cursor-pointer transition mb-2 mt-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Get Started"}
          </button>
        </form>

        {onSelectRole && (
          <div className="w-full pt-3 pb-1 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block text-center">
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
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-mono text-slate-700 transition text-center"
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
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-mono text-slate-700 transition text-center"
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
                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-mono text-slate-700 transition text-center"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
          <span className="mx-2 text-xs text-gray-400">Or sign in with</span>
          <div className="flex-grow border-t border-dashed border-gray-200"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            type="button"
            onClick={() => alert("Google SSO Integration active for Gov domains.")}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </button>
          <button
            type="button"
            onClick={() => alert("NIC / Parichay OAuth available.")}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/49/49c99a2bb048f4c4941540ccf601621071669cdd1f51e52312a412f23bb2d5fa.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
          <button
            type="button"
            onClick={() => alert("Smart Card / PKI authentication ready.")}
            className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/c2/c221b3f2143cf5d8d85a3b68da84dbae21b18db4164e63ca8c07c6ffdbb922c4.svg"
              alt="Apple"
              className="w-6 h-6"
            />
          </button>
        </div>

        {extraFooter}
      </div>
    </div>
  );
};
 
export { SignIn2 };
