import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  User,
  Mail,
  BadgeCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/images/landing-bg.png';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    badgeNumber: '',
    department: 'Cyber Crime Investigation Cell',
    role: 'investigator',
    password: '',
    confirmPassword: '',
    declaration: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Security passkey must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your passkey.');
      return;
    }

    if (!formData.declaration) {
      setError('You must confirm authorized law enforcement status.');
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      role: formData.role,
      badge_number: formData.badgeNumber || null,
    };

    const res = await register(payload);
    if (res.success) {
      setSuccessMsg('Officer credential verified! Initializing secure terminal...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-200"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header className="w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-6 sm:px-10 flex items-center justify-between z-20">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            CyberTrace <span className="text-blue-600">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="text-slate-500 hidden sm:inline">Already registered?</span>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-400 shadow-xs transition"
          >
            Officer Sign In
          </Link>
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1 font-medium"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Registration Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 z-10">
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-6 sm:p-9 space-y-6">
          {/* Card Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                Official LEA Onboarding
              </span>
              <span className="text-[11px] font-mono text-slate-400">SIH 2026 &bull; Sec-LEO</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              Register Law Enforcement Account
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create credentials to access real-time predictive cybercrime tracing & ATM cash-out monitoring.
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Officer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Inspector Rajesh Verma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="officer@police.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Badge ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service / Badge Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <BadgeCheck className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="badgeNumber"
                    value={formData.badgeNumber}
                    onChange={handleChange}
                    placeholder="e.g. GJ-CYB-2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Department / Unit */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Unit
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Cyber Cell / CID"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Assign System Role
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'investigator', label: 'Investigator', desc: 'Case & Triage analysis' },
                  { id: 'senior_officer', label: 'Senior Officer', desc: 'Intervention approval' },
                  { id: 'admin', label: 'Administrator', desc: 'Full System Control' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, role: r.id }))}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      formData.role === r.id
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{r.label}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Passkey / Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Passkey <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat passkey"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Official Undertaking */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                I declare under official obligation that I am an active investigator or authorized personnel accessing the CyberTrace AI Intelligence System for legal cybersecurity enforcement.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              <span>{loading ? 'Registering Officer...' : 'Create Officer Account & Enter Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Card Navigation */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Already have an active account?</span>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In to Intelligence Portal &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Legal Notice */}
      <footer className="w-full py-3 text-center text-[11px] text-slate-500 font-mono bg-white/70 backdrop-blur-xs border-t border-slate-200/50 z-20">
        CyberTrace AI &bull; Smart India Hackathon (SIH 2026) &bull; Official Use Only
      </footer>
    </div>
  );
}
