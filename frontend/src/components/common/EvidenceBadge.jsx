import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Database, FileText } from 'lucide-react';

/**
 * EvidenceBadge — Dual mode copyable provenance and digest pill
 * @param {string} value
 * @param {'ref' | 'hash' | 'synthetic' | 'model'} type
 * @param {string} label
 */
export default function EvidenceBadge({
  value,
  type = 'ref',
  label,
  className = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const icons = {
    ref: FileText,
    hash: ShieldCheck,
    synthetic: Database,
    model: ShieldCheck,
  };

  const Icon = icons[type] || FileText;

  const displayVal =
    type === 'hash' && value?.length > 16
      ? `${value.substring(0, 8)}...${value.substring(value.length - 8)}`
      : value;

  return (
    <div
      onClick={handleCopy}
      title={`Click to copy: ${value}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 hover:border-cyan-500/50 text-slate-700 dark:text-slate-300 font-mono text-[11px] cursor-pointer transition select-none group ${className}`}
    >
      <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
      {label && <span className="text-slate-500 dark:text-slate-400 font-sans">{label}:</span>}
      <span className="text-cyan-700 dark:text-cyan-300 font-bold">{displayVal}</span>
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 ml-0.5" />
      ) : (
        <Copy className="w-3 h-3 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 shrink-0 ml-0.5 opacity-0 group-hover:opacity-100 transition" />
      )}
    </div>
  );
}
