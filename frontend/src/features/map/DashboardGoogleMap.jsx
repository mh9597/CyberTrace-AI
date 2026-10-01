import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

// Custom clean light-blue map styling to match CyberTrace dashboard aesthetics
const dashboardMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#edf4fc' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#334155' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#ffffff' }, { weight: 2 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#bfdbfe' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e40af' }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#3b82f6' }, { weight: 1.8 }],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#1e3a8a' }, { weight: 'bold' }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#93c5fd' }, { weight: 1 }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

// Target intelligence hotspots from screenshot
const HOTSPOT_LOCATIONS = [
  {
    name: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    risk: 82,
    caseId: 'CT-2026-002',
    color: '#ef4444',
    secondaryColor: '#f97316',
    radius: 95000,
  },
  {
    name: 'Vadodara',
    lat: 22.3072,
    lng: 73.1812,
    risk: 64,
    caseId: 'CT-2026-001',
    color: '#f97316',
    secondaryColor: '#fbbf24',
    radius: 75000,
  },
  {
    name: 'Kolkata',
    lat: 22.5726,
    lng: 88.3639,
    risk: 78,
    caseId: 'CT-3026-004',
    color: '#ef4444',
    secondaryColor: '#f97316',
    radius: 90000,
  },
  {
    name: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    risk: 68,
    caseId: 'CT-2026-005',
    color: '#f97316',
    secondaryColor: '#fbbf24',
    radius: 85000,
  },
  {
    name: 'Mumbai',
    lat: 19.076,
    lng: 72.8777,
    risk: 28,
    caseId: 'CT-3056-003',
    color: '#f97316',
    secondaryColor: '#3b82f6',
    radius: 75000,
  },
  {
    name: 'Bhopal',
    lat: 23.2599,
    lng: 77.4126,
    risk: 52,
    caseId: 'CT-2034-007',
    color: '#eab308',
    secondaryColor: '#22c55e',
    radius: 70000,
  },
  {
    name: 'Hyderabad',
    lat: 17.385,
    lng: 78.4867,
    risk: 42,
    caseId: 'CT-2026-008',
    color: '#06b6d4',
    secondaryColor: '#3b82f6',
    radius: 65000,
  },
  {
    name: 'Bengaluru',
    lat: 12.9716,
    lng: 77.5946,
    risk: 38,
    caseId: 'CT-2026-009',
    color: '#06b6d4',
    secondaryColor: '#10b981',
    radius: 60000,
  },
  {
    name: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    risk: 35,
    caseId: 'CT-2026-010',
    color: '#06b6d4',
    secondaryColor: '#10b981',
    radius: 60000,
  },
];

export default function DashboardGoogleMap({ onSelectCase }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyASeiOhzKOyOOPditkIRxtsC8CPbuQ-dI4';

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Handle authentication / restriction error
    window.gm_authFailure = () => {
      if (isMounted) {
        setLoadError('Google Maps API authentication failed.');
      }
    };

    async function initMap() {
      try {
        setOptions({
          key: apiKey,
          v: 'weekly',
        });

        const { Map, InfoWindow } = await importLibrary('maps');
        await importLibrary('marker');

        if (!isMounted || !mapRef.current) return;

        // Center on India
        const map = new Map(mapRef.current, {
          center: { lat: 21.8, lng: 79.2 },
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          styles: dashboardMapStyle,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
        });

        mapInstanceRef.current = map;
        const infoWindow = new InfoWindow();

        // Render heat concentric circles and markers for each location
        HOTSPOT_LOCATIONS.forEach((spot) => {
          const center = { lat: spot.lat, lng: spot.lng };

          // Outer glowing halo
          new window.google.maps.Circle({
            strokeColor: spot.color,
            strokeOpacity: 0.35,
            strokeWeight: 1,
            fillColor: spot.secondaryColor,
            fillOpacity: 0.22,
            map,
            center,
            radius: spot.radius,
            clickable: false,
          });

          // Inner intense core circle
          new window.google.maps.Circle({
            strokeColor: spot.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: spot.color,
            fillOpacity: 0.55,
            map,
            center,
            radius: spot.radius * 0.45,
            clickable: false,
          });

          // Centroid marker with label
          const marker = new window.google.maps.Marker({
            position: center,
            map,
            title: `${spot.name} - ${spot.risk}% Risk`,
            label: {
              text: spot.name,
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: '700',
              className: 'map-city-label',
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: spot.color,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2.5,
              scale: 7,
              labelOrigin: new window.google.maps.Point(0, 18),
            },
          });

          marker.addListener('click', () => {
            const content = `
              <div style="padding: 6px 10px; font-family: sans-serif; font-size: 12px; color: #0f172a;">
                <div style="font-weight: bold; font-size: 13px; color: ${spot.color}; margin-bottom: 2px;">
                  ${spot.name} Threat Hub
                </div>
                <div style="color: #64748b; font-size: 11px; margin-bottom: 4px;">
                  Risk Intensity: <strong>${spot.risk}%</strong>
                </div>
                <div style="font-family: monospace; font-size: 10px; color: #2563eb; margin-bottom: 6px;">
                  Active Case: ${spot.caseId}
                </div>
                <button id="modal-btn-${spot.caseId}" style="background: #2563eb; color: #ffffff; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">
                  View Case Details &rarr;
                </button>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            setTimeout(() => {
              const btn = document.getElementById(`modal-btn-${spot.caseId}`);
              if (btn && onSelectCase) {
                btn.onclick = () => onSelectCase(spot.caseId);
              }
            }, 100);
          });
        });

        setIsLoaded(true);
      } catch (err) {
        console.error('Google Maps initialization error:', err);
        if (isMounted) {
          setLoadError(err.message || 'Failed to load Google Maps');
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, onSelectCase]);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center min-h-[460px]">
      {/* Floating Zoom Controls (+ / -) matching screenshot */}
      <div className="absolute top-3.5 left-3.5 z-20 bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-50 transition text-sm active:scale-95 cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <div className="border-t border-slate-200" />
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-50 transition text-sm active:scale-95 cursor-pointer"
          title="Zoom Out"
        >
          &minus;
        </button>
      </div>

      {/* Live Google Map Container */}
      <div
        ref={mapRef}
        className={`w-full h-full min-h-[460px] bg-[#dbeafe] transition-opacity duration-300 ${
          isLoaded && !loadError ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Seamless fallback image if loading or network error */}
      {(!isLoaded || loadError) && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#dbeafe]">
          <img
            src="/images/dashboard-map.png"
            alt="India Cybercrime Threat Geospatial Map"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Live Google Maps Status Indicator (subtle pill) */}
      {isLoaded && !loadError && (
        <div className="absolute top-3.5 right-3.5 z-20 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-semibold text-slate-700">Live Google Map</span>
        </div>
      )}

      {/* Floating Risk Legend on bottom-left matching screenshot */}
      <div className="absolute bottom-3.5 left-3.5 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/90 shadow-sm flex flex-col gap-1 pointer-events-auto">
        <div
          className="w-24 h-2 rounded-full"
          style={{
            background:
              'linear-gradient(to right, #3B82F6, #06B6D4, #10B981, #EAB308, #F97316, #EF4444)',
          }}
        />
        <div className="flex justify-between items-center text-[9px] text-slate-600 font-semibold px-0.5">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </div>
    </div>
  );
}
