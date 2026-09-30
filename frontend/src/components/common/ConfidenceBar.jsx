import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * ConfidenceBar — Calibrated confidence progress with uncertainty interval (Dual Mode)
 * @param {number} value - point estimate (0 to 1, or 0 to 100)
 * @param {number} uncertainty - percentage margin of error (e.g., 14 for ±14%)
 * @param {string} label - metric label
 * @param {boolean} showUncertainty
 */
export default function ConfidenceBar({
  value = 0,
  uncertainty = 14,
  label = 'Calibrated Probability',
  showUncertainty = true,
  className = '',
}) {
  const normalizedValue = value <= 1 ? Math.round(value * 100) : Math.round(value);
  const minRange = Math.max(0, normalizedValue - uncertainty);
  const maxRange = Math.min(100, normalizedValue + uncertainty);

  const getColor = (val) => {
    if (val >= 80) return 'from-rose-500 to-amber-500';
    if (val >= 60) return 'from-amber-500 to-cyan-500';
    return 'from-cyan-500 to-indigo-500';
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
          <span>{label}</span>
          <span
            title="Calibrated against held-out validation distribution (Isotonic Regression)"
            className="cursor-help text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="font-mono text-xs">
          <span className="font-extrabold text-slate-900 dark:text-white text-sm">{normalizedValue}%</span>
          {showUncertainty && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] ml-1">
              (±{uncertainty}% CI)
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full border border-slate-300 dark:border-slate-800 overflow-hidden">
        {/* Uncertainty Range Glow */}
        {showUncertainty && (
          <div
            className="absolute top-0 bottom-0 bg-cyan-500/20 rounded-full"
            style={{
              left: `${minRange}%`,
              width: `${maxRange - minRange}%`,
            }}
          />
        )}

        {/* Primary Value Fill */}
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(normalizedValue)} transition-all duration-500`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Low Risk</span>
        {showUncertainty && (
          <span className="text-cyan-700 dark:text-cyan-300 font-semibold">
            Interval: {minRange}% – {maxRange}%
          </span>
        )}
        <span>High Priority Lead</span>
      </div>
    </div>
  );
}
