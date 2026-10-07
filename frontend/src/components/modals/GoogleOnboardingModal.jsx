import React, { useState, useEffect } from "react";
import { ShieldCheck, User, Mail, Hash, Shield, KeyRound, CheckCircle2, ArrowRight } from "lucide-react";

export default function GoogleOnboardingModal({
  isOpen,
  onClose,
  email,
  initialName = "",
  onSubmit,
  loading = false,
  externalError = "",
  heroImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
}) {
  const [fullName, setFullName] = useState(initialName || "");
  const [badgeNumber, setBadgeNumber] = useState("CYBER-OFF-882");
  const [role, setRole] = useState("investigator");
  const [otp, setOtp] = useState("");
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName.trim()) {
      setValidationError("Please enter your full officer name.");
      return;
    }
    if (!badgeNumber.trim()) {
      setValidationError("Police Identification / Badge number is required.");
      return;
    }
    if (!otp.trim() || otp.trim().length !== 6) {
      setValidationError("Please enter the 6-digit email verification code sent via SMTP.");
      return;
    }

    if (onSubmit) {
      await onSubmit({
        email,
        full_name: fullName.trim(),
        badge_number: badgeNumber.trim(),
        role,
        otp: otp.trim(),
        department: role === "senior_officer" ? "State Cyber Command & Zonal Oversight" : "State Cyber Crime Cell",
      });
    }
  };

  const displayError = externalError || validationError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex min-h-[640px] w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Left Side Visual Banner - Exactly matches reference UI */}
        <div className="w-1/2 hidden md:block relative bg-slate-900 overflow-hidden">
          <img
            className="h-full w-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
            src={heroImage}
            alt="CyberTrace AI Terminal"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
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

        {/* Right Side Form - Matching UI palette & pill inputs */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-10 bg-white overflow-y-auto">
          <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col items-center justify-center">
            {/* Google Account Verified Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>{email}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl text-gray-900 font-semibold tracking-tight text-center">
              Complete Officer Profile
            </h2>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Set your identity credentials to activate decision support access
            </p>

            {displayError && (
              <div className="w-full mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs text-center font-medium">
                {displayError}
              </div>
            )}

            {/* Field 1: Full Name */}
            <div className="w-full mt-5">
              <label className="text-[11px] font-semibold text-gray-600 ml-3 mb-1 block">Officer Full Name</label>
              <div className="flex items-center w-full bg-transparent border border-gray-300/80 focus-within:border-indigo-600 h-11 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 transition">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Officer Vikram Sharma"
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs sm:text-sm w-full h-full"
                  required
                />
              </div>
            </div>

            {/* Field 2: Police ID / Badge Number */}
            <div className="w-full mt-3">
              <label className="text-[11px] font-semibold text-gray-600 ml-3 mb-1 block">Police Badge / Officer ID</label>
              <div className="flex items-center w-full bg-transparent border border-gray-300/80 focus-within:border-indigo-600 h-11 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 transition">
                <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="e.g. IND-DEL-409"
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs sm:text-sm w-full h-full font-mono uppercase"
                  required
                />
              </div>
            </div>

            {/* Field 3: Select Role */}
            <div className="w-full mt-3">
              <label className="text-[11px] font-semibold text-gray-600 ml-3 mb-1 block">Designation / Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("investigator")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium transition border ${
                    role === "investigator"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Investigator
                </button>
                <button
                  type="button"
                  onClick={() => setRole("senior_officer")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium transition border ${
                    role === "senior_officer"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Senior Off.
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 px-2 rounded-xl text-[11px] font-medium transition border ${
                    role === "admin"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Field 4: SMTP Verification Code */}
            <div className="w-full mt-3">
              <div className="flex items-center justify-between ml-3 mr-1 mb-1">
                <label className="text-[11px] font-semibold text-gray-600">SMTP Email Verification Code</label>
                <span className="text-[10px] text-blue-600 font-mono">6-Digit Code</span>
              </div>
              <div className="flex items-center w-full bg-transparent border border-gray-300/80 focus-within:border-indigo-600 h-11 rounded-full overflow-hidden pl-5 pr-4 gap-2.5 transition">
                <KeyRound className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  placeholder="Enter 6-digit OTP from email"
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs sm:text-sm w-full h-full font-mono tracking-widest"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-500 ml-3 mt-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Security OTP has been sent to <strong className="text-gray-800">{email}</strong>. Check your inbox.</span>
              </p>
            </div>

            {/* Submit Button - exact purple/blue pill styling from reference */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold tracking-wide transition shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Verify & Activate Officer Badge</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
