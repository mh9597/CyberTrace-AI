import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User, ArrowRight, Check, ShieldCheck, Key, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('investigator@cybertrace.gov.in');
  const [password, setPassword] = useState('Investigator@123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  const handleSelectRole = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow-cyan mx-auto ring-1 ring-cyan-400/40">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            CyberTrace AI
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Secure Predictive Cybercrime Intelligence Platform &bull; SIH 2026
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-200 tracking-wide">
              Authorized Officer Authentication
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              RBAC v1.0
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-medium">Official ID / Email</label>
              <div className="mt-1 relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Password</label>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow-cyan transition flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating Officer...' : 'Enter Intelligence Terminal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Selector */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Quick Switch Demo Roles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSelectRole('investigator@cybertrace.gov.in', 'Investigator@123')
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-600/60 text-[11px] font-mono text-cyan-300 transition text-center"
              >
                Investigator
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSelectRole('senior@cybertrace.gov.in', 'Senior@123')
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-600/60 text-[11px] font-mono text-indigo-300 transition text-center"
              >
                Senior Off.
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSelectRole('admin@cybertrace.gov.in', 'Admin@123')
                }
                className="px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-600/60 text-[11px] font-mono text-emerald-300 transition text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Responsible Use Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-500 text-center leading-relaxed font-mono">
          Decision Support System for Law Enforcement &bull; No automated enforcement or personal tracking.
        </div>
      </div>
    </div>
  );
}
