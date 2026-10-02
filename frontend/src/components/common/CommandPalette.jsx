import React, { useState, useEffect, useRef } from 'react';
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
  CornerDownLeft,
  Command,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function CommandPalette({ isOpen, onClose, onSelectCase }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'cases' | 'nav' | 'actions'
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlightedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickNav = [
    { id: 'nav-1', title: 'Dashboard Analytics', subtitle: 'Real-time telemetry, ATM alerts & financial impact', icon: LayoutDashboard, path: '/dashboard', type: 'nav' },
    { id: 'nav-2', title: 'Complaints Register', subtitle: 'All FIRs, victim loss, suspect accounts & status', icon: FileText, path: '/complaints', type: 'nav' },
    { id: 'nav-3', title: 'Prediction Center (ML Engine)', subtitle: 'ATM cash-out forecasts & risk probabilities', icon: BrainCircuit, path: '/predictions', type: 'nav' },
    { id: 'nav-4', title: 'Intelligence Map (Geospatial)', subtitle: 'Mule clusters, active ATM corridors & intercept units', icon: MapPin, path: '/map', type: 'nav' },
    { id: 'nav-5', title: 'Transaction Network (Graph)', subtitle: 'Multi-hop graph visualization & mule layering hops', icon: Share2, path: '/network', type: 'nav' },
    { id: 'nav-6', title: 'Alerts & Investigation', subtitle: 'Live threat triage, cash-out timers & bank notices', icon: AlertTriangle, path: '/alerts', type: 'nav' },
    { id: 'nav-7', title: 'Security Center & Access Logs', subtitle: 'Role-based access, officer audit trails & key management', icon: ShieldCheck, path: '/security', type: 'nav' },
  ];

  const quickCases = [
    { id: 'CT-2026-001', title: 'UPI Fraud • Vadodara Centroid', subtitle: 'Layer 2 Mule Cluster — HDFC to SBI', amount: '₹4,50,000', risk: '84%', riskLevel: 'CRITICAL', type: 'case' },
    { id: 'CT-2026-002', title: 'Investment Scam • Ahmedabad Satellite', subtitle: 'Telegram Task Group — Multi-hop UPI', amount: '₹8,00,000', risk: '82%', riskLevel: 'CRITICAL', type: 'case' },
    { id: 'CT-3056-003', title: 'Phishing Ring • Mumbai Gateway', subtitle: 'NetBanking Credential Harvest syndicate', amount: '₹12,40,000', risk: '76%', riskLevel: 'HIGH', type: 'case' },
    { id: 'CT-2034-007', title: 'Fake Job Racket • Surat Ring', subtitle: 'Instant Personal Loan App Syndicate', amount: '₹3,20,000', risk: '48%', riskLevel: 'MEDIUM', type: 'case' },
  ];

  const quickActions = [
    { id: 'act-1', title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', subtitle: 'Toggle interface visual theme', icon: isDark ? Sun : Moon, action: () => { toggleTheme(); onClose(); }, type: 'action' },
    { id: 'act-2', title: 'Register New Fraud Complaint', subtitle: 'Initiate 1930 / I4C emergency case ingestion', icon: FileText, action: () => { navigate('/complaints?action=new'); onClose(); }, type: 'action' },
    { id: 'act-3', title: 'Export Daily Incident Report', subtitle: 'Compile PDF intelligence dossier for senior command', icon: ShieldCheck, action: () => { navigate('/dashboard'); onClose(); }, type: 'action' },
  ];

  // Filtering
  const filteredCases = (selectedFilter === 'all' || selectedFilter === 'cases')
    ? quickCases.filter((c) =>
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredNav = (selectedFilter === 'all' || selectedFilter === 'nav')
    ? quickNav.filter((n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredActions = (selectedFilter === 'all' || selectedFilter === 'actions')
    ? quickActions.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const allItems = [...filteredCases, ...filteredNav, ...filteredActions];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = allItems[highlightedIndex];
      if (item) {
        if (item.type === 'case') {
          if (onSelectCase) onSelectCase(item.id);
          else navigate(`/complaints?id=${item.id}`);
          onClose();
        } else if (item.type === 'nav') {
          navigate(item.path);
          onClose();
        } else if (item.type === 'action') {
          item.action();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      {/* Solid Elevated Command Palette Container */}
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-98 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Solid Search Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder="Search by case ID, suspect, bank, location or command..."
              className="flex-1 bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 rounded-lg text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Results', count: quickCases.length + quickNav.length + quickActions.length },
              { id: 'cases', label: 'Active Cases', count: quickCases.length },
              { id: 'nav', label: 'Navigation', count: quickNav.length },
              { id: 'actions', label: 'Actions', count: quickActions.length },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFilter(f.id);
                  setHighlightedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedFilter === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-850 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedFilter === f.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[55vh]">
          {allItems.length === 0 && (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Try searching for a Case ID (e.g. CT-2026-001) or a module name.
              </p>
            </div>
          )}

          {/* Section: Cases */}
          {filteredCases.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono flex items-center justify-between">
                <span>Active Cases & Dossiers</span>
                <span>{filteredCases.length} available</span>
              </div>
              <div className="mt-1 space-y-1">
                {filteredCases.map((c) => {
                  const globalIdx = allItems.findIndex((x) => x.id === c.id);
                  const isSelected = highlightedIndex === globalIdx;

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (onSelectCase) onSelectCase(c.id);
                        else navigate(`/complaints?id=${c.id}`);
                        onClose();
                      }}
                      onMouseEnter={() => setHighlightedIndex(globalIdx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-xs font-extrabold px-2 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                          {c.id}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                            {c.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {c.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 ml-2">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          {c.amount}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            c.riskLevel === 'CRITICAL'
                              ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                              : c.riskLevel === 'HIGH'
                              ? 'bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-900'
                              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                          }`}
                        >
                          {c.risk} Risk
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Navigation */}
          {filteredNav.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                System Navigation
              </div>
              <div className="mt-1 space-y-1">
                {filteredNav.map((n) => {
                  const globalIdx = allItems.findIndex((x) => x.id === n.id);
                  const isSelected = highlightedIndex === globalIdx;
                  const Icon = n.icon;

                  return (
                    <div
                      key={n.id}
                      onClick={() => {
                        navigate(n.path);
                        onClose();
                      }}
                      onMouseEnter={() => setHighlightedIndex(globalIdx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {n.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section: Quick Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                System Actions
              </div>
              <div className="mt-1 space-y-1">
                {filteredActions.map((a) => {
                  const globalIdx = allItems.findIndex((x) => x.id === a.id);
                  const isSelected = highlightedIndex === globalIdx;
                  const Icon = a.icon;

                  return (
                    <div
                      key={a.id}
                      onClick={a.action}
                      onMouseEnter={() => setHighlightedIndex(globalIdx)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition border ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {a.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {a.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        Execute
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Solid High-Contrast Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
