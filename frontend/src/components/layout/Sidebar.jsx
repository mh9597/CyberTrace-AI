import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MapPin,
  Share2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Radio,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const NAV_SECTIONS = [
  {
    title: 'COMMAND & CONTROL',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        badge: null,
      },
      {
        name: 'Complaints',
        href: '/complaints',
        icon: FileText,
        badge: 'Live',
        badgeColor: 'blue',
      },
    ],
  },
  {
    title: 'FORENSIC INTELLIGENCE',
    items: [
      {
        name: 'Prediction Center',
        href: '/predictions',
        icon: BrainCircuit,
        badge: 'AI v2.4',
        badgeColor: 'purple',
      },
      {
        name: 'Intelligence Map',
        href: '/map',
        icon: MapPin,
        badge: null,
      },
      {
        name: 'Transaction Network',
        href: '/network',
        icon: Share2,
        badge: null,
      },
    ],
  },
  {
    title: 'INCIDENT RESPONSE',
    items: [
      {
        name: 'Alerts & Investigation',
        href: '/alerts',
        icon: AlertTriangle,
        badge: '3 Critical',
        badgeColor: 'rose',
        pulse: true,
      },
      {
        name: 'Security Center',
        href: '/security',
        icon: ShieldCheck,
        badge: null,
      },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeThreats: 3,
    riskScore: 84,
    nodeStatus: 'ONLINE',
  });

  const visibleSections = useMemo(() => {
    return NAV_SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter((item) => {
        if (item.href === '/security' && (!user?.role || user?.role === 'investigator')) {
          return false;
        }
        return true;
      }),
    })).filter((sec) => sec.items.length > 0);
  }, [user?.role]);

  useEffect(() => {
    // Check live alerts count if available
    api
      .get('/alerts')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.alerts || [];
        const highAlerts = list.filter(
          (a) => a.severity === 'HIGH' || a.severity === 'CRITICAL'
        ).length;
        if (highAlerts > 0) {
          setStats((prev) => ({ ...prev, activeThreats: highAlerts }));
        }
      })
      .catch(() => {
        // keep default
      });
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between py-4 shrink-0 select-none z-30 transition-colors duration-200 shadow-xs">
      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 space-y-5 custom-scrollbar">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            {/* Section Header */}
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 font-mono uppercase">
              {section.title}
            </div>

            {/* Section Links */}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive: active }) =>
                      `group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                        active
                          ? 'bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold shadow-xs border border-blue-500/20 dark:border-blue-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-900/80 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive: active }) => (
                      <>
                        {/* Active Left Pill Bar Indicator */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full shadow-sm" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg transition-colors duration-150 ${
                              active
                                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-800 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                          </div>
                          <span className="truncate tracking-tight">{item.name}</span>
                        </div>

                        {/* Optional Badges */}
                        {item.badge && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {item.pulse && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                                item.badgeColor === 'rose'
                                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                                  : item.badgeColor === 'purple'
                                  ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900'
                                  : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                              }`}
                            >
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Modern System & Threat Telemetry Card at Bottom (Replaces old wave image) */}
      <div className="px-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-900 space-y-2.5">
        <div className="p-3 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          {/* Header Status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                Threat Matrix
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              {stats.nodeStatus}
            </span>
          </div>

          {/* Risk Metric Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>National Risk Index</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{stats.riskScore}% HIGH</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.riskScore}%` }}
              />
            </div>
          </div>

          {/* Active AI Core indicator */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 truncate">
              <Sparkles className="w-3 h-3 text-blue-500" />
              RF-DBSCAN + GPT-4o
            </span>
            <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
              v2.4
            </span>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="text-[10px] text-center text-slate-400 dark:text-slate-600 font-mono">
          CYBERTRACE • LAW ENFORCEMENT
        </div>
      </div>
    </aside>
  );
}
