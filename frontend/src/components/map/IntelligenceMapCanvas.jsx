import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const HOTSPOTS = [
  {
    id: 'ahmedabad-satellite',
    caseId: 'CT-3026-002',
    name: 'Ahmedabad - Satellite',
    state: 'Gujarat',
    district: 'Ahmedabad',
    lat: 23.0300,
    lng: 72.5178,
    riskScore: 82,
    riskBand: 'Critical',
    timeWindow: '10 AM – 2 PM',
    relatedCases: 5,
    radiusMeters: 1800,
    type: 'predicted',
    description: 'Primary candidate cash-out hub at Satellite commercial corridor',
  },
  {
    id: 'vadodara-alkapuri',
    caseId: 'CT-3026-005',
    name: 'Vadodara - Alkapuri',
    state: 'Gujarat',
    district: 'Vadodara',
    lat: 22.3107,
    lng: 73.1812,
    riskScore: 71,
    riskBand: 'Elevated',
    timeWindow: '11 AM – 3 PM',
    relatedCases: 3,
    radiusMeters: 1200,
    type: 'predicted',
    description: 'Secondary cash-out point linked to rapid IMPS hops',
  },
  {
    id: 'surat-ringroad',
    caseId: 'CT-3026-001',
    name: 'Surat - Ring Road Hub',
    state: 'Gujarat',
    district: 'Surat',
    lat: 21.1702,
    lng: 72.8311,
    riskScore: 64,
    riskBand: 'Elevated',
    timeWindow: '12 PM – 4 PM',
    relatedCases: 4,
    radiusMeters: 1400,
    type: 'predicted',
    description: 'Textile market ATM withdrawal corridor',
  },
  {
    id: 'rajkot-kalawad',
    caseId: 'CT-3026-003',
    name: 'Rajkot - Kalawad Road',
    state: 'Gujarat',
    district: 'Rajkot',
    lat: 22.2887,
    lng: 70.7788,
    riskScore: 48,
    riskBand: 'Monitored',
    timeWindow: '2 PM – 5 PM',
    relatedCases: 2,
    radiusMeters: 900,
    type: 'historical',
    description: 'Historical card skimming & withdrawal location',
  },
  {
    id: 'mumbai-bandra',
    caseId: 'CT-3026-004',
    name: 'Mumbai - Bandra Kurla',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0657,
    lng: 72.8686,
    riskScore: 59,
    riskBand: 'Elevated',
    timeWindow: '1 PM – 6 PM',
    relatedCases: 6,
    radiusMeters: 1500,
    type: 'predicted',
    description: 'Interstate fintech mule routing node',
  },
];

export const ATM_POINTS = [
  { id: 'atm-1', name: 'SBI e-Corner 24x7 ATM, Satellite', lat: 23.0289, lng: 72.5195 },
  { id: 'atm-2', name: 'HDFC ATM, Shivranjani Cross Road', lat: 23.0245, lng: 72.5280 },
  { id: 'atm-3', name: 'ICICI Bank ATM, SG Highway Hub', lat: 23.0360, lng: 72.5120 },
  { id: 'atm-4', name: 'Bank of Baroda, Bodakdev Branch', lat: 23.0410, lng: 72.5170 },
  { id: 'atm-5', name: 'Axis Bank ATM, Vastrapur Lake', lat: 23.0375, lng: 72.5310 },
];

export const HISTORICAL_POINTS = [
  { id: 'hist-1', name: 'Historical ATM Cash-out #401', lat: 23.0180, lng: 72.5400, amount: '₹1,50,000' },
  { id: 'hist-2', name: 'Historical ATM Cash-out #402', lat: 23.0450, lng: 72.5050, amount: '₹2,20,000' },
  { id: 'hist-3', name: 'Historical ATM Cash-out #403', lat: 23.0120, lng: 72.5620, amount: '₹95,000' },
];

export const ACTIVE_CASES = [
  { id: 'act-1', name: 'Active UPI Mule Hop #1', lat: 23.0295, lng: 72.5250, caseId: 'CT-3026-002' },
  { id: 'act-2', name: 'Active UPI Mule Hop #2', lat: 23.0340, lng: 72.5160, caseId: 'CT-3026-002' },
];

