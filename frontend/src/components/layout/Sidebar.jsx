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
    <aside className="w-60 bg-[#F4F7FC] dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between pt-3 pb-0 shrink-0 select-none z-30 relative overflow-hidden transition-colors duration-200">
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

      {/* Bottom Heritage Wave Illustration */}
      <div className="relative w-full mt-auto pointer-events-none select-none opacity-90 dark:opacity-40">
        <img
          src="/images/sidebar-bottom-wave.png"
          alt="Indian Heritage Wave"
          className="w-full h-auto object-contain"
        />
      </div>
    </aside>
  );
}
