import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Filter, Calendar, Layers, ChevronDown,
  Navigation, Eye, ShieldAlert, Globe, Zap,
  BarChart2, RefreshCw, Download, Clock, Target,
} from "lucide-react";
import { useCaseModal } from "../components/layout/Layout";

const HOTSPOTS = [
  { id: 1, city: "Ahmedabad - Satellite", lat: 23.0225, lng: 72.5714, risk: "Critical", riskScore: 82, cases: 24, trend: "+14%", cashOutWindow: "10 AM - 2 PM", fraudType: "UPI Fraud / Mule Accounts", color: "#DC2626", badgeColor: "bg-red-50 text-red-700 border-red-200", caseId: "CT-3026-002" },
  { id: 2, city: "Vadodara", lat: 22.3072, lng: 73.1812, risk: "High", riskScore: 64, cases: 16, trend: "+8%", cashOutWindow: "11 AM - 3 PM", fraudType: "Investment Scam", color: "#EA580C", badgeColor: "bg-orange-50 text-orange-700 border-orange-200", caseId: "CT-3026-005" },
  { id: 3, city: "Surat", lat: 21.1702, lng: 72.8311, risk: "High", riskScore: 58, cases: 12, trend: "+5%", cashOutWindow: "2 PM - 6 PM", fraudType: "Card Cloning", color: "#D97706", badgeColor: "bg-amber-50 text-amber-700 border-amber-200", caseId: "CT-3026-001" },
  { id: 4, city: "Rajkot", lat: 22.3039, lng: 70.8022, risk: "Medium", riskScore: 36, cases: 8, trend: "+3%", cashOutWindow: "9 AM - 12 PM", fraudType: "KYC Fraud", color: "#2563EB", badgeColor: "bg-blue-50 text-blue-700 border-blue-200", caseId: "CT-3026-003" },
  { id: 5, city: "Gandhinagar", lat: 23.2156, lng: 72.6369, risk: "Low", riskScore: 22, cases: 4, trend: "-2%", cashOutWindow: "3 PM - 5 PM", fraudType: "Phishing", color: "#0891B2", badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200", caseId: "CT-3026-004" },
];
const ZONE_STATS = [
  { label: "Active Zones", value: "12", icon: Target, color: "text-red-600", bg: "bg-red-50" },
  { label: "Predicted ATMs", value: "38", icon: MapPin, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Hotspot Radius", value: "2.4 km", icon: Navigation, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "AI Confidence", value: "87%", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
];
const MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyASeiOhzKOyOOPditkIRxtsC8CPbuQ-dI4";


function GoogleMapView({ layers, viewMode }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const overlaysRef = useRef([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    function attachMap() {
      if (!ref.current || mapRef.current) return;
      try {
        const google = window.google;
        const map = new google.maps.Map(ref.current, {
          center: { lat: 22.5, lng: 72.2 },
          zoom: 8,
          mapTypeId: "roadmap",
          tilt: 0,
          styles: [
            { featureType: "all", elementType: "geometry.fill", stylers: [{ color: "#f0f4f8" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#bfdbfe" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c7d2fe" }] },
            { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#e2e8f0" }] },
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#1e293b" }] },
          ],
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        mapRef.current = map;
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    }

    if (window.google && window.google.maps) { attachMap(); return; }
    if (window._gmapsLoading) { window._gmapsLoading.then(attachMap).catch(() => setStatus("error")); return; }
    window._gmapsLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}`;
      s.async = true; s.defer = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Maps load failed"));
      document.head.appendChild(s);
    });
    window._gmapsLoading.then(attachMap).catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    if (viewMode === "Satellite") { map.setMapTypeId("hybrid"); map.setTilt(0); }
    else if (viewMode === "3D") { map.setMapTypeId("hybrid"); map.setTilt(45); map.setHeading(90); }
    else { map.setMapTypeId("roadmap"); map.setTilt(0); }
  }, [viewMode, status]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || status !== "ready") return;
    const google = window.google;
    overlaysRef.current.forEach(o => o.setMap && o.setMap(null));
    overlaysRef.current = [];
    const clusterScale = viewMode === "Cluster";
    HOTSPOTS.forEach(spot => {
      if (layers.predicted) {
        const c = new google.maps.Circle({
          strokeColor: spot.color, strokeOpacity: 0.7, strokeWeight: 2,
          fillColor: spot.color, fillOpacity: viewMode === "Heatmap" ? 0.2 : 0.07,
          map, center: { lat: spot.lat, lng: spot.lng }, radius: spot.riskScore * 450,
        });
        overlaysRef.current.push(c);
      }
      if (layers.historical) {
        const m = new google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng }, map, title: spot.city,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: clusterScale ? 14 + spot.riskScore / 8 : 10 + spot.riskScore / 10,
            fillColor: spot.color, fillOpacity: 0.95, strokeWeight: 3, strokeColor: "#FFFFFF",
          },
        });
        const iw = new google.maps.InfoWindow({
          content: `<div style="font-family:Inter,sans-serif;padding:12px;min-width:190px;border-radius:8px">
            <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:6px">${spot.city}</div>
            <div style="font-size:12px;color:#64748b">Risk: <strong style="color:${spot.color}">${spot.riskScore}%</strong> &middot; ${spot.cases} cases</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:4px">Window: ${spot.cashOutWindow}</div>
            <div style="font-size:11px;color:#94a3b8">Type: ${spot.fraudType}</div>
          </div>`
        });
        m.addListener("click", () => iw.open(map, m));
        overlaysRef.current.push(m);
      }
      if (layers.atm) {
        const a = new google.maps.Marker({
          position: { lat: spot.lat + 0.02, lng: spot.lng + 0.02 }, map,
          icon: { path: "M -5,-5 L 5,-5 L 5,5 L -5,5 Z", fillColor: "#F59E0B", fillOpacity: 0.9, strokeWeight: 2, strokeColor: "#FFFFFF", scale: 1.2 },
        });
        overlaysRef.current.push(a);
      }
      if (layers.active) {
        const ac = new google.maps.Marker({
          position: { lat: spot.lat - 0.02, lng: spot.lng - 0.02 }, map,
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 5, fillColor: "#10B981", fillOpacity: 0.9, strokeWeight: 2, strokeColor: "#FFFFFF" },
        });
        overlaysRef.current.push(ac);
      }
    });
  }, [layers, viewMode, status]);

  return (
    <div className="relative w-full h-full">
      <div ref={ref} className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center z-10">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">Loading Intelligence Map...</p>
            <p className="text-xs text-slate-400 mt-1">Connecting to Google Maps</p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center z-10 overflow-hidden">
          {/* SVG Fallback Map – Gujarat region */}
          <svg viewBox="0 0 800 520" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.4" opacity="0.5"/>
              </pattern>
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BFDBFE"/>
                <stop offset="100%" stopColor="#93C5FD"/>
              </linearGradient>
              <radialGradient id="halo1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0"/>
              </radialGradient>
              <filter id="blurHalo"><feGaussianBlur stdDeviation="8"/></filter>
              <filter id="pinShadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/></filter>
            </defs>
            {/* Background */}
            <rect width="800" height="520" fill="#EEF2F7"/>
            <rect width="800" height="520" fill="url(#mapgrid)"/>
            {/* Arabian Sea */}
            <path d="M 0,380 Q 80,360 130,400 Q 180,440 160,520 L 0,520 Z" fill="url(#seaGrad)" opacity="0.7"/>
            <text x="60" y="470" fill="#60A5FA" fontSize="11" fontWeight="600" opacity="0.8">Arabian Sea</text>
            {/* Gulf of Khambhat */}
            <path d="M 310,340 Q 330,380 300,430 Q 280,460 260,480 Q 290,490 340,470 Q 370,420 350,370 Z" fill="url(#seaGrad)" opacity="0.6"/>
            {/* Gujarat rough coastline */}
            <path d="M 140,160 Q 200,140 280,150 Q 380,155 460,180 Q 520,200 560,240 Q 580,280 560,330 Q 540,370 500,380 Q 460,390 420,370 Q 390,350 370,310 Q 350,360 320,380 Q 300,390 280,370 Q 260,350 250,320 Q 240,360 220,390 Q 200,410 180,400 Q 160,390 150,360 Q 140,330 145,290 Q 150,250 140,220 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5"/>
            {/* Roads */}
            <line x1="220" y1="200" x2="450" y2="300" stroke="#FFF" strokeWidth="5" opacity="0.8"/>
            <line x1="220" y1="200" x2="450" y2="300" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6 4"/>
            <line x1="350" y1="160" x2="390" y2="380" stroke="#FFF" strokeWidth="4" opacity="0.7"/>
            <line x1="150" y1="280" x2="490" y2="280" stroke="#FFF" strokeWidth="3" opacity="0.6"/>
            <line x1="220" y1="200" x2="180" y2="360" stroke="#FFF" strokeWidth="3" opacity="0.6"/>
            {/* City labels */}
            {[
              { x: 365, y: 228, name: "Ahmedabad" },
              { x: 430, y: 295, name: "Vadodara" },
              { x: 295, y: 338, name: "Surat" },
              { x: 215, y: 260, name: "Rajkot" },
              { x: 388, y: 210, name: "Gandhinagar" },
            ].map(c => (
              <text key={c.name} x={c.x + 14} y={c.y + 4} fill="#475569" fontSize="10" fontWeight="500" fontFamily="Inter,sans-serif">{c.name}</text>
            ))}
            {/* Risk Halos – Predicted zones (when enabled) */}
            {layers.predicted && [
              { cx: 360, cy: 232, r: 80, color: "#EF4444" },
              { cx: 430, cy: 296, r: 58, color: "#EA580C" },
              { cx: 290, cy: 340, r: 50, color: "#D97706" },
              { cx: 214, cy: 258, r: 36, color: "#2563EB" },
              { cx: 385, cy: 212, r: 24, color: "#0891B2" },
            ].map((h, i) => (
              <g key={i}>
                <circle cx={h.cx} cy={h.cy} r={h.r} fill={h.color} fillOpacity={viewMode === "Heatmap" ? "0.18" : "0.07"} stroke={h.color} strokeOpacity="0.4" strokeWidth="1.5"/>
                <circle cx={h.cx} cy={h.cy} r={h.r * 0.55} fill={h.color} fillOpacity={viewMode === "Heatmap" ? "0.28" : "0.12"} stroke={h.color} strokeOpacity="0.6" strokeWidth="1.5"/>
              </g>
            ))}
            {/* Pins – Historical hotspots (when enabled) */}
            {layers.historical && [
              { cx: 360, cy: 232, color: "#DC2626", scale: 14, label: "82%" },
              { cx: 430, cy: 296, color: "#EA580C", scale: 11, label: "64%" },
              { cx: 290, cy: 340, color: "#D97706", scale: 10, label: "58%" },
              { cx: 214, cy: 258, color: "#2563EB", scale: 8,  label: "36%" },
              { cx: 385, cy: 212, color: "#0891B2", scale: 6,  label: "22%" },
            ].map((p, i) => (
              <g key={i} filter="url(#pinShadow)">
                <circle cx={p.cx} cy={p.cy} r={p.scale} fill={p.color} stroke="#FFFFFF" strokeWidth="2.5"/>
                <text x={p.cx} y={p.cy + 4} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">{p.label}</text>
              </g>
            ))}
            {/* ATM markers (when enabled) */}
            {layers.atm && [
              { x: 375, y: 248 }, { x: 444, y: 310 }, { x: 302, y: 354 }, { x: 228, y: 272 },
            ].map((a, i) => (
              <rect key={i} x={a.x - 5} y={a.y - 5} width="10" height="10" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" rx="2"/>
            ))}
            {/* Active case arrows (when enabled) */}
            {layers.active && [
              { x: 346, y: 218 }, { x: 416, y: 282 }, { x: 276, y: 326 },
            ].map((ac, i) => (
              <polygon key={i} points={`${ac.x},${ac.y - 8} ${ac.x - 6},${ac.y + 4} ${ac.x + 6},${ac.y + 4}`} fill="#10B981" stroke="#FFFFFF" strokeWidth="2"/>
            ))}
            {/* View mode label */}
            <rect x="10" y="10" width="110" height="26" rx="8" fill="#1E293B" opacity="0.7"/>
            <text x="20" y="27" fill="#FFFFFF" fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif">
              {viewMode} View
            </text>
          </svg>
          {/* Overlay notice */}
          <div className="relative z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl border border-amber-200 dark:border-amber-800 px-5 py-3 shadow-lg text-center">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Google Maps API Key Required</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Enable billing at console.cloud.google.com<br/>Key: VITE_GOOGLE_MAPS_API_KEY in .env</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntelligenceMap() {
  const { openCaseModal } = useCaseModal();
  const [selectedZone, setSelectedZone] = useState(HOTSPOTS[0]);
  const [selectedState, setSelectedState] = useState("Gujarat");
  const [selectedRisk, setSelectedRisk] = useState("All Levels");
  const [viewMode, setViewMode] = useState("Heatmap");
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");
  const [layers, setLayers] = useState({ predicted: true, historical: true, atm: true, active: true });
  const toggleLayer = key => setLayers(p => ({ ...p, [key]: !p[key] }));
  const filteredZones = HOTSPOTS.filter(z => selectedRisk === "All Levels" || (selectedRisk === "Critical/High" && (z.risk === "Critical" || z.risk === "High")) || z.risk === selectedRisk);

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Intelligence Map</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-12">Live crime hotspot heatmap - Gujarat Cyber Cell Jurisdiction</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>12 Active Risk Zones</span>
          </div>
          <div className="relative">
            <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)} className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
              {["Last 7 Days", "Last 30 Days", "Year to Date"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={() => alert("Exporting...")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ZONE_STATS.map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-500" /> Filters
            </h3>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">State</label>
              <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-200 outline-none">
                {["Gujarat", "Maharashtra", "Rajasthan", "Delhi NCR", "Uttar Pradesh"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Risk Level</label>
              <select value={selectedRisk} onChange={e => setSelectedRisk(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-200 outline-none">
                {["All Levels", "Critical/High", "Medium", "Low"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Date Range</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /><span>01 Oct - 12 Oct 2026</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Map Layers
              </h4>
              <div className="space-y-2.5">
                {[
                  { key: "predicted", label: "Predicted Zones", dot: "bg-red-500" },
                  { key: "historical", label: "Historical Hotspots", dot: "bg-blue-500" },
                  { key: "atm", label: "ATM / Branch Points", dot: "bg-amber-500" },
                  { key: "active", label: "Active Cases", dot: "bg-emerald-500" },
                ].map(l => (
                  <label key={l.key} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleLayer(l.key)}>
                    <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${layers[l.key] ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${layers[l.key] ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${l.dot} shrink-0`} />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{l.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-red-500" /> Risk Zones
              </h3>
              <span className="text-[10px] font-bold text-slate-400">{filteredZones.length} zones</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredZones.map(zone => (
                <button key={zone.id} onClick={() => setSelectedZone(zone)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedZone.id === zone.id ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{zone.city}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${zone.badgeColor}`}>{zone.riskScore}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{zone.cases} cases</span>
                    <span className={zone.trend.startsWith("+") ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>{zone.trend}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {["Heatmap", "Cluster", "Satellite", "3D"].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${viewMode === mode ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200"}`}>
                  {mode}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:block">23.0225 N - 72.5714 E</span>
          </div>

          <div className="relative h-[500px]">
            <GoogleMapView layers={layers} viewMode={viewMode} />
            <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: selectedZone.color }} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{selectedZone.city}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Risk: <strong style={{ color: selectedZone.color }}>{selectedZone.riskScore}%</strong> - {selectedZone.cases} cases</p>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 shadow-sm z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Live Feed</span>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-4 text-[11px]">
            {[{ label: "Predicted Zone", color: "bg-red-500" }, { label: "Historical Hotspot", color: "bg-blue-500" }, { label: "ATM Cluster", color: "bg-amber-500" }, { label: "Active Case", color: "bg-emerald-500" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${l.color}`} />
                <span className="text-slate-600 dark:text-slate-400 font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selected Zone</span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 leading-tight">{selectedZone.city}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${selectedZone.badgeColor}`}>{selectedZone.risk}</span>
            </div>
            <div className="py-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Risk Score</span>
                <span className="font-extrabold" style={{ color: selectedZone.color }}>{selectedZone.riskScore}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${selectedZone.riskScore}%`, backgroundColor: selectedZone.color }} />
              </div>
            </div>
            <div className="space-y-0 text-xs divide-y divide-slate-100 dark:divide-slate-700/50">
              {[
                { label: "Active Cases", value: selectedZone.cases },
                { label: "Case Trend", value: selectedZone.trend, colored: true },
                { label: "Cash-Out Window", value: selectedZone.cashOutWindow },
                { label: "Dominant Fraud", value: selectedZone.fraudType },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2">
                  <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                  <span className={`font-semibold text-right max-w-[130px] ${row.colored ? (String(selectedZone.trend).startsWith("+") ? "text-red-600" : "text-emerald-600") : "text-slate-800 dark:text-slate-200"}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <button onClick={() => openCaseModal(selectedZone.caseId)} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition">View Related Cases</button>
              <button onClick={() => alert(`Patrol alert to ${selectedZone.city}`)} className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 text-xs font-semibold transition">Deploy Patrol Alert</button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-800/50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2.5">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              <strong>{selectedZone.city}</strong> shows a <strong>{selectedZone.trend}</strong> trend. Peak withdrawal expected during <strong>{selectedZone.cashOutWindow}</strong>. Recommend ATM surveillance within 3km radius.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-indigo-500 dark:text-indigo-400">
              <Clock className="w-3.5 h-3.5" /><span>Updated 4 min ago - Model v2.1</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" /> Zone Risk Comparison
            </h4>
            <div className="space-y-2.5">
              {HOTSPOTS.map(z => (
                <div key={z.id}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-[110px]">{z.city}</span>
                    <span className="font-bold" style={{ color: z.color }}>{z.riskScore}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${z.riskScore}%`, backgroundColor: z.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}