import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  User,
  UserCog,
  BadgeCheck,
  Edit3,
  Shield,
  Lock,
  LogOut,
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MapPin,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Menu,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CommandPalette from '../common/CommandPalette';
import ProfileEditModal from '../profile/ProfileEditModal';
import api from '../../services/api';

const NAV_ITEMS = [
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
    badge: null,
  },
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
];

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [criticalAlertCount, setCriticalAlertCount] = useState(3);

  const hoverTimeoutRef = useRef(null);

  const handleProfileMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowProfileMenu(true);
  };

  const handleProfileMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowProfileMenu(false);
    }, 200);
  };

  // RBAC Dynamic Navigation Filtering
  const visibleNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      // Investigators are restricted from Security Center & Audit Vault
      if (item.href === '/security' && (!user?.role || user?.role === 'investigator')) {
        return false;
      }
      return true;
    });
  }, [user?.role]);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  // Fetch active alerts count for badge
  useEffect(() => {
    api
      .get('/alerts')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.alerts || [];
        const high = list.filter(
          (a) => a.severity === 'HIGH' || a.severity === 'CRITICAL'
        ).length;
        if (high > 0) setCriticalAlertCount(high);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shrink-0 select-none transition-colors duration-200 shadow-2xs">
        {/* Top Tier: Brand, Global Search, AI Copilot, User Profile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                  CyberTrace <span className="text-blue-600 dark:text-blue-400">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide hidden sm:block">
                  National Cyber Threat Command
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Command Palette Trigger Search Box (Desktop) */}
          <div className="flex-1 max-w-md hidden md:block">
            <div
              onClick={() => setIsCommandPaletteOpen(true)}
              className="relative w-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl pl-9 pr-14 py-2 text-xs text-slate-600 dark:text-slate-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <span className="text-slate-500 dark:text-slate-400 font-medium truncate">
                Search cases, suspects, ATM clusters...
              </span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono font-bold shadow-2xs">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions, Notifications, Theme & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950 animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      Live Incident Feed
                    </span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                      {criticalAlertCount} Active
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto text-xs">
                    <div
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/predictions');
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        High risk cash-out predicted
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Ahmedabad - Satellite corridor (82% probability)
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        2 min ago
                      </span>
                    </div>
                    <div
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/complaints');
                      }}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                    >
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        New complaint registered
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        CT-3026-002 • Investment Scam (₹8,00,000)
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        5 min ago
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Container with Smooth Mouse Hover & Micro-Animations */}
            <div
              className="relative"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/80 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/30 transition-all duration-200">
                    {user?.full_name
                      ? user.full_name
                          .split(' ')
                          .filter(Boolean)
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'IR'}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
                </div>

                <div className="text-left hidden lg:block leading-tight">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user?.full_name || 'Inspector Raj'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium capitalize flex items-center gap-1">
                    <span>{user?.role ? user.role.replace('_', ' ') : 'Investigator'}</span>
                  </div>
                </div>

                {/* Role Badge Indicator */}
                {user?.role === 'senior_officer' && (
                  <span className="hidden xl:inline-flex items-center gap-1 font-extrabold text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <ShieldCheck className="w-2.5 h-2.5 text-purple-600" />
                    SUPERVISORY COMMAND
                  </span>
                )}
                {user?.role === 'admin' && (
                  <span className="hidden xl:inline-flex items-center gap-1 font-extrabold text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                    PLATFORM ADMINISTRATOR
                  </span>
                )}
                {(!user?.role || user?.role === 'investigator') && (
                  <span className="hidden xl:inline-flex items-center gap-1 font-extrabold text-[9px] tracking-wide px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Shield className="w-2.5 h-2.5 text-blue-600" />
                    IO • CYBER CRIME
                  </span>
                )}

                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 hidden sm:block ${
                    showProfileMenu ? 'rotate-180 text-blue-500' : ''
                  }`}
                />
              </button>

              {/* Animated Floating Profile Dropdown Card */}
              <div
                className={`absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 py-2 z-50 transform origin-top-right transition-all duration-200 ease-out ${
                  showProfileMenu
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                {/* Officer Identity Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/20 dark:from-slate-800/50 dark:via-indigo-950/20 dark:to-transparent rounded-t-2xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                      {user?.full_name
                        ? user.full_name
                            .split(' ')
                            .filter(Boolean)
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : 'IR'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user?.full_name || 'Inspector Raj'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'officer@cybertrace.gov.in'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px]">
                    <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 capitalize border border-blue-200 dark:border-blue-900">
                      <BadgeCheck className="w-3 h-3" />
                      {user?.role ? user.role.replace('_', ' ') : 'Investigator'}
                    </span>
                    <span className="font-mono text-slate-400 dark:text-slate-500">
                      {user?.badge_number || 'POL-7729'}
                    </span>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="py-1.5 px-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <UserCog className="w-3.5 h-3.5" />
                    </div>
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (logout) logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer group"
                  >
                    <div className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 group-hover:scale-110 transition-transform">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Lower Tier: Horizontal Navigation Bar (Desktop & Tablets) */}
        <div className="hidden md:block border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 py-1.5 overflow-x-auto no-scrollbar">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive: active }) =>
                      `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 shrink-0 select-none ${
                        active
                          ? 'bg-blue-600 text-white font-semibold shadow-xs shadow-blue-500/20'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
                      }`
                    }
                  >
                    {({ isActive: active }) => (
                      <>
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            active ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>

                        {item.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                              active
                                ? 'bg-white/20 text-white'
                                : item.badgeColor === 'rose'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
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
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="mb-2">
              <div
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  <span>Search cases, locations...</span>
                </div>
                <span className="font-mono text-[10px]">Ctrl+K</span>
              </div>
            </div>

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
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
          </div>
        )}
      </header>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCase={(caseId) => {
          navigate(`/complaints?id=${caseId}`);
        }}
      />

      {/* Officer Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
