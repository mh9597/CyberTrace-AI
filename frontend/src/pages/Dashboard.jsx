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
import IntelligenceMapCanvas from '../components/map/IntelligenceMapCanvas';

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

          {/* Interactive Threat Map Canvas (Google Maps + GIS) */}
          <div className="relative my-4 rounded-xl overflow-hidden border border-slate-200/80 h-[380px]">
            <IntelligenceMapCanvas
              onSelectHotspot={(spot) => openCaseModal(spot.caseId || 'CT-3026-002')}
              showPopup={true}
            />
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
