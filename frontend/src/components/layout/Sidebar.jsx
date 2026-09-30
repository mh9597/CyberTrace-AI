import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MapPin,
  GitFork,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Cpu,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Complaints', href: '/complaints', icon: FileText },
  { name: 'Prediction Center', href: '/predictions', icon: BrainCircuit },
  { name: 'Intelligence Map', href: '/map', icon: MapPin },
  { name: 'Transaction Network', href: '/network', icon: GitFork },
  { name: 'Alerts & Investigation', href: '/alerts', icon: AlertTriangle },
  { name: 'Security Center', href: '/security', icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white/90 backdrop-blur-md border-r border-[#E2E8F0] flex flex-col justify-between py-5 shrink-0 select-none z-30 transition-all">
      <div className="space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
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
      <div className="px-4 space-y-3">
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 flex items-center gap-1.5 font-medium text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>RF-DBSCAN v2.4</span>
            </span>
            <span className="font-semibold text-emerald-600 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Gujarat Law Enforcement Node
          </p>
        </div>

        <div className="text-[10px] text-slate-400 font-medium text-center">
          CyberTrace AI &bull; SIH 2026
        </div>
      </div>
    </aside>
  );
}
