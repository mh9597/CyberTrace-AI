import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  Calendar,
  Layers,
  ChevronDown,
  Navigation,
  Eye,
  ShieldAlert,
  Flame,
  Globe,
  Compass,
} from 'lucide-react';
import { useCaseModal } from '../components/layout/Layout';

export default function IntelligenceMap() {
  const { openCaseModal } = useCaseModal();
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');
  const [selectedRisk, setSelectedRisk] = useState('All Levels');
  const [activeViewMode, setActiveViewMode] = useState('Heatmap View');
  const [showPopup, setShowPopup] = useState(true);

  const [layers, setLayers] = useState({
    predicted: true,
    historical: true,
    atm: true,
    active: true,
  });

  const toggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching Panel 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Intelligence Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View predicted hotspots, historical patterns and risk zones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Risk Zones Active</span>
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Filter Panel + Right Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Panel matching Panel 5 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Filters
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 font-semibold block mb-1">
                  Select State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>Gujarat</option>
                  <option>Maharashtra</option>
                  <option>Rajasthan</option>
                  <option>Delhi NCR</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">
                  Select District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>Ahmedabad</option>
                  <option>Surat</option>
                  <option>Vadodara</option>
                  <option>Rajkot</option>
                  <option>Gandhinagar</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">
                  Date Range
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>01 Oct 2026 - 12 Oct 2026</span>
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-semibold block mb-1">
                  Risk Level
                </label>
                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option>All Levels</option>
                  <option>High Risk (&gt;75%)</option>
                  <option>Medium Risk (50-75%)</option>
                  <option>Low Risk (&lt;50%)</option>
                </select>
              </div>

              <button
                onClick={() => alert(`Filters applied for ${selectedDistrict}, ${selectedState}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Map Layers
            </h4>
            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.predicted}
                  onChange={() => toggleLayer('predicted')}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                <span className="text-slate-700 font-medium">Predicted Locations</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.historical}
                  onChange={() => toggleLayer('historical')}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                <span className="text-slate-700 font-medium">Historical Hotspots</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.atm}
                  onChange={() => toggleLayer('atm')}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-slate-700 font-medium">ATM / Branch Locations</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers.active}
                  onChange={() => toggleLayer('active')}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-slate-700 font-medium">Active Cases</span>
              </label>
            </div>
          </div>
        </div>

        {/* Center: Large Interactive Map Canvas matching Panel 5 */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between min-h-[560px] relative overflow-hidden">
          {/* Map Surface View */}
          <div className="relative w-full h-[460px] rounded-xl bg-[#E8EEF5] border border-slate-200/80 overflow-hidden flex items-center justify-center">
            {/* Visual GIS Vector Map / Street Grid */}
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full object-cover"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1D5DB" strokeWidth="0.5" opacity="0.4" />
                </pattern>
                {/* River / Road networks */}
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
              </defs>

              <rect width="800" height="500" fill="#F0F4F8" />
              <rect width="800" height="500" fill="url(#grid)" />

              {/* Sabarmati River curve */}
              <path
                d="M 420 0 Q 390 120 440 250 T 410 500"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="16"
                opacity="0.75"
              />

              {/* Main Highways / Arteries */}
              <line x1="0" y1="200" x2="800" y2="280" stroke="#FFFFFF" strokeWidth="6" />
              <line x1="0" y1="200" x2="800" y2="280" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="280" y1="0" x2="350" y2="500" stroke="#FFFFFF" strokeWidth="5" />
              <line x1="560" y1="0" x2="480" y2="500" stroke="#FFFFFF" strokeWidth="4" />

              {/* Concentric Danger Heat Rings radiating from Satellite (Ahmedabad) */}
              {layers.predicted && (
                <>
                  <circle cx="320" cy="220" r="140" fill="#EF4444" fillOpacity="0.08" stroke="#EF4444" strokeOpacity="0.25" strokeWidth="1.5" />
                  <circle cx="320" cy="220" r="95" fill="#F97316" fillOpacity="0.12" stroke="#F97316" strokeOpacity="0.4" strokeWidth="1.5" />
                  <circle cx="320" cy="220" r="55" fill="#EF4444" fillOpacity="0.25" stroke="#EF4444" strokeOpacity="0.6" strokeWidth="2" />
                  <circle cx="320" cy="220" r="16" fill="#DC2626" />
                  <circle cx="320" cy="220" r="28" fill="none" stroke="#DC2626" strokeWidth="2" className="animate-ping" opacity="0.5" />
                </>
              )}

              {/* Other Pins */}
              {layers.historical && (
                <>
                  <circle cx="480" cy="180" r="8" fill="#2563EB" />
                  <circle cx="210" cy="310" r="7" fill="#2563EB" />
                </>
              )}

              {layers.atm && (
                <>
                  <circle cx="360" cy="240" r="6" fill="#F59E0B" />
                  <circle cx="300" cy="170" r="6" fill="#F59E0B" />
                  <circle cx="380" cy="280" r="6" fill="#F59E0B" />
                </>
              )}

              {layers.active && (
                <>
                  <circle cx="290" cy="250" r="7" fill="#10B981" />
                  <circle cx="450" cy="260" r="7" fill="#10B981" />
                </>
              )}
            </svg>

            {/* Popup Card matching Panel 5 */}
            {showPopup && (
              <div
                className="absolute top-[28%] left-[40%] bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-64 z-20 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    <h4 className="font-bold text-xs text-slate-900">Ahmedabad - Satellite</h4>
                  </div>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5 my-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Score:</span>
                    <span className="font-bold text-red-600">82%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Time:</span>
                    <span className="font-semibold text-slate-800">10 AM – 2 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Related Cases:</span>
                    <span className="font-semibold text-slate-800">5 Cases</span>
                  </div>
                </div>

                <button
                  onClick={() => openCaseModal('CT-3026-002')}
                  className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                >
                  View Cases
                </button>
              </div>
            )}
          </div>

          {/* Bottom Map View Controls matching Panel 5 */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['Heatmap View', 'Cluster View', 'Satellite View', '3D View'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveViewMode(mode)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeViewMode === mode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Coordinates: 23.0225° N, 72.5714° E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
