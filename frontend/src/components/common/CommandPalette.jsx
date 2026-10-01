import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MapPin,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Moon,
  Sun,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CommandPalette({ isOpen, onClose, onSelectCase }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { title: 'Dashboard Analytics', icon: LayoutDashboard, path: '/dashboard', category: 'Navigation' },
    { title: 'Complaints Register', icon: FileText, path: '/complaints', category: 'Navigation' },
    { title: 'Prediction Center', icon: BrainCircuit, path: '/predictions', category: 'Navigation' },
    { title: 'Intelligence Map (Geospatial)', icon: MapPin, path: '/map', category: 'Navigation' },
    { title: 'Transaction Network (Graph)', icon: Share2, path: '/network', category: 'Navigation' },
    { title: 'Alerts & Investigation', icon: AlertTriangle, path: '/alerts', category: 'Navigation' },
    { title: 'Security Center & Roles', icon: ShieldCheck, path: '/security', category: 'Navigation' },
  ];

  const quickCases = [
    { id: 'CT-2026-001', title: 'UPI Fraud • Vadodara Centroid', amount: '₹4,50,000', risk: '84%', category: 'Cases' },
    { id: 'CT-2026-002', title: 'Investment Scam • Ahmedabad Satellite', amount: '₹8,00,000', risk: '82%', category: 'Cases' },
    { id: 'CT-3056-003', title: 'Phishing Ring • Mumbai Gateway', amount: '₹12,40,000', risk: '76%', category: 'Cases' },
    { id: 'CT-2034-007', title: 'Fake Job Racket • Surat Ring', amount: '₹3,20,000', risk: '48%', category: 'Cases' },
  ];

  const quickActions = [
    { title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', icon: isDark ? Sun : Moon, action: () => { toggleTheme(); onClose(); }, category: 'Actions' },
    { title: 'Register New Complaint', icon: FileText, action: () => { navigate('/complaints?action=new'); onClose(); }, category: 'Actions' },
  ];

  const filteredNav = quickNav.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));
  const filteredCases = quickCases.filter(
    (c) => c.id.toLowerCase().includes(query.toLowerCase()) || c.title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = quickActions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, case ID, city, or jump to page..."
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4">
          {/* Cases */}
          {filteredCases.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Active Cases
              </div>
              <div className="mt-1 space-y-1">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (onSelectCase) onSelectCase(c.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                        {c.id}
                      </span>
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {c.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {c.amount}
                      </span>
                      <span className="text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-1.5 py-0.5 rounded">
                        {c.risk}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Navigation
              </div>
              <div className="mt-1 space-y-1">
                {filteredNav.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.title}
                      onClick={() => {
                        navigate(n.path);
                        onClose();
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-medium">
                        <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <span>{n.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Actions
              </div>
              <div className="mt-1 space-y-1">
                {filteredActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.title}
                      onClick={a.action}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-medium">
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span>{a.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Action</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Navigate with arrows, Enter to select</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">ESC</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}
