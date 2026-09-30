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
import IntelligenceMapCanvas, { HOTSPOTS } from '../components/map/IntelligenceMapCanvas';

export default function IntelligenceMap() {
  const { openCaseModal } = useCaseModal();
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmedabad');
  const [selectedRisk, setSelectedRisk] = useState('All Levels');
  const [activeViewMode, setActiveViewMode] = useState('Heatmap View');
  const [mapEngine, setMapEngine] = useState('google'); // 'google' | 'leaflet'
  const [showPopup, setShowPopup] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(HOTSPOTS[0]);
  const [coordsDisplay, setCoordsDisplay] = useState('23.0225° N, 72.5714° E');

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

        <div className="flex flex-wrap items-center gap-3">
          {/* Map Engine Toggle Switcher */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                mapEngine === 'google'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mapEngine === 'google' ? 'bg-white' : 'bg-blue-600'}`}></span>
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => setMapEngine('leaflet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                mapEngine === 'leaflet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mapEngine === 'leaflet' ? 'bg-white' : 'bg-emerald-600'}`}></span>
              <span>Leaflet OSM</span>
            </button>
          </div>

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
          {/* Real Interactive Map Canvas (Google Maps + GIS) */}
          <IntelligenceMapCanvas
            engine={mapEngine}
            onEngineChange={setMapEngine}
            activeViewMode={activeViewMode}
            layers={layers}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedRisk={selectedRisk}
            selectedHotspot={selectedHotspot}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            onSelectHotspot={(spot) => {
              setSelectedHotspot(spot);
              openCaseModal(spot.caseId || 'CT-3026-002');
            }}
            onCoordinatesChange={(lat, lng) => {
              setCoordsDisplay(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
            }}
          />

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
              Coordinates: {coordsDisplay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
