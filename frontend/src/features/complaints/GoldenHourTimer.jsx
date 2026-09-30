import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle, Zap } from 'lucide-react';
import api from '../../services/api';

export default function GoldenHourTimer({ complaintId, onOpenFreezeModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchGoldenHour() {
      try {
        const res = await api.get(`/complaints/${complaintId}/golden-hour`);
        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch golden hour metrics:', err);
        if (isMounted) setLoading(false);
      }
    }

    fetchGoldenHour();
    const interval = setInterval(fetchGoldenHour, 30000); // Poll every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [complaintId]);

  if (loading || !data) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse text-xs text-slate-500 font-mono">
        Calculating real-time Golden Hour SLA window...
      </div>
    );
  }

  const {
    remaining_minutes,
    elapsed_minutes,
    golden_hour_limit_minutes,
    sla_tier,
    risk_color,
    action_label,
    is_breached,
    percentage_elapsed,
  } = data;

  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/40',
      progress: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    },
    amber: {
      bg: 'bg-amber-950/40 border-amber-800/60 text-amber-300',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-600/40',
      progress: 'bg-gradient-to-r from-amber-500 to-orange-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    },
    rose: {
      bg: 'bg-rose-950/50 border-rose-800/70 text-rose-300',
      badge: 'bg-rose-500/25 text-rose-200 border-rose-600/50',
      progress: 'bg-gradient-to-r from-rose-600 to-red-500',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    },
  }[risk_color] || {
    bg: 'bg-slate-900 border-slate-800 text-slate-300',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    progress: 'bg-cyan-500',
    glow: '',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorStyles.bg} ${colorStyles.glow} transition-all duration-300`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: SLA Header & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${risk_color === 'rose' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${risk_color === 'rose' ? 'bg-rose-500' : (risk_color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500')}`}></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>CFCFRMS 1930 &bull; Golden Hour SLA Window</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${colorStyles.badge}`}>
              {sla_tier.replace(/_/g, ' ')}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {action_label}
          </p>
        </div>

        {/* Right: Remaining Time & Action Trigger */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-lg font-black text-white">
              {is_breached ? (
                <span className="text-rose-400">00:00 (SLA EXPIRED)</span>
              ) : (
                <span>~{remaining_minutes} min remaining</span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Elapsed: {elapsed_minutes}m / {golden_hour_limit_minutes}m limit
            </div>
          </div>

          {onOpenFreezeModal && (
            <button
              onClick={onOpenFreezeModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 flex items-center gap-1.5 transition active:scale-95 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Issue Sec 94 BNSS Freeze</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-slate-800/80">
        <div
          className={`h-full ${colorStyles.progress} transition-all duration-500`}
          style={{ width: `${percentage_elapsed}%` }}
        />
      </div>
    </div>
  );
}
