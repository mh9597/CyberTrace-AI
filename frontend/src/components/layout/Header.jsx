import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import CommandPalette from '../common/CommandPalette';
import AIAssistantDrawer from '../common/AIAssistantDrawer';

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else if (searchTerm.trim()) {
      navigate(`/complaints?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <>
      <header className="h-16 bg-[#F4F7FC] dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 select-none transition-colors duration-200">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 w-56 shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                CyberTrace <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Command Palette Trigger Search Box */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-500 dark:text-slate-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <span className="text-slate-400 dark:text-slate-500 truncate">
              Search cases, transactions, locations...
            </span>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions, AI Copilot, Theme Toggle & Officer Profile */}
        <div className="flex items-center gap-3">
          {/* Ask CyberTrace AI Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition cursor-pointer"
            title="Ask CyberTrace Copilot"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Icon Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/80 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">Notifications</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">3 unread</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto text-xs">
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/predictions');
                    }}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-200">High risk cash-out predicted</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ahmedabad - Satellite (82% probability)</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">2 min ago</span>
                  </div>
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/complaints');
                    }}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
                  >
                    <p className="font-medium text-slate-800 dark:text-slate-200">New complaint registered</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">CT-3026-002 • Investment Scam</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">5 min ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info with Police Inspector Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition cursor-pointer"
            >
              <img
                src="/images/inspector-avatar.png"
                alt={user?.full_name || 'Inspector Raj'}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs items-center justify-center hidden">
                {user?.full_name
                  ? user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'IR'}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {user?.full_name || 'Inspector Raj'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium capitalize">
                  {user?.role || 'Investigator'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user?.full_name || 'Inspector Raj'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {user?.email || 'Cyber Crime Cell, Gujarat'}
                  </p>
                </div>
                <Link
                  to="/security"
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Security Center</span>
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (logout) logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCase={(caseId) => {
          navigate(`/complaints?id=${caseId}`);
        }}
      />

      {/* Global AI Copilot Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectCase={(caseId) => {
          navigate(`/complaints?id=${caseId}`);
        }}
      />
    </>
  );
}
