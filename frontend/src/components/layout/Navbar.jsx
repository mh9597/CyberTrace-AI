import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl transition-colors duration-200">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-sm dark:shadow-glow-cyan ring-1 ring-cyan-500/40 shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
                CyberTrace AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/90 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 font-bold shadow-xs">
                SIH26184
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight hidden sm:block">
              Predictive Cybercrime Intelligence & Cash-out Forecasting
            </p>
          </div>
        </div>

        {/* Mandatory Responsible Use & Synthetic Data Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono font-medium select-none shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse"></span>
          <span>SYNTHETIC DEMO ENVIRONMENT | INVESTIGATIVE LEADS ONLY</span>
        </div>
      </div>

      {/* Theme Toggle, Telemetry Beacon & Officer Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Heartbeat Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>ML CLUSTER: ONLINE</span>
        </div>

        {/* Dual Light/Dark Theme Switcher */}
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 justify-end">
                <span>{user.full_name}</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/90 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/60 font-bold">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Officer ID: {user.badge_number || 'IND-HQ-01'}
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 dark:bg-slate-900 dark:hover:bg-rose-950/60 dark:text-slate-400 dark:hover:text-rose-400 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800/60 transition shadow-xs"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-sm"
          >
            Officer Sign In
          </button>
        )}
      </div>
    </header>
  );
}
