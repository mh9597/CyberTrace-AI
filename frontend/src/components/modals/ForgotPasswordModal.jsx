import React, { useState } from "react";
import { ShieldCheck, Mail, KeyRound, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, X } from "lucide-react";
import api from "../../services/api";

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = "" }) {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP & New Password, 3 = Success
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid government email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      if (res.data.dev_otp) {
        setOtp(res.data.dev_otp);
      }
      setSuccessMsg(res.data.message || `Verification passcode dispatched to ${email}.`);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to dispatch reset code. Please check email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP code sent to your email.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        new_password: newPassword,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || "Password reset failed. Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMsg("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
            <KeyRound className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
              Reset Security Key
            </h3>
            <p className="text-[11px] text-gray-500 font-mono">
              CyberTrace AI • Identity & Credentials
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Email to Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your registered officer email address. We will dispatch a 6-digit one-time verification passcode (OTP) to establish a new access key.
            </p>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Official Email Address
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

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-11 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? "Dispatching OTP..." : "Send Verification Passcode"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Enter OTP & New Password (with Hide/Unhide) */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                6-Digit Email Verification Code (OTP)
              </label>
              <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full font-mono tracking-widest font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                New Access Key / Password
              </label>
              <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Confirm New Password
              </label>
              <div className="flex items-center w-full border border-gray-300/80 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 h-11 rounded-xl px-3.5 gap-2 transition bg-gray-50/50">
                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-0.5"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 h-11 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-xs font-semibold cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 h-11 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? "Updating..." : "Set New Password"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">
                Password Successfully Reset!
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Your credentials have been updated securely. You can now authenticate with your new access key.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full h-11 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
