import React from 'react';

/**
 * GlassCard — Elevated translucent container with ambient glow borders
 * @param {React.ReactNode} children
 * @param {string} className
 * @param {'none' | 'cyan' | 'rose' | 'emerald' | 'indigo'} hoverGlow
 * @param {string} title
 * @param {React.ReactNode} action
 * @param {React.ReactNode} icon
 * @param {string} subtitle
 */
export default function GlassCard({
  children,
  className = '',
  hoverGlow = 'none',
  title,
  subtitle,
  icon: Icon,
  action,
  ...props
}) {
  const glowClasses = {
    none: 'hover:border-slate-700/80',
    cyan: 'hover:border-cyan-500/50 hover:shadow-glow-cyan',
    rose: 'hover:border-rose-500/50 hover:shadow-glow-rose',
    emerald: 'hover:border-emerald-500/50 hover:shadow-glow-emerald',
    indigo: 'hover:border-indigo-500/50 hover:shadow-glow-indigo',
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900/75 backdrop-blur-md border border-slate-800/80 transition-all duration-200 ${glowClasses[hoverGlow] || glowClasses.none} ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-800/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className="w-5 h-5 text-cyan-400 shrink-0" />}
            <div>
              {title && <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={title || action ? 'p-6' : 'p-6'}>{children}</div>
    </div>
  );
}
