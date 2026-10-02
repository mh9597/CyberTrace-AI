import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  BadgeAlert,
  Building,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";

export type OfficerRole = "investigator" | "senior_officer";

export interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  role: OfficerRole;
  badge_number: string;
  department?: string;
  authorization_code?: string;
}

export interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => Promise<void> | void;
  loading?: boolean;
  externalError?: string;
  heroImage?: string;
  extraFooter?: React.ReactNode;
}

export default function SignupForm({
  onSubmit,
  loading = false,
  externalError = "",
  heroImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  extraFooter,
}: SignupFormProps) {
  const [selectedRole, setSelectedRole] = useState<OfficerRole>("investigator");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [department, setDepartment] = useState("State Cyber Crime Cell");
  const [authorizationCode, setAuthorizationCode] = useState("SEC-HQ-2026");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleRoleChange = (role: OfficerRole) => {
    setSelectedRole(role);
    setValidationError("");
    if (role === "investigator") {
      setDepartment("State Cyber Crime Cell");
      if (!badgeNumber || badgeNumber.startsWith("IPS-")) {
        setBadgeNumber("IND-DEL-409");
      }
    } else {
      setDepartment("State Cyber Command & Zonal Oversight");
      if (!badgeNumber || badgeNumber.startsWith("IND-")) {
        setBadgeNumber("IPS-HQ-012");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName.trim() || !email.trim() || !password) {
      setValidationError("Please fill in all mandatory officer identification fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError("Please enter a valid official email address.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Password and Confirmation do not match.");
      return;
    }

    if (selectedRole === "senior_officer" && !authorizationCode.trim()) {
      setValidationError("Senior Officer clearance token is required.");
      return;
    }

    if (onSubmit) {
      await onSubmit({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
        badge_number: badgeNumber.trim(),
        department,
        authorization_code: authorizationCode,
      });
    } else {
      alert(`Account registered successfully for ${fullName} (${selectedRole})!`);
    }
  };

  const displayError = externalError || validationError;

  return (
    <div className="flex min-h-[760px] w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-6">
      {/* Left Side Visual Banner */}
      <div className="w-full hidden md:block relative bg-slate-900 overflow-hidden">
        <img
          className="h-full w-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
          src={heroImage}
          alt="CyberTrace AI Terminal"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-semibold w-fit mb-3">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>CyberTrace AI • SIH 2026</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight">
            Authorized Officer Enrollment
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-sm">
            Strict Role-Based Access Control (RBAC). Dedicated portals for field investigators and supervisory command officers to combat organized financial cybercrime.
          </p>

          <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Investigator: Fast lead triage, money trails & ATM centroids</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Senior Officer: Inter-state coordination & command analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Unified Form */}
      <div className="w-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 bg-white">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Select your official designation to enroll
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              RBAC v1.0
            </span>
          </div>

          {/* DUAL ROLE SELECTOR TABS */}
          <div className="w-full grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl my-4">
            <button
              type="button"
              onClick={() => handleRoleChange("investigator")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === "investigator"
                  ? "bg-white text-indigo-700 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>👮‍♂️ Investigator</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("senior_officer")}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedRole === "senior_officer"
                  ? "bg-white text-indigo-700 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>⭐ Senior Officer</span>
            </button>
          </div>

          {displayError && (
            <div className="w-full mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
              {displayError}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="w-full space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-medium text-gray-700 block mb-1">
                Officer Full Name
              </label>
              <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder={
                    selectedRole === "investigator"
                      ? "e.g. Sub-Inspector Ananya Rao"
                      : "e.g. Superintendent Rajesh Nair"
                  }
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-medium text-gray-700 block mb-1">
                Official Department Email
              </label>
              <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="officer@cybertrace.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                />
              </div>
            </div>

            {/* Role Specific Dynamic Row: Badge / Service ID & Wing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-1">
                  {selectedRole === "investigator" ? "Badge Number" : "IPS / Service ID"}
                </label>
                <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                  <BadgeAlert className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder={selectedRole === "investigator" ? "IND-DEL-409" : "IPS-HQ-012"}
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-1">
                  {selectedRole === "investigator" ? "Cyber Unit" : "Command Jurisdiction"}
                </label>
                <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                  <Building className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Jurisdiction"
                    className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                  />
                </div>
              </div>
            </div>

            {/* Senior Officer Security Clearance Code (Conditional) */}
            {selectedRole === "senior_officer" && (
              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-1 flex items-center justify-between">
                  <span>Executive Clearance Token</span>
                  <span className="text-[10px] text-indigo-600 font-mono">Demo: SEC-HQ-2026</span>
                </label>
                <div className="flex items-center w-full border border-indigo-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-indigo-50/30">
                  <KeyRound className="w-4 h-4 text-indigo-500 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="SEC-HQ-2026"
                    value={authorizationCode}
                    onChange={(e) => setAuthorizationCode(e.target.value)}
                    className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-1">
                  Password
                </label>
                <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5 transition"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-gray-700 block mb-1">
                  Confirm Password
                </label>
                <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5 transition"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 h-11 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>
                {loading
                  ? "Enrolling Officer..."
                  : selectedRole === "investigator"
                  ? "Register as Investigator"
                  : "Register as Senior Officer"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Login Link */}
          <div className="mt-5 text-center text-xs text-gray-500">
            <span>Already have an authorized account? </span>
            <Link
              to="/login"
              className="text-indigo-600 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </div>

          {extraFooter}
        </div>
      </div>
    </div>
  );
}
