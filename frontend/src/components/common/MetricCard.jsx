import React from 'react';

/**
 * MetricCard — KPI summary card with icon, animated value, delta subtext, and ambient glow
 * @param {string} title
 * @param {string|number} value
 * @param {string} subtext
 * @param {React.ComponentType} icon
 * @param {'cyan' | 'rose' | 'emerald' | 'indigo' | 'amber'} glowColor
 * @param {string} trend
 */
export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  glowColor = 'cyan',
  trend,
  className = '',
}) {
  const iconColorMap = {
    cyan: 'text-cyan-400 bg-cyan-950/50 border-cyan-800/40',
    rose: 'text-rose-400 bg-rose-950/50 border-rose-800/40',
    emerald: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/40',
    indigo: 'text-indigo-400 bg-indigo-950/50 border-indigo-800/40',
    amber: 'text-amber-400 bg-amber-950/50 border-amber-800/40',
  };

  const glowBorderMap = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-glow-cyan',
    rose: 'hover:border-rose-500/40 hover:shadow-glow-rose',
    emerald: 'hover:border-emerald-500/40 hover:shadow-glow-emerald',
    indigo: 'hover:border-indigo-500/40 hover:shadow-glow-indigo',
    amber: 'hover:border-amber-500/40',
  };

  const valueColorMap = {
    cyan: 'text-white',
    rose: 'text-rose-300',
    emerald: 'text-emerald-300',
    indigo: 'text-indigo-200',
    amber: 'text-amber-300',
  };

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 transition-all duration-200 ${glowBorderMap[glowColor] || ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl border ${iconColorMap[glowColor] || iconColorMap.cyan}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-3xl font-extrabold font-mono tracking-tight ${valueColorMap[glowColor] || 'text-white'}`}>
          {value}
        </span>
        {trend && (
          <span className="text-xs font-mono font-medium text-emerald-400 flex items-center">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-1.5 text-xs text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
