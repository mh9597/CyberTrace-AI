import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  BrainCircuit,
  MapPin,
  GitFork,
  AlertTriangle,
  Lock,
  Activity,
  Cpu,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, badge: 'Live' },
  { name: 'Complaints', href: '/complaints', icon: FileSpreadsheet, badge: 'Registry' },
  { name: 'Prediction Center', href: '/predictions', icon: BrainCircuit, badge: 'AI ML' },
  { name: 'Intelligence Map', href: '/map', icon: MapPin, badge: 'DBSCAN' },
  { name: 'Transaction Network', href: '/network', icon: GitFork, badge: 'Topology' },
  { name: 'Alerts & Workflow', href: '/alerts', icon: AlertTriangle, badge: 'Action' },
  { name: 'Security Center', href: '/security', icon: Lock, badge: 'SHA-256' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-50/95 dark:bg-slate-950/80 border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between py-5 shrink-0 select-none backdrop-blur-xl transition-colors duration-200">
      <div className="space-y-6">
        <div className="px-5">
          <p className="text-[11px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase font-semibold">
            Command Modules
          </p>
        </div>

        <nav className="space-y-1.5 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-sky-50 text-cyan-900 border-sky-300 font-semibold shadow-xs dark:bg-gradient-to-r dark:from-cyan-950/80 dark:to-slate-900 dark:text-cyan-300 dark:border-cyan-700/50 dark:shadow-cyan-500/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border-transparent dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60'
                  } border`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                          isActive
                            ? 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700/40 font-semibold'
                            : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-500 dark:border-slate-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry & Model Status */}
      <div className="px-4 space-y-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-800 dark:text-slate-300 flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>RF-DBSCAN v1.0</span>
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/50">
              OPTIMAL
            </span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono space-y-0.5">
            <div>Spatial Centroid: ±1.2 km</div>
            <div>Avg Lead Window: 38 min</div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 text-center">
          Decision Support System &bull; SIH 2026
        </div>
      </div>
    </aside>
  );
}
