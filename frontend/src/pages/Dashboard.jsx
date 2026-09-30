import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Activity,
  AlertTriangle,
  Cpu,
  Calendar,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Layers,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import {
  MOCK_STATS,
  HIGH_RISK_ZONES,
  RECENT_ACTIVITIES,
} from '../data/mockData';
import { useCaseModal } from '../components/layout/Layout';

export default function Dashboard() {
  const navigate = useNavigate();
  const { openCaseModal } = useCaseModal();
  const [selectedRange, setSelectedRange] = useState('Last 7 Days');
  const [activeZone, setActiveZone] = useState('Ahmedabad');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time overview of cybercrime intelligence
          </p>
        </div>

        {/* Date Selector & Range dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>01 Oct 2026 - 12 Oct 2026</span>
          </div>
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4 KPI Cards matching Panel 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Cases */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Cases</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {MOCK_STATS.totalCases}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>{MOCK_STATS.casesTrend}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Investigations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Investigations</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {MOCK_STATS.activeInvestigations}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>{MOCK_STATS.investigationsTrend}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: High Risk Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">High Risk Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {MOCK_STATS.highRiskAlerts}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-red-600">
              <TrendingUp className="w-3 h-3" />
              <span>{MOCK_STATS.alertsTrend}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Prediction Accuracy */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Prediction Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900">
              {MOCK_STATS.predictionAccuracy}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-cyan-600">
              <TrendingUp className="w-3 h-3" />
              <span>{MOCK_STATS.accuracyTrend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area: Heatmap Map (Left) + High Risk Zones & Recent Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Large India & Gujarat Threat Risk Heatmap */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Geospatial Risk Distribution & Hotspots</span>
              </h2>
              <p className="text-xs text-slate-500">
                AI cluster predictions and predicted cash-out centroids
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/map')}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Map</span>
              </button>
            </div>
          </div>

          {/* Interactive Simulated Threat Map Canvas */}
          <div className="relative my-4 rounded-xl overflow-hidden bg-gradient-to-tr from-slate-50 via-blue-50/20 to-slate-100 border border-slate-100 h-[380px] flex items-center justify-center">
            {/* Visual SVG Map of Gujarat/India Region */}
            <svg
              viewBox="0 0 700 400"
              className="w-full h-full object-contain"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Radial Glow Filters for Heatmap */}
                <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.85" />
                  <stop offset="40%" stopColor="#F97316" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#FBBF24" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="heatYellow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EAB308" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#22C55E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* State/Coast Outline Silhouette */}
              <path
                d="M150,120 Q200,90 260,110 T380,80 T460,110 T520,160 T480,240 T420,300 T340,340 T260,330 T200,280 T160,220 Z"
                fill="#EFF6FF"
                stroke="#BFDBFE"
                strokeWidth="2"
              />
              <path
                d="M220,160 Q280,140 330,170 T360,230 T320,280 T240,260 Z"
                fill="#DBEAFE"
                stroke="#93C5FD"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Heatmap Glow Circles */}
              {/* Ahmedabad (Primary High-Risk Hotspot) */}
              <circle cx="310" cy="180" r="90" fill="url(#heatRed)" />
              <circle cx="310" cy="180" r="45" fill="url(#heatRed)" />
              <circle cx="310" cy="180" r="8" fill="#DC2626" />
              <circle cx="310" cy="180" r="24" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />

              {/* Vadodara */}
              <circle cx="350" cy="220" r="60" fill="url(#heatOrange)" />
              <circle cx="350" cy="220" r="6" fill="#EA580C" />

              {/* Surat */}
              <circle cx="340" cy="275" r="55" fill="url(#heatOrange)" />
              <circle cx="340" cy="275" r="6" fill="#D97706" />

              {/* Rajkot */}
              <circle cx="230" cy="210" r="45" fill="url(#heatYellow)" />
              <circle cx="230" cy="210" r="5" fill="#2563EB" />

              {/* Mumbai */}
              <circle cx="370" cy="330" r="45" fill="url(#heatYellow)" />
              <circle cx="370" cy="330" r="5" fill="#4F46E5" />

              {/* Connecting Intelligence Vectors */}
              <line x1="310" y1="180" x2="350" y2="220" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="350" y1="220" x2="340" y2="275" stroke="#F97316" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="310" y1="180" x2="230" y2="210" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="340" y1="275" x2="370" y2="330" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 2" />
            </svg>

            {/* Floating marker tooltips */}
            <div
              onClick={() => openCaseModal('CT-3026-002')}
              className="absolute top-[32%] left-[44%] -translate-x-1/2 -translate-y-full bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-red-200 cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-900">Ahmedabad - Satellite</span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded-md">
                  82%
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Click for case details</div>
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 text-[11px] flex items-center gap-4 text-slate-600 shadow-xs">
              <span className="font-semibold text-slate-800">Intensity:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Critical (&gt;75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Elevated (50-75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Monitored (&lt;50%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High Risk Zones (Top) & Recent Activity (Bottom) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: High Risk Zones */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                High Risk Zones
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Gujarat Region</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {HIGH_RISK_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setActiveZone(zone.name)}
                  className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition cursor-pointer ${
                    activeZone === zone.name ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-xs flex items-center justify-center font-bold">
                      {zone.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {zone.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${zone.badgeColor}`}
                  >
                    {zone.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/map')}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              View Full Map
            </button>
          </div>

          {/* Card: Recent Activity matching Panel 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Activity
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="space-y-3 mt-3">
              {RECENT_ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.iconColor}`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{act.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
