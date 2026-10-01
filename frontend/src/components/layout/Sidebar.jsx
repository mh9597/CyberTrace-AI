import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MapPin,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Complaints', href: '/complaints', icon: FileText },
  { name: 'Prediction Center', href: '/predictions', icon: BrainCircuit },
  { name: 'Intelligence Map', href: '/map', icon: MapPin },
  { name: 'Transaction Network', href: '/network', icon: Share2 },
  { name: 'Alerts & Investigation', href: '/alerts', icon: AlertTriangle },
  { name: 'Security Center', href: '/security', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#F4F7FC] dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between pt-3 pb-4 shrink-0 select-none z-30 relative overflow-hidden transition-colors duration-200">
      <div className="space-y-4 relative z-10 px-3">
        {/* Navigation list */}
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#E1ECFE] dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Officer / Engine Status */}
      <div className="px-3 space-y-2 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>RF-DBSCAN v2.7</span>
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Gujarat Law Enforcement Node
          </p>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-center">
          CyberTrace AI &bull; SIH 2026
        </div>
      </div>
    </aside>
  );
}
