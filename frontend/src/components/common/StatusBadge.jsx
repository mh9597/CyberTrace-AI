import React from 'react';

/**
 * StatusBadge — Visual status pill with animated beacon dot (Dual Mode)
 * @param {string} status
 * @param {'auto' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo'} variant
 * @param {'sm' | 'md'} size
 */
export default function StatusBadge({ status, variant = 'auto', size = 'sm', className = '' }) {
  const getVariant = () => {
    if (variant !== 'auto') return variant;
    const lower = (status || '').toLowerCase();
    if (
      lower.includes('alert') ||
      lower.includes('danger') ||
      lower.includes('high') ||
      lower.includes('critical')
    ) {
      return 'rose';
    }
    if (
      lower.includes('verified') ||
      lower.includes('resolved') ||
      lower.includes('active') ||
      lower.includes('success')
    ) {
      return 'emerald';
    }
    if (lower.includes('analysis') || lower.includes('assigned') || lower.includes('investigat')) {
      return 'cyan';
    }
    if (
      lower.includes('new') ||
      lower.includes('review') ||
      lower.includes('pending') ||
      lower.includes('caution')
    ) {
      return 'amber';
    }
    return 'slate';
  };

  const selected = getVariant();

  const styles = {
    cyan: {
      pill: 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-700/50',
      dot: 'bg-sky-500 dark:bg-cyan-400',
    },
    emerald: {
      pill: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/50',
      dot: 'bg-emerald-600 dark:bg-emerald-400',
    },
    amber: {
      pill: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/50',
      dot: 'bg-amber-600 dark:bg-amber-400',
    },
    rose: {
      pill: 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/50',
      dot: 'bg-rose-600 dark:bg-rose-400',
    },
    indigo: {
      pill: 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700/50',
      dot: 'bg-indigo-600 dark:bg-indigo-400',
    },
    slate: {
      pill: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/60',
      dot: 'bg-slate-500 dark:bg-slate-400',
    },
  };

  const current = styles[selected] || styles.slate;
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium border shadow-xs ${current.pill} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot} animate-pulse shrink-0`} />
      <span>{status}</span>
    </span>
  );
}
