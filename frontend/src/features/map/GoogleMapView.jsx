import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import {
  MapPin,
  Eye,
  EyeOff,
  Compass,
  AlertTriangle,
  Shield,
  Radio,
} from 'lucide-react';
import FieldInterceptCard from './FieldInterceptCard';

// Tactical Dark Cybersecurity Palette for Google Maps
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#090e17' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090e17' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#059669' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#030712' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#030712' }],
  },
];

export default function GoogleMapView({
  hotspots = [],
  candidates = [],
  patrolUnits = [],
  center = { lat: 28.6295, lng: 77.2185 }, // New Delhi Connaught Place
  zoom = 13,
}) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [googleObj, setGoogleObj] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showPatrolUnits, setShowPatrolUnits] = useState(true);
  const [selectedPatrolUnit, setSelectedPatrolUnit] = useState(null);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' (dark) or 'hybrid'
  const [loadError, setLoadError] = useState(null);

  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const polylinesRef = useRef([]);
  const infoWindowRef = useRef(null);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyASeiOhzKOyOOPditkIRxtsC8CPbuQ-dI4';

  useEffect(() => {
    let isMounted = true;

    // Listen for Google Maps auth errors (e.g., API key restrictions / unactivated Maps JS API)
    window.gm_authFailure = () => {
      if (isMounted) {
        setLoadError(
          'Google Maps Authentication Failed: Please ensure "Maps JavaScript API" is enabled in your Google Cloud Console for this key.'
        );
      }
    };

    async function loadGoogleMaps() {
      try {
        setOptions({
          key: apiKey,
          v: 'weekly',
        });

        // Use the new functional importLibrary API (v2+)
        const { Map, InfoWindow } = await importLibrary('maps');
        await importLibrary('marker');

        if (!isMounted || !mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: center,
          zoom: zoom,
          styles: darkMapStyle,
          mapTypeId: 'roadmap',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        infoWindowRef.current = new InfoWindow();
        setGoogleObj(window.google);
        setMapInstance(map);
      } catch (err) {
        console.error('Google Maps Load Error:', err);
        if (isMounted) {
          setLoadError(err.message || 'Failed to initialize Google Maps');
        }
      }
    }

    loadGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Update map style on satellite switch
  useEffect(() => {
    if (mapInstance && googleObj) {
      if (mapType === 'hybrid') {
        mapInstance.setMapTypeId('hybrid');
        mapInstance.setOptions({ styles: null });
      } else {
        mapInstance.setMapTypeId('roadmap');
        mapInstance.setOptions({ styles: darkMapStyle });
      }
    }
  }, [mapType, mapInstance, googleObj]);

  // Render Overlays (Candidates, Hotspots & Patrol Units)
  useEffect(() => {
    if (!mapInstance || !googleObj) return;

    // Clear existing overlays
    markersRef.current.forEach((m) => m.setMap(null));
    circlesRef.current.forEach((c) => c.setMap(null));
    polylinesRef.current.forEach((p) => p.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];
    polylinesRef.current = [];

    // 1. Render Forecast Candidates (Red Glowing Rings & Markers)
    if (showCandidates) {
      candidates.forEach((cand) => {
        const pos = { lat: cand.latitude, lng: cand.longitude };

        const marker = new googleObj.maps.Marker({
          position: pos,
          map: mapInstance,
          title: `Forecast: ${cand.zone_name}`,
          icon: {
            path: googleObj.maps.SymbolPath.CIRCLE,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 9,
          },
        });

        const circle = new googleObj.maps.Circle({
          strokeColor: '#f43f5e',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.18,
          map: mapInstance,
          center: pos,
          radius: (cand.radius_km || 1.2) * 1000,
        });

        marker.addListener('click', () => {
          const content = `
            <div style="padding: 10px; background: #0f172a; color: #f8fafc; border-radius: 8px; font-family: sans-serif; font-size: 12px; max-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #f43f5e; font-family: monospace;">${cand.complaint_id} FORECAST</strong>
                <span style="background: rgba(244,63,94,0.2); color: #fda4af; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                  ${(cand.risk_estimate * 100).toFixed(0)}% Risk
                </span>
              </div>
              <div style="font-weight: 600; color: #ffffff; margin-bottom: 4px;">${cand.zone_name}</div>
              <div style="color: #94a3b8; font-size: 11px; margin-bottom: 3px;"><strong>Time Window:</strong> ${cand.estimated_window}</div>
              <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;"><strong>Perimeter:</strong> ${cand.radius_km} km radius</div>
              <div style="color: #fbbf24; font-size: 10px; font-family: monospace; border-top: 1px solid #1e293b; padding-top: 4px;">
                Synthetic Lead &bull; Verify before patrol action
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstance, marker);
        });

        markersRef.current.push(marker);
        circlesRef.current.push(circle);
      });
    }

    // 2. Render Historical Hotspots (Violet DBSCAN Clusters)
    if (showHotspots) {
      hotspots.forEach((spot) => {
        const pos = { lat: spot.latitude, lng: spot.longitude };

        const marker = new googleObj.maps.Marker({
          position: pos,
          map: mapInstance,
          title: `Hotspot: ${spot.zone_name}`,
          icon: {
            path: googleObj.maps.SymbolPath.CIRCLE,
            fillColor: '#8b5cf6',
            fillOpacity: 0.9,
            strokeColor: '#c084fc',
            strokeWeight: 2,
            scale: 8,
          },
        });

        const circle = new googleObj.maps.Circle({
          strokeColor: '#a855f7',
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
          fillColor: '#9333ea',
          fillOpacity: 0.12,
          map: mapInstance,
          center: pos,
          radius: 900,
        });

        marker.addListener('click', () => {
          const content = `
            <div style="padding: 10px; background: #0f172a; color: #f8fafc; border-radius: 8px; font-family: sans-serif; font-size: 12px; max-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #c084fc; font-family: monospace;">DBSCAN CLUSTER #${spot.cluster_id}</strong>
                <span style="background: rgba(147,51,234,0.2); color: #d8b4fe; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
                  Density: ${(spot.density_score * 100).toFixed(0)}%
                </span>
              </div>
              <div style="font-weight: 600; color: #ffffff; margin-bottom: 4px;">${spot.zone_name}</div>
              <div style="color: #94a3b8; font-size: 11px; margin-bottom: 3px;"><strong>Withdrawals:</strong> ${spot.historical_withdrawals_count} recorded</div>
              <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;"><strong>Peak Hours:</strong> ${spot.peak_hours}</div>
              <div style="color: #64748b; font-size: 10px; font-family: monospace;">
                ${spot.source_layer}
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapInstance, marker);
        });

        markersRef.current.push(marker);
        circlesRef.current.push(circle);
      });
    }

    // 3. Render Tactical Police Patrol Units & Intercept Route Vectors
    if (showPatrolUnits && patrolUnits && patrolUnits.length > 0) {
      patrolUnits.forEach((unit) => {
        const pos = { lat: unit.latitude, lng: unit.longitude };

        const marker = new googleObj.maps.Marker({
          position: pos,
          map: mapInstance,
          title: `Patrol Unit: ${unit.call_sign} (${unit.station_name})`,
          icon: {
            path: googleObj.maps.SymbolPath.CIRCLE,
            fillColor: '#2563eb',
            fillOpacity: 1,
            strokeColor: '#93c5fd',
            strokeWeight: 2.5,
            scale: 9,
          },
        });

        marker.addListener('click', () => {
          setSelectedPatrolUnit(unit);
        });

        markersRef.current.push(marker);

        // Draw tactical intercept route line from police station to candidate cash-out zone
        if (candidates.length > 0) {
          const cand = candidates[0];
          const line = new googleObj.maps.Polyline({
            path: [pos, { lat: cand.latitude, lng: cand.longitude }],
            geodesic: true,
            strokeColor: '#38bdf8',
            strokeOpacity: 0.8,
            strokeWeight: 2.5,
            map: mapInstance,
            icons: [
              {
                icon: { path: googleObj.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: '#38bdf8' },
                offset: '50%',
              },
            ],
          });
          polylinesRef.current.push(line);
        }
      });
    }
  }, [showCandidates, showHotspots, showPatrolUnits, candidates, hotspots, patrolUnits, mapInstance, googleObj]);

  if (loadError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-400 font-mono text-xs space-y-3 rounded-2xl border border-slate-800">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
        <div className="text-white font-semibold">Google Maps Error: {loadError}</div>
        <div className="text-[11px] text-slate-500 max-w-md text-center">
          Please check that your Google Maps API key has the "Maps JavaScript API" enabled in Google Cloud Console.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Map Canvas */}
      <div ref={mapRef} className="w-full h-full bg-[#090e17]" />

      {/* Floating Control Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-2 rounded-xl shadow-xl">
        <button
          onClick={() => setShowCandidates(!showCandidates)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
            showCandidates
              ? 'bg-rose-950/80 text-rose-300 border-rose-700/60 shadow-sm'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          {showCandidates ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Forecast Leads ({candidates.length})</span>
        </button>

        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
            showHotspots
              ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60 shadow-sm'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          {showHotspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>DBSCAN Hotspots ({hotspots.length})</span>
        </button>

        <button
          onClick={() => setShowPatrolUnits(!showPatrolUnits)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
            showPatrolUnits
              ? 'bg-blue-950/80 text-blue-300 border-blue-700/60 shadow-sm'
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Patrol Units ({patrolUnits.length})</span>
        </button>

        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700/70 flex items-center gap-1.5 transition"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{mapType === 'roadmap' ? 'Satellite View' : 'Tactical Dark View'}</span>
        </button>
      </div>

      {/* Field Intercept Modal */}
      <FieldInterceptCard
        isOpen={!!selectedPatrolUnit}
        unit={selectedPatrolUnit}
        targetZone={candidates[0]?.zone_name}
        targetLat={candidates[0]?.latitude}
        targetLng={candidates[0]?.longitude}
        complaintId={candidates[0]?.complaint_id}
        onClose={() => setSelectedPatrolUnit(null)}
      />

      {/* Google Maps Live Status Indicator */}
      <div className="absolute bottom-6 left-4 z-10 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-xl text-xs space-y-1">
        <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Google Maps Platform &bull; Active</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Key: {apiKey.slice(0, 8)}...{apiKey.slice(-4)}
        </div>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-4 z-10 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl text-xs space-y-2 pointer-events-auto">
        <div className="font-bold text-slate-200 font-mono uppercase tracking-wider text-[10px]">
          Intelligence Layer Key
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-400/40"></span>
          <span>AI Forecast Candidate Zone (Perimeter Ring)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[11px]">
          <span className="w-3 h-3 rounded-full bg-purple-500 ring-2 ring-purple-400/40"></span>
          <span>Historical Withdrawal Cluster (DBSCAN Hotspot)</span>
        </div>
      </div>
    </div>
  );
}