export default function IntelligenceMapCanvas({
  activeViewMode = 'Heatmap View',
  layers = { predicted: true, historical: true, atm: true, active: true },
  selectedState = 'Gujarat',
  selectedDistrict = 'Ahmedabad',
  selectedRisk = 'All Levels',
  onSelectHotspot,
  selectedHotspot = HOTSPOTS[0],
  showPopup = true,
  setShowPopup,
  onCoordinatesChange,
  engine: propEngine,
  onEngineChange,
}) {
  // Separate DOM containers for Google Maps and Leaflet so they never conflict
  const googleContainerRef = useRef(null);
  const leafletContainerRef = useRef(null);

  const [internalEngine, setInternalEngine] = useState('google'); // 'google' | 'leaflet'
  const activeEngine = propEngine || internalEngine;

  const [googleStatus, setGoogleStatus] = useState('init'); // 'init' | 'ready' | 'embed_fallback'
  const [engineLabel, setEngineLabel] = useState('Google Maps');
  const [currentCoords, setCurrentCoords] = useState({ lat: 23.0300, lng: 72.5178 });

  // Map references
  const googleMapInstance = useRef(null);
  const googleOverlays = useRef({ markers: [], circles: [], lines: [] });
  const leafletMapInstance = useRef(null);
  const leafletLayerGroup = useRef(null);

  const defaultCenter = { lat: 23.0300, lng: 72.5178 }; // Ahmedabad - Satellite Hub

  const handleCoords = (lat, lng) => {
    setCurrentCoords({ lat, lng });
    if (onCoordinatesChange) {
      onCoordinatesChange(lat, lng);
    }
  };

  const handleEngineSwitch = (target) => {
    setInternalEngine(target);
    if (onEngineChange) onEngineChange(target);

    // Invalidate sizes after layout transition
    setTimeout(() => {
      if (target === 'google' && googleMapInstance.current && window.google) {
        window.google.maps.event.trigger(googleMapInstance.current, 'resize');
        googleMapInstance.current.setCenter(defaultCenter);
      } else if (target === 'leaflet' && leafletMapInstance.current) {
        leafletMapInstance.current.invalidateSize();
      }
    }, 100);
  };

  // -------------------------------------------------------------
  // 1. GOOGLE MAPS ENGINE
  // -------------------------------------------------------------
  const initGoogleMap = useCallback(async () => {
    if (!googleContainerRef.current) return;

    if (googleMapInstance.current && window.google) {
      window.google.maps.event.trigger(googleMapInstance.current, 'resize');
      renderGoogleOverlays(window.google, googleMapInstance.current);
      setGoogleStatus('ready');
      setEngineLabel('Google Maps (Live Satellite & GIS)');
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Watch for auth failures (e.g. invalid key or billing disabled)
    window.gm_authFailure = () => {
      console.warn('Google Maps JS API key authorization failed. Activating Google Maps Embed fallback.');
      setGoogleStatus('embed_fallback');
      setEngineLabel('Google Maps (Interactive Satellite)');
    };

    try {
      if (!window.google || !window.google.maps) {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
        });
        await loader.load();
      }

      if (!googleContainerRef.current) return;

      const google = window.google;
      const mapType =
        activeViewMode === 'Satellite View'
          ? google.maps.MapTypeId.SATELLITE
          : activeViewMode === '3D View'
          ? google.maps.MapTypeId.HYBRID
          : google.maps.MapTypeId.ROADMAP;

      const map = new google.maps.Map(googleContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: false,
      });

      googleMapInstance.current = map;

      map.addListener('mousemove', (e) => {
        handleCoords(e.latLng.lat(), e.latLng.lng());
      });

      renderGoogleOverlays(google, map);
      setGoogleStatus('ready');
      setEngineLabel('Google Maps (Live Satellite & GIS)');
    } catch (err) {
      console.warn('Google Maps JS Loader issue, rendering Google Maps Embed:', err);
      setGoogleStatus('embed_fallback');
      setEngineLabel('Google Maps (Interactive Satellite)');
    }
  }, [activeViewMode]);

  const renderGoogleOverlays = (google, map) => {
    if (!google || !map) return;

    googleOverlays.current.markers.forEach((m) => m.setMap(null));
    googleOverlays.current.circles.forEach((c) => c.setMap(null));
    googleOverlays.current.lines.forEach((l) => l.setMap(null));
    googleOverlays.current = { markers: [], circles: [], lines: [] };

    // 1. Hotspots
    if (layers.predicted) {
      HOTSPOTS.forEach((spot) => {
        const circle = new google.maps.Circle({
          strokeColor: '#DC2626',
          strokeOpacity: 0.85,
          strokeWeight: 2,
          fillColor: '#EF4444',
          fillOpacity: 0.22,
          map,
          center: { lat: spot.lat, lng: spot.lng },
          radius: spot.radiusMeters,
        });
        googleOverlays.current.circles.push(circle);

        const marker = new google.maps.Marker({
          position: { lat: spot.lat, lng: spot.lng },
          map,
          title: spot.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          if (onSelectHotspot) onSelectHotspot(spot);
          if (setShowPopup) setShowPopup(true);
        });

        googleOverlays.current.markers.push(marker);
      });
    }

    // 2. ATM Nodes
    if (layers.atm) {
      ATM_POINTS.forEach((atm) => {
        const marker = new google.maps.Marker({
          position: { lat: atm.lat, lng: atm.lng },
          map,
          title: `ATM: ${atm.name}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: '#F59E0B',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });
        googleOverlays.current.markers.push(marker);
      });
    }

    // 3. Historical Points
    if (layers.historical) {
      HISTORICAL_POINTS.forEach((hist) => {
        const marker = new google.maps.Marker({
          position: { lat: hist.lat, lng: hist.lng },
          map,
          title: `Historical: ${hist.name}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });
        googleOverlays.current.markers.push(marker);
      });
    }

    // 4. Active Cases
    if (layers.active) {
      ACTIVE_CASES.forEach((act) => {
        const marker = new google.maps.Marker({
          position: { lat: act.lat, lng: act.lng },
          map,
          title: `Active Hop: ${act.name}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: '#10B981',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 1.5,
          },
        });
        googleOverlays.current.markers.push(marker);
      });
    }

    // 5. Connecting Vectors
    const path = [
      { lat: 23.0300, lng: 72.5178 },
      { lat: 22.3107, lng: 73.1812 },
      { lat: 21.1702, lng: 72.8311 },
    ];
    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#EF4444',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map,
    });
    googleOverlays.current.lines.push(polyline);
  };

  // -------------------------------------------------------------
  // 2. LEAFLET ENGINE
  // -------------------------------------------------------------
  const initLeafletMap = useCallback(() => {
    if (!leafletContainerRef.current) return;

    if (leafletMapInstance.current) {
      leafletMapInstance.current.invalidateSize();
      return;
    }

    const map = L.map(leafletContainerRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom: 13,
      zoomControl: false,
    });

    const isSatellite = activeViewMode === 'Satellite View' || activeViewMode === '3D View';
    const tileUrl = isSatellite
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileAttr = isSatellite
      ? '&copy; Esri World Imagery'
      : '&copy; OpenStreetMap contributors';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: tileAttr,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    leafletLayerGroup.current = layerGroup;
    leafletMapInstance.current = map;

    map.on('mousemove', (e) => {
      handleCoords(e.latlng.lat, e.latlng.lng);
    });

    renderLeafletLayers(map, layerGroup);
  }, [activeViewMode]);

  const renderLeafletLayers = (map, group) => {
    if (!map || !group) return;
    group.clearLayers();

    if (layers.predicted) {
      HOTSPOTS.forEach((spot) => {
        const circle = L.circle([spot.lat, spot.lng], {
          radius: spot.radiusMeters,
          color: '#DC2626',
          weight: 2,
          fillColor: '#EF4444',
          fillOpacity: 0.18,
          dashArray: '4, 4',
        });
        circle.addTo(group);

        const customPin = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; width: 24px; height: 24px; background: rgba(239,68,68,0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
              <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #DC2626; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customPin }).addTo(group);
        marker.on('click', () => {
          if (onSelectHotspot) onSelectHotspot(spot);
          if (setShowPopup) setShowPopup(true);
        });
      });
    }

    if (layers.atm) {
      ATM_POINTS.forEach((atm) => {
        const atmIcon = L.divIcon({
          className: 'atm-marker',
          html: `<div style="width: 12px; height: 12px; background: #F59E0B; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker([atm.lat, atm.lng], { icon: atmIcon })
          .bindTooltip(`<b>ATM:</b> ${atm.name}`, { direction: 'top' })
          .addTo(group);
      });
    }

    if (layers.historical) {
      HISTORICAL_POINTS.forEach((hist) => {
        const histIcon = L.divIcon({
          className: 'hist-marker',
          html: `<div style="width: 14px; height: 14px; background: #2563EB; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([hist.lat, hist.lng], { icon: histIcon })
          .bindTooltip(`<b>Historical:</b> ${hist.name} (${hist.amount})`, { direction: 'top' })
          .addTo(group);
      });
    }

    if (layers.active) {
      ACTIVE_CASES.forEach((act) => {
        const actIcon = L.divIcon({
          className: 'active-marker',
          html: `<div style="width: 12px; height: 12px; background: #10B981; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        L.marker([act.lat, act.lng], { icon: actIcon })
          .bindTooltip(`<b>Active Hop:</b> ${act.name}`, { direction: 'top' })
          .addTo(group);
      });
    }

    const vectorCoords = [
      [23.0300, 72.5178],
      [22.3107, 73.1812],
      [21.1702, 72.8311],
    ];
    L.polyline(vectorCoords, {
      color: '#EF4444',
      weight: 2,
      dashArray: '6, 6',
      opacity: 0.7,
    }).addTo(group);
  };

  // -------------------------------------------------------------
  // INITIALIZATION ON MOUNT
  // -------------------------------------------------------------
  useEffect(() => {
    initGoogleMap();
    initLeafletMap();
  }, [initGoogleMap, initLeafletMap]);

  // Update overlays on layer change
  useEffect(() => {
    if (googleMapInstance.current && window.google) {
      renderGoogleOverlays(window.google, googleMapInstance.current);
    }
    if (leafletMapInstance.current && leafletLayerGroup.current) {
      renderLeafletLayers(leafletMapInstance.current, leafletLayerGroup.current);
    }
  }, [layers]);

  // Zoom controls
  const handleZoomIn = () => {
    if (activeEngine === 'google' && googleMapInstance.current) {
      googleMapInstance.current.setZoom(googleMapInstance.current.getZoom() + 1);
    } else if (leafletMapInstance.current) {
      leafletMapInstance.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (activeEngine === 'google' && googleMapInstance.current) {
      googleMapInstance.current.setZoom(googleMapInstance.current.getZoom() - 1);
    } else if (leafletMapInstance.current) {
      leafletMapInstance.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (activeEngine === 'google' && googleMapInstance.current) {
      googleMapInstance.current.panTo(defaultCenter);
      googleMapInstance.current.setZoom(13);
    } else if (leafletMapInstance.current) {
      leafletMapInstance.current.setView([defaultCenter.lat, defaultCenter.lng], 13);
    }
  };

  const activeSpot = selectedHotspot || HOTSPOTS[0];

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100">
      {/* 1. GOOGLE MAPS CONTAINER */}
      <div
        className={`w-full h-full relative ${activeEngine === 'google' ? 'block' : 'hidden'}`}
      >
        {googleStatus !== 'embed_fallback' ? (
          <div ref={googleContainerRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full relative">
            {/* Real Interactive Google Maps Satellite / Roadmap Embed */}
            <iframe
              title="Google Maps Live Satellite"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://maps.google.com/maps?q=${activeSpot.lat},${activeSpot.lng}&z=13&t=${
                activeViewMode === 'Satellite View' || activeViewMode === '3D View' ? 'k' : 'm'
              }&output=embed`}
              className="w-full h-full"
            />
            {/* Threat Radar Ring Overlay over Google Maps */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative w-48 h-48 border-2 border-red-500/60 rounded-full animate-ping bg-red-500/10"></div>
              <div className="absolute w-36 h-36 border-2 border-red-600 rounded-full bg-red-600/20"></div>
              <div className="absolute w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        )}
      </div>

      {/* 2. LEAFLET OSM CONTAINER */}
      <div
        ref={leafletContainerRef}
        className={`w-full h-full ${activeEngine === 'leaflet' ? 'block' : 'hidden'}`}
      />

      {/* Interactive Engine Toggle Switcher (Top-Left) */}
      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-20">
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleEngineSwitch('google')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeEngine === 'google'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeEngine === 'google' ? 'bg-white' : 'bg-blue-600'}`}></span>
            <span>Google Maps</span>
          </button>

          <button
            type="button"
            onClick={() => handleEngineSwitch('leaflet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeEngine === 'leaflet'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeEngine === 'leaflet' ? 'bg-white' : 'bg-emerald-600'}`}></span>
            <span>Leaflet OSM</span>
          </button>
        </div>

        {/* Engine Status Label */}
        <div className="hidden sm:flex bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 items-center gap-1.5 shadow-2xs pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{activeEngine === 'google' ? 'Google Maps (Satellite & Streets)' : 'Leaflet (OpenStreetMap GIS)'}</span>
        </div>
      </div>

      {/* Map Control Buttons (Top-Right) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition shadow-xs cursor-pointer"
        >
          <Crosshair className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      {/* Floating Hotspot Details Popup (Matching Panel 5) */}
      {showPopup && activeSpot && (
        <div className="absolute top-[24%] left-[38%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 w-64 z-20 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h4 className="font-bold text-xs text-slate-900">{activeSpot.name}</h4>
            </div>
            <button
              onClick={() => setShowPopup && setShowPopup(false)}
              className="text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 my-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Risk Score:</span>
              <span className="font-bold text-red-600">{activeSpot.riskScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Time:</span>
              <span className="font-semibold text-slate-800">{activeSpot.timeWindow}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Related Cases:</span>
              <span className="font-semibold text-slate-800">{activeSpot.relatedCases} Cases</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectHotspot) onSelectHotspot(activeSpot);
            }}
            className="w-full py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            View Cases
          </button>
        </div>
      )}
    </div>
  );
}
