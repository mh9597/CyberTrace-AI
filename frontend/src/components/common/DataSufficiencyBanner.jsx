import React from 'react';
import { AlertCircle, CheckCircle2, Info, BrainCircuit } from 'lucide-react';

/**
 * DataSufficiencyBanner — Explicit banner communicating whether analysis is validated forecast vs heuristic
 * @param {'validated' | 'heuristic' | 'hotspot_only' | 'insufficient'} mode
 * @param {string} modelVersion
 * @param {string} dataFreshness
 * @param {string} reason
 */
export default function DataSufficiencyBanner({
  mode = 'validated',
  modelVersion = 'RF-DBSCAN-v1.0',
  dataFreshness = 'Real-time Synthetic Seed',
  reason,
  className = '',
}) {
  const configs = {
    validated: {
      bg: 'bg-sky-50/80 border-sky-300 dark:bg-gradient-to-r dark:from-cyan-950/40 dark:via-slate-900 dark:to-slate-900 dark:border-cyan-800/60',
      icon: CheckCircle2,
      iconColor: 'text-sky-700 dark:text-cyan-400',
      title: 'VALIDATED SUPERVISED FORECAST',
      badge: 'Calibrated Random Forest + DBSCAN',
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-700/50',
      desc: 'Sufficient historical transaction sequence and labeled spatial training data available. Point estimate calibrated with ±14% uncertainty.',
    },
    heuristic: {
      bg: 'bg-amber-50/80 border-amber-300 dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 dark:border-amber-800/60',
      icon: Info,
      iconColor: 'text-amber-700 dark:text-amber-400',
      title: 'RULE-BASED HEURISTIC LEAD',
      badge: 'Heuristic Pattern Matcher',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700/50',
      desc: 'Derived from multi-hop velocity rules and account fan-out patterns. Not a statistically validated forecast.',
    },
    hotspot_only: {
      bg: 'bg-indigo-50/80 border-indigo-300 dark:bg-gradient-to-r dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 dark:border-indigo-800/60',
      icon: BrainCircuit,
      iconColor: 'text-indigo-700 dark:text-indigo-400',
      title: 'HISTORICAL HOTSPOT CLUSTERING ONLY',
      badge: 'DBSCAN Spatial Density',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/50',
      desc: 'Displays historical high-density withdrawal zones. Does not represent a case-specific cash-out trajectory.',
    },
    insufficient: {
      bg: 'bg-rose-50/80 border-rose-300 dark:bg-gradient-to-r dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 dark:border-rose-800/60',
      icon: AlertCircle,
      iconColor: 'text-rose-700 dark:text-rose-400',
      title: 'INSUFFICIENT DATA FOR FORECAST',
      badge: 'Forecast Disabled',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700/50',
      desc:
        reason ||
        'Transaction records lack sufficient multi-hop depth or temporal timestamps to generate an honest candidate zone.',
    },
  };

  const current = configs[mode] || configs.validated;
  const Icon = current.icon;

  return (
    <div
      className={`p-4 rounded-xl border ${current.bg} flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${current.iconColor} shrink-0 mt-0.5`} />
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-900 dark:text-white tracking-wide">
              {current.title}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${current.badgeClass}`}
            >
              {current.badge}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-[11px]">
            {current.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center font-mono text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          Model: {modelVersion}
        </span>
        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
          Freshness: {dataFreshness}
        </span>
      </div>
    </div>
  );
}
