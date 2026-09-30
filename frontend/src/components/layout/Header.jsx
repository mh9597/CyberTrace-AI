import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  Bell,
  AlertTriangle,
  ChevronDown,
  Globe,
  User,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else if (searchTerm.trim()) {
      navigate(`/complaints?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-[#0F172A] leading-tight flex items-center gap-1.5">
              CyberTrace <span className="text-blue-600">AI</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases, transactions, locations..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </form>

      {/* Right: Actions, Public Portal Link & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Landing Page Portal Link */}
        <Link
          to="/landing"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
          title="View Landing Page"
        >
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Landing Page</span>
        </Link>

        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200/60"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-medium">3 unread</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto text-xs">
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-medium text-slate-800">High risk cash-out predicted</p>
                  <p className="text-[11px] text-slate-500">Ahmedabad - Satellite (82% probability)</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 min ago</span>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-medium text-slate-800">New complaint registered</p>
                  <p className="text-[11px] text-slate-500">CT-3026-002 • UPI Fraud</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">5 min ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tactical Alert Icon */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition border border-slate-200/60"
          title="Active Alerts"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-mono text-[9px] font-bold">
            5
          </span>
        </Link>

        {/* User Profile Info */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              IR
            </div>
            <div className="text-left hidden sm:block leading-tight">
              <div className="text-xs font-semibold text-slate-900">Inspector Raj</div>
              <div className="text-[11px] text-slate-500">Investigator</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Inspector Raj</p>
                <p className="text-[10px] text-slate-500">Cyber Crime Cell, Gujarat</p>
              </div>
              <Link
                to="/security"
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
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
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
