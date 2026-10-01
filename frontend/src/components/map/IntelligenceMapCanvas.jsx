import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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

export const REGION_COORDINATES = {
  // Gujarat
  Gujarat: { lat: 23.0225, lng: 72.5714, zoom: 8 },
  Ahmedabad: { lat: 23.0300, lng: 72.5178, zoom: 13 },
  Surat: { lat: 21.1702, lng: 72.8311, zoom: 13 },
  Vadodara: { lat: 22.3107, lng: 73.1812, zoom: 13 },
  Rajkot: { lat: 22.2887, lng: 70.7788, zoom: 13 },
  Gandhinagar: { lat: 23.2156, lng: 72.6369, zoom: 13 },

  // Maharashtra
  Maharashtra: { lat: 19.7515, lng: 75.7139, zoom: 7 },
  Mumbai: { lat: 19.0760, lng: 72.8777, zoom: 12 },
  Pune: { lat: 18.5204, lng: 73.8567, zoom: 12 },
  Nagpur: { lat: 21.1458, lng: 79.0882, zoom: 12 },
  Thane: { lat: 19.2183, lng: 72.9781, zoom: 13 },
  Nashik: { lat: 19.9975, lng: 73.7898, zoom: 12 },

  // Rajasthan
  Rajasthan: { lat: 27.0238, lng: 74.2179, zoom: 7 },
  Jaipur: { lat: 26.9124, lng: 75.7873, zoom: 12 },
  Jodhpur: { lat: 26.2389, lng: 73.0243, zoom: 12 },
  Udaipur: { lat: 24.5854, lng: 73.7125, zoom: 12 },
  Kota: { lat: 25.2138, lng: 75.8648, zoom: 12 },

  // Delhi NCR
  'Delhi NCR': { lat: 28.6139, lng: 77.2090, zoom: 10 },
  'New Delhi': { lat: 28.6139, lng: 77.2090, zoom: 13 },
  Gurugram: { lat: 28.4595, lng: 77.0266, zoom: 13 },
  Noida: { lat: 28.5355, lng: 77.3910, zoom: 13 },
  'South Delhi': { lat: 28.5244, lng: 77.1855, zoom: 13 },
};

export const HOTSPOTS = [
  // Gujarat
  {
    id: 'ahmedabad-satellite',
    caseId: 'CT-3026-002',
    name: 'Ahmedabad - Satellite Hub',
    state: 'Gujarat',
    district: 'Ahmedabad',
    lat: 23.0300,
    lng: 72.5178,
    riskScore: 82,
    riskBand: 'High Risk',
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
    riskBand: 'High Risk',
    timeWindow: '11 AM – 3 PM',
    relatedCases: 3,
    radiusMeters: 1400,
    type: 'predicted',
    description: 'Secondary cash-out point linked to rapid IMPS mule hops',
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
    riskBand: 'Medium Risk',
    timeWindow: '12 PM – 4 PM',
    relatedCases: 4,
    radiusMeters: 1500,
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
    riskBand: 'Low Risk',
    timeWindow: '2 PM – 5 PM',
    relatedCases: 2,
    radiusMeters: 1000,
    type: 'historical',
    description: 'Historical card skimming & withdrawal cluster',
  },
  {
    id: 'gandhinagar-infocity',
    caseId: 'CT-3026-006',
    name: 'Gandhinagar - Infocity',
    state: 'Gujarat',
    district: 'Gandhinagar',
    lat: 23.1932,
    lng: 72.6288,
    riskScore: 58,
    riskBand: 'Medium Risk',
    timeWindow: '3 PM – 6 PM',
    relatedCases: 3,
    radiusMeters: 1200,
    type: 'predicted',
    description: 'Tech corridor crypto-mule offramp node',
  },

  // Maharashtra
  {
    id: 'mumbai-bandra',
    caseId: 'CT-3026-004',
    name: 'Mumbai - Bandra Kurla Complex',
    state: 'Maharashtra',
    district: 'Mumbai',
    lat: 19.0657,
    lng: 72.8686,
    riskScore: 78,
    riskBand: 'High Risk',
    timeWindow: '1 PM – 6 PM',
    relatedCases: 6,
    radiusMeters: 1600,
    type: 'predicted',
    description: 'Interstate fintech mule routing node & corporate account diversion',
  },
  {
    id: 'pune-hinjewadi',
    caseId: 'CT-3026-007',
    name: 'Pune - Hinjewadi Phase 1',
    state: 'Maharashtra',
    district: 'Pune',
    lat: 18.5913,
    lng: 73.7389,
    riskScore: 68,
    riskBand: 'Medium Risk',
    timeWindow: '2 PM – 7 PM',
    relatedCases: 3,
    radiusMeters: 1300,
    type: 'predicted',
    description: 'High-volume UPI layering cluster',
  },

  // Rajasthan
  {
    id: 'jaipur-miroad',
    caseId: 'CT-3026-008',
    name: 'Jaipur - MI Road Commercial Belt',
    state: 'Rajasthan',
    district: 'Jaipur',
    lat: 26.9168,
    lng: 75.8080,
    riskScore: 74,
    riskBand: 'High Risk',
    timeWindow: '11 AM – 4 PM',
    relatedCases: 4,
    radiusMeters: 1400,
    type: 'predicted',
    description: 'Multiple ATM cash-out sweeps detected across 8 terminals',
  },

  // Delhi NCR
  {
    id: 'delhi-cp',
    caseId: 'CT-3026-009',
    name: 'New Delhi - Connaught Place',
    state: 'Delhi NCR',
    district: 'New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    riskScore: 86,
    riskBand: 'High Risk',
    timeWindow: '10 AM – 3 PM',
    relatedCases: 7,
    radiusMeters: 1800,
    type: 'predicted',
    description: 'Major transit mule exchange point and high-density ATM corridor',
  },
  {
    id: 'gurugram-cybercity',
    caseId: 'CT-3026-010',
    name: 'Gurugram - Cyber City Hub',
    state: 'Delhi NCR',
    district: 'Gurugram',
    lat: 28.4950,
    lng: 77.0895,
    riskScore: 66,
    riskBand: 'Medium Risk',
    timeWindow: '12 PM – 5 PM',
    relatedCases: 4,
    radiusMeters: 1300,
    type: 'predicted',
    description: 'Call-center syndicate laundering exit zone',
  },
];

export const ATM_POINTS = [
  // Gujarat
  { id: 'atm-1', name: 'SBI e-Corner 24x7 ATM, Satellite', lat: 23.0289, lng: 72.5195, district: 'Ahmedabad' },
  { id: 'atm-2', name: 'HDFC ATM, Shivranjani Cross Road', lat: 23.0245, lng: 72.5280, district: 'Ahmedabad' },
  { id: 'atm-3', name: 'ICICI Bank ATM, SG Highway Hub', lat: 23.0360, lng: 72.5120, district: 'Ahmedabad' },
  { id: 'atm-4', name: 'Bank of Baroda, Bodakdev Branch', lat: 23.0410, lng: 72.5170, district: 'Ahmedabad' },
  { id: 'atm-5', name: 'Axis Bank ATM, Vastrapur Lake', lat: 23.0375, lng: 72.5310, district: 'Ahmedabad' },
  { id: 'atm-6', name: 'Canara Bank ATM, Alkapuri', lat: 22.3115, lng: 73.1790, district: 'Vadodara' },
  { id: 'atm-7', name: 'PNB ATM, Ring Road', lat: 21.1710, lng: 72.8330, district: 'Surat' },
  { id: 'atm-8', name: 'Kotak Mahindra ATM, Kalawad Rd', lat: 22.2895, lng: 70.7810, district: 'Rajkot' },
  // Maharashtra
  { id: 'atm-9', name: 'SBI BKC Financial Centre ATM', lat: 19.0665, lng: 72.8695, district: 'Mumbai' },
  { id: 'atm-10', name: 'HDFC Bank ATM, Hinjewadi Phase 1', lat: 18.5925, lng: 73.7405, district: 'Pune' },
  // Rajasthan & Delhi
  { id: 'atm-11', name: 'Axis Bank 24x7 ATM, MI Road', lat: 26.9175, lng: 75.8095, district: 'Jaipur' },
  { id: 'atm-12', name: 'Punjab National Bank, Inner Circle CP', lat: 28.6322, lng: 77.2180, district: 'New Delhi' },
  { id: 'atm-13', name: 'Standard Chartered ATM, Cyber City', lat: 28.4960, lng: 77.0910, district: 'Gurugram' },
];

export const HISTORICAL_POINTS = [
  // Gujarat
  { id: 'hist-1', name: 'Historical ATM Cash-out #401', lat: 23.0180, lng: 72.5400, amount: '₹1,50,000', district: 'Ahmedabad' },
  { id: 'hist-2', name: 'Historical ATM Cash-out #402', lat: 23.0450, lng: 72.5050, amount: '₹2,20,000', district: 'Ahmedabad' },
  { id: 'hist-3', name: 'Historical ATM Cash-out #403', lat: 23.0120, lng: 72.5620, amount: '₹95,000', district: 'Ahmedabad' },
  { id: 'hist-4', name: 'Historical ATM Cash-out #404', lat: 22.3080, lng: 73.1850, amount: '₹3,10,000', district: 'Vadodara' },
  // Interstate
  { id: 'hist-5', name: 'Historical Cash-out #501 BKC', lat: 19.0640, lng: 72.8660, amount: '₹4,50,000', district: 'Mumbai' },
  { id: 'hist-6', name: 'Historical ATM Blitz #602 CP', lat: 28.6300, lng: 77.2140, amount: '₹5,80,000', district: 'New Delhi' },
];

export const ACTIVE_CASES = [
  { id: 'act-1', name: 'Active UPI Mule Hop #1', lat: 23.0295, lng: 72.5250, caseId: 'CT-3026-002', district: 'Ahmedabad' },
  { id: 'act-2', name: 'Active UPI Mule Hop #2', lat: 23.0340, lng: 72.5160, caseId: 'CT-3026-002', district: 'Ahmedabad' },
  { id: 'act-3', name: 'Active IMPS Node #3', lat: 21.1720, lng: 72.8290, caseId: 'CT-3026-001', district: 'Surat' },
  { id: 'act-4', name: 'Active RTGS Rapid Hop #4', lat: 19.0670, lng: 72.8670, caseId: 'CT-3026-004', district: 'Mumbai' },
  { id: 'act-5', name: 'Active UPI Mule Node #5', lat: 28.6330, lng: 77.2155, caseId: 'CT-3026-009', district: 'New Delhi' },
];

// Crash-proof zero-dependency Google Maps script loader
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (window.google?.maps?.Map) {
      resolve(window.google);
      return;
    }

    const existingScript = document.querySelector('script[data-gmaps-loader="true"]');
    if (existingScript) {
      if (window.google?.maps?.Map) {
        resolve(window.google);
      } else {
        existingScript.addEventListener('load', () => resolve(window.google));
        existingScript.addEventListener('error', () => resolve(null));
      }
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('data-gmaps-loader', 'true');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      console.warn('Google Maps script network load notice. Continuing with Leaflet OSM.');
      resolve(null);
    };
    document.head.appendChild(script);
  });
};

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
  const [internalEngine, setInternalEngine] = useState('leaflet');
  const [googleAuthError, setGoogleAuthError] = useState(false);
  const activeEngine = propEngine || internalEngine;

  const [currentCoords, setCurrentCoords] = useState({ lat: 23.0300, lng: 72.5178 });

  // Map references
  const googleContainerRef = useRef(null);
  const leafletContainerRef = useRef(null);

  const googleMapInstance = useRef(null);
  const googleOverlays = useRef({ markers: [], circles: [], lines: [], heatmap: null });
  const googleInfoWindow = useRef(null);

  const leafletMapInstance = useRef(null);
  const leafletLayerGroup = useRef(null);
  const leafletTileLayer = useRef(null);

  const defaultCenter = useMemo(() => {
    return REGION_COORDINATES[selectedDistrict] || REGION_COORDINATES[selectedState] || { lat: 23.0300, lng: 72.5178, zoom: 13 };
  }, [selectedDistrict, selectedState]);

  const handleCoords = useCallback((lat, lng) => {
    setCurrentCoords({ lat, lng });
    if (onCoordinatesChange) {
      onCoordinatesChange(lat, lng);
    }
  }, [onCoordinatesChange]);

  const handleEngineSwitch = useCallback((target) => {
    setInternalEngine(target);
    if (onEngineChange) onEngineChange(target);

    // Refresh size upon visibility toggle
    setTimeout(() => {
      if (target === 'google' && googleMapInstance.current && window.google?.maps?.event) {
        window.google.maps.event.trigger(googleMapInstance.current, 'resize');
        googleMapInstance.current.panTo({ lat: currentCoords.lat, lng: currentCoords.lng });
      } else if (target === 'leaflet' && leafletMapInstance.current) {
        leafletMapInstance.current.invalidateSize();
        leafletMapInstance.current.setView([currentCoords.lat, currentCoords.lng]);
      }
    }, 100);
  }, [currentCoords, onEngineChange]);

  // Automatic Google Maps error detection (domain restrictions, RefererNotAllowedMapError)
  useEffect(() => {
    const prevAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      console.warn('Google Maps authentication failed (domain referrer restriction). Auto-switching to Leaflet OSM.');
      setGoogleAuthError(true);
      handleEngineSwitch('leaflet');
      if (typeof prevAuthFailure === 'function') prevAuthFailure();
    };

    let observer = null;
    const checkErrorOverlay = () => {
      if (!googleContainerRef.current) return false;
      const hasErrorEl =
        googleContainerRef.current.querySelector('.gm-err-container') ||
        googleContainerRef.current.querySelector('.gm-err-message');
      const hasErrorText =
        googleContainerRef.current.innerText &&
        googleContainerRef.current.innerText.includes('Oops! Something went wrong');

      if (hasErrorEl || hasErrorText) {
        console.warn('Google Maps error container detected in DOM. Auto-switching to Leaflet OSM.');
        setGoogleAuthError(true);
        handleEngineSwitch('leaflet');
        return true;
      }
      return false;
    };

    if (googleContainerRef.current) {
      observer = new MutationObserver(() => {
        checkErrorOverlay();
      });
      observer.observe(googleContainerRef.current, { childList: true, subtree: true });
    }

    const interval = setInterval(checkErrorOverlay, 800);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      if (observer) observer.disconnect();
      clearInterval(interval);
      clearTimeout(timeout);
      window.gm_authFailure = prevAuthFailure;
    };
  }, [handleEngineSwitch]);

  // Filter hotspots based on risk filter & region selection
  const visibleHotspots = useMemo(() => {
    let list = HOTSPOTS;

    // Filter by risk
    if (selectedRisk && selectedRisk !== 'All Levels') {
      if (selectedRisk.includes('High') || selectedRisk.includes('Critical')) {
        list = list.filter((s) => s.riskScore >= 70);
      } else if (selectedRisk.includes('Medium') || selectedRisk.includes('Elevated')) {
        list = list.filter((s) => s.riskScore >= 50 && s.riskScore < 70);
      } else if (selectedRisk.includes('Low') || selectedRisk.includes('Monitored')) {
        list = list.filter((s) => s.riskScore < 50);
      }
    }

    return list;
  }, [selectedRisk]);

  // Filter auxiliary points by region when possible
  const visibleAtms = useMemo(() => {
    const matched = ATM_POINTS.filter((p) => p.district === selectedDistrict);
    return matched.length > 0 ? matched : ATM_POINTS;
  }, [selectedDistrict]);

  const visibleHistorical = useMemo(() => {
    const matched = HISTORICAL_POINTS.filter((p) => p.district === selectedDistrict);
    return matched.length > 0 ? matched : HISTORICAL_POINTS;
  }, [selectedDistrict]);

  const visibleActiveCases = useMemo(() => {
    const matched = ACTIVE_CASES.filter((p) => p.district === selectedDistrict);
    return matched.length > 0 ? matched : ACTIVE_CASES;
  }, [selectedDistrict]);

  // -------------------------------------------------------------
  // 1. GOOGLE MAPS ENGINE
  // -------------------------------------------------------------
  const initGoogleMap = useCallback(async () => {
    if (!googleContainerRef.current) return;

    if (googleMapInstance.current && window.google?.maps?.Map) {
      window.google.maps.event.trigger(googleMapInstance.current, 'resize');
      renderGoogleOverlays(window.google, googleMapInstance.current);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyASeiOhzKOyOOPditkIRxtsC8CPbuQ-dI4';

    try {
      const google = await loadGoogleMapsScript(apiKey);
      if (!googleContainerRef.current || !google?.maps?.Map) return;

      const mapType =
        activeViewMode === 'Satellite View'
          ? google.maps.MapTypeId.SATELLITE
          : activeViewMode === '3D View'
          ? google.maps.MapTypeId.HYBRID
          : google.maps.MapTypeId.ROADMAP;

      const map = new google.maps.Map(googleContainerRef.current, {
        center: { lat: defaultCenter.lat, lng: defaultCenter.lng },
        zoom: defaultCenter.zoom || 13,
        mapTypeId: mapType,
        disableDefaultUI: false,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });

      googleMapInstance.current = map;
      googleInfoWindow.current = new google.maps.InfoWindow();

      map.addListener('mousemove', (e) => {
        handleCoords(e.latLng.lat(), e.latLng.lng());
      });

      renderGoogleOverlays(google, map);
    } catch (err) {
      console.warn('Google Maps Initialization notice:', err);
    }
  }, [activeViewMode, defaultCenter, handleCoords]);

  const renderGoogleOverlays = useCallback(
    (google, map) => {
      if (!google?.maps || !map) return;

      // Clear existing overlays
      googleOverlays.current.markers.forEach((m) => m.setMap(null));
      googleOverlays.current.circles.forEach((c) => c.setMap(null));
      googleOverlays.current.lines.forEach((l) => l.setMap(null));
      if (googleOverlays.current.heatmap) {
        googleOverlays.current.heatmap.setMap(null);
        googleOverlays.current.heatmap = null;
      }
      googleOverlays.current = { markers: [], circles: [], lines: [], heatmap: null };

      // Helper to open styled Google InfoWindow
      const showInfoWindow = (marker, title, badge, contentHtml, spot) => {
        if (!googleInfoWindow.current) return;
        const html = `
          <div style="padding: 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; max-width: 270px; line-height: 1.4;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; ${badge.style}">
                ${badge.text}
              </span>
              <span style="font-size: 10px; font-weight: 600; color: #64748b;">${badge.sub || ''}</span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${title}</h4>
            <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">${contentHtml}</div>
            ${
              spot
                ? `<button id="btn-view-case-${spot.id}" style="width: 100%; padding: 6px 10px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
                    View Cases (${spot.relatedCases}) &rarr;
                  </button>`
                : ''
            }
          </div>
        `;
        googleInfoWindow.current.setContent(html);
        googleInfoWindow.current.open(map, marker);

        if (spot) {
          google.maps.event.addListenerOnce(googleInfoWindow.current, 'domready', () => {
            const btn = document.getElementById(`btn-view-case-${spot.id}`);
            if (btn) {
              btn.onclick = () => {
                if (onSelectHotspot) onSelectHotspot(spot);
              };
            }
          });
        }
      };

      // 1. High-Precision Thermal Heatmap Gradient (Fully compatible with Google Maps v3.65+)
      if (activeViewMode === 'Heatmap View' && layers.predicted) {
        visibleHotspots.forEach((spot) => {
          // Outer thermal dissipation ring (amber)
          const outerCircle = new google.maps.Circle({
            strokeColor: '#F59E0B',
            strokeOpacity: 0.35,
            strokeWeight: 1,
            fillColor: '#FBBF24',
            fillOpacity: 0.12,
            map,
            center: { lat: spot.lat, lng: spot.lng },
            radius: spot.radiusMeters * 1.6,
          });
          googleOverlays.current.circles.push(outerCircle);

          // Mid-level thermal dispersion ring (orange)
          const midCircle = new google.maps.Circle({
            strokeColor: '#EA580C',
            strokeOpacity: 0.5,
            strokeWeight: 1.5,
            fillColor: '#F97316',
            fillOpacity: 0.22,
            map,
            center: { lat: spot.lat, lng: spot.lng },
            radius: spot.radiusMeters * 1.15,
          });
          googleOverlays.current.circles.push(midCircle);
        });
      }

      // 2. Predicted Hotspots & Threat Rings
      if (layers.predicted) {
        visibleHotspots.forEach((spot) => {
          const circle = new google.maps.Circle({
            strokeColor: '#DC2626',
            strokeOpacity: 0.85,
            strokeWeight: 2,
            fillColor: '#EF4444',
            fillOpacity: activeViewMode === 'Cluster View' ? 0.12 : 0.24,
            map,
            center: { lat: spot.lat, lng: spot.lng },
            radius: spot.radiusMeters,
          });
          googleOverlays.current.circles.push(circle);

          const marker = new google.maps.Marker({
            position: { lat: spot.lat, lng: spot.lng },
            map,
            title: `${spot.name} (${spot.riskScore}% Risk)`,
            label:
              activeViewMode === 'Cluster View'
                ? {
                    text: `${spot.relatedCases}`,
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }
                : null,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: activeViewMode === 'Cluster View' ? 14 : 9,
              fillColor: spot.riskScore >= 70 ? '#DC2626' : '#EA580C',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2.5,
            },
          });

          const badge = {
            style: 'color: #dc2626; background: #fef2f2; padding: 2px 6px; border-radius: 9999px; border: 1px solid #fecaca;',
            text: `● ${spot.riskBand} (${spot.riskScore}%)`,
            sub: spot.caseId,
          };
          const content = `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px;">
              <div><strong>Time Window:</strong> ${spot.timeWindow}</div>
              <div><strong>Linked Cases:</strong> ${spot.relatedCases}</div>
            </div>
            <div>${spot.description}</div>
          `;

          marker.addListener('click', () => {
            if (onSelectHotspot) onSelectHotspot(spot);
            if (setShowPopup) setShowPopup(true);
            showInfoWindow(marker, spot.name, badge, content, spot);
            handleCoords(spot.lat, spot.lng);
          });

          circle.addListener('click', () => {
            if (onSelectHotspot) onSelectHotspot(spot);
            if (setShowPopup) setShowPopup(true);
            showInfoWindow(marker, spot.name, badge, content, spot);
          });

          googleOverlays.current.markers.push(marker);
        });
      }

      // 3. ATM Nodes
      if (layers.atm) {
        visibleAtms.forEach((atm) => {
          const marker = new google.maps.Marker({
            position: { lat: atm.lat, lng: atm.lng },
            map,
            title: `🏧 ${atm.name}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: '#F59E0B',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1.5,
            },
          });

          const badge = {
            style: 'color: #b45309; background: #fffbeb; padding: 2px 6px; border-radius: 9999px; border: 1px solid #fde68a;',
            text: '🏧 Bank ATM',
            sub: atm.district,
          };
          const content = `<div>24x7 Banking Terminal monitored for structured cash-outs.</div>`;

          marker.addListener('click', () => {
            showInfoWindow(marker, atm.name, badge, content, null);
            handleCoords(atm.lat, atm.lng);
          });

          googleOverlays.current.markers.push(marker);
        });
      }

      // 4. Historical Cash-out Points
      if (layers.historical) {
        visibleHistorical.forEach((hist) => {
          const marker = new google.maps.Marker({
            position: { lat: hist.lat, lng: hist.lng },
            map,
            title: `🕒 ${hist.name} (${hist.amount})`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#2563EB',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1.5,
            },
          });

          const badge = {
            style: 'color: #1d4ed8; background: #eff6ff; padding: 2px 6px; border-radius: 9999px; border: 1px solid #bfdbfe;',
            text: '🕒 Historical Fraud Event',
            sub: hist.amount,
          };
          const content = `<div>Confirmed historical skimming / withdrawal point recorded in complaint repository.</div>`;

          marker.addListener('click', () => {
            showInfoWindow(marker, hist.name, badge, content, null);
            handleCoords(hist.lat, hist.lng);
          });

          googleOverlays.current.markers.push(marker);
        });
      }

      // 5. Active Investigation Cases
      if (layers.active) {
        visibleActiveCases.forEach((act) => {
          const marker = new google.maps.Marker({
            position: { lat: act.lat, lng: act.lng },
            map,
            title: `🟢 ${act.name}`,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#10B981',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 1.5,
            },
          });

          const badge = {
            style: 'color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 9999px; border: 1px solid #a7f3d0;',
            text: '🟢 Active Hop',
            sub: act.caseId,
          };
          const content = `<div>Live mule account hop currently under investigative freeze.</div>`;

          marker.addListener('click', () => {
            showInfoWindow(marker, act.name, badge, content, null);
            handleCoords(act.lat, act.lng);
          });

          googleOverlays.current.markers.push(marker);
        });
      }

      // 6. Threat Vector Routes
      const vectorCoords = [
        { lat: 23.0300, lng: 72.5178 },
        { lat: 22.3107, lng: 73.1812 },
        { lat: 21.1702, lng: 72.8311 },
      ];
      const polyline = new google.maps.Polyline({
        path: vectorCoords,
        geodesic: true,
        strokeColor: '#EF4444',
        strokeOpacity: 0.85,
        strokeWeight: 2,
        map,
      });
      googleOverlays.current.lines.push(polyline);
    },
    [layers, visibleHotspots, visibleAtms, visibleHistorical, visibleActiveCases, activeViewMode, onSelectHotspot, setShowPopup, handleCoords]
  );

  // -------------------------------------------------------------
  // 2. LEAFLET ENGINE (With strict _leaflet_id protection)
  // -------------------------------------------------------------
  const initLeafletMap = useCallback(() => {
    if (!leafletContainerRef.current) return;

    // Safety: Reset any stale _leaflet_id to avoid "Map container is already initialized" crash
    if (leafletContainerRef.current._leaflet_id) {
      if (leafletMapInstance.current) {
        try {
          leafletMapInstance.current.remove();
        } catch (e) {
          // ignore cleanup err
        }
        leafletMapInstance.current = null;
      }
      delete leafletContainerRef.current._leaflet_id;
    }

    try {
      const map = L.map(leafletContainerRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: defaultCenter.zoom || 13,
        zoomControl: false,
      });

      const isSatellite = activeViewMode === 'Satellite View' || activeViewMode === '3D View';
      const tileUrl = isSatellite
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileAttr = isSatellite ? '&copy; Esri World Imagery' : '&copy; OpenStreetMap contributors';
      const tileLayer = L.tileLayer(tileUrl, { maxZoom: 19, attribution: tileAttr }).addTo(map);
      leafletTileLayer.current = tileLayer;

      const layerGroup = L.layerGroup().addTo(map);
      leafletLayerGroup.current = layerGroup;
      leafletMapInstance.current = map;

      map.on('mousemove', (e) => {
        handleCoords(e.latlng.lat, e.latlng.lng);
      });

      renderLeafletLayers(map, layerGroup);
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
    }
  }, [activeViewMode, defaultCenter, handleCoords]);

  const renderLeafletLayers = useCallback(
    (map, group) => {
      if (!map || !group) return;
      group.clearLayers();

      // 1. Hotspots
      if (layers.predicted) {
        visibleHotspots.forEach((spot) => {
          const circle = L.circle([spot.lat, spot.lng], {
            radius: spot.radiusMeters,
            color: '#DC2626',
            weight: 2,
            fillColor: '#EF4444',
            fillOpacity: activeViewMode === 'Cluster View' ? 0.12 : 0.22,
            dashArray: '4, 4',
          });
          circle.addTo(group);

          const customPin = L.divIcon({
            className: 'custom-leaflet-marker',
            html:
              activeViewMode === 'Cluster View'
                ? `
              <div style="position: relative; width: 28px; height: 28px; background: #DC2626; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
                ${spot.relatedCases}
              </div>
            `
                : `
              <div style="position: relative; width: 24px; height: 24px;">
                <div style="position: absolute; width: 24px; height: 24px; background: rgba(239,68,68,0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #DC2626; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const popupHtml = `
            <div style="padding: 6px; font-family: sans-serif; color: #0f172a; min-width: 200px;">
              <div style="font-weight: 700; color: #dc2626; font-size: 12px; margin-bottom: 2px;">
                ● ${spot.riskBand} (${spot.riskScore}%)
              </div>
              <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">${spot.name}</div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
                <div>Time: ${spot.timeWindow}</div>
                <div>Cases: ${spot.relatedCases}</div>
              </div>
              <button id="leaflet-btn-${spot.id}" style="width: 100%; padding: 5px 8px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
                View Cases (${spot.relatedCases})
              </button>
            </div>
          `;

          const marker = L.marker([spot.lat, spot.lng], { icon: customPin })
            .bindPopup(popupHtml)
            .addTo(group);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`leaflet-btn-${spot.id}`);
            if (btn) {
              btn.onclick = () => {
                if (onSelectHotspot) onSelectHotspot(spot);
              };
            }
          });

          marker.on('click', () => {
            if (onSelectHotspot) onSelectHotspot(spot);
            if (setShowPopup) setShowPopup(true);
            map.panTo([spot.lat, spot.lng]);
            handleCoords(spot.lat, spot.lng);
          });

          circle.on('click', () => {
            if (onSelectHotspot) onSelectHotspot(spot);
            if (setShowPopup) setShowPopup(true);
          });
        });
      }

      // 2. ATM Nodes
      if (layers.atm) {
        visibleAtms.forEach((atm) => {
          const atmIcon = L.divIcon({
            className: 'atm-marker',
            html: `<div style="width: 12px; height: 12px; background: #F59E0B; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          });
          L.marker([atm.lat, atm.lng], { icon: atmIcon })
            .bindPopup(`<b>ATM Cashpoint:</b><br/>${atm.name}<br/><span style="color:#64748b; font-size:10px;">${atm.district}</span>`)
            .addTo(group);
        });
      }

      // 3. Historical Points
      if (layers.historical) {
        visibleHistorical.forEach((hist) => {
          const histIcon = L.divIcon({
            className: 'hist-marker',
            html: `<div style="width: 14px; height: 14px; background: #2563EB; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          L.marker([hist.lat, hist.lng], { icon: histIcon })
            .bindPopup(`<b>Historical Cash-out:</b><br/>${hist.name}<br/><b>Amount:</b> ${hist.amount}`)
            .addTo(group);
        });
      }

      // 4. Active Cases
      if (layers.active) {
        visibleActiveCases.forEach((act) => {
          const actIcon = L.divIcon({
            className: 'active-marker',
            html: `<div style="width: 12px; height: 12px; background: #10B981; border: 2px solid #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          });
          L.marker([act.lat, act.lng], { icon: actIcon })
            .bindPopup(`<b>Active Mule Hop:</b><br/>${act.name}<br/><b>Case:</b> ${act.caseId}`)
            .addTo(group);
        });
      }

      // 5. Threat Vectors
      const vectorCoords = [
        [23.0300, 72.5178],
        [22.3107, 73.1812],
        [21.1702, 72.8311],
      ];
      L.polyline(vectorCoords, {
        color: '#EF4444',
        weight: 2,
        dashArray: '6, 6',
        opacity: 0.85,
      }).addTo(group);
    },
    [layers, visibleHotspots, visibleAtms, visibleHistorical, visibleActiveCases, activeViewMode, onSelectHotspot, setShowPopup, handleCoords]
  );

  // -------------------------------------------------------------
  // SYNC & REACTIVITY HOOKS
  // -------------------------------------------------------------
  // Mount both engines on startup with clean unmount handling
  useEffect(() => {
    initGoogleMap();
    initLeafletMap();

    return () => {
      if (leafletMapInstance.current) {
        try {
          leafletMapInstance.current.remove();
        } catch (e) {
          // ignore
        }
        leafletMapInstance.current = null;
      }
      if (leafletContainerRef.current?._leaflet_id) {
        delete leafletContainerRef.current._leaflet_id;
      }
    };
  }, [initGoogleMap, initLeafletMap]);

  // Sync Layers & Overlays whenever layers or risk filter changes
  useEffect(() => {
    if (googleMapInstance.current && window.google) {
      renderGoogleOverlays(window.google, googleMapInstance.current);
    }
    if (leafletMapInstance.current && leafletLayerGroup.current) {
      renderLeafletLayers(leafletMapInstance.current, leafletLayerGroup.current);
    }
  }, [renderGoogleOverlays, renderLeafletLayers]);

  // Sync View Mode on both maps
  useEffect(() => {
    if (googleMapInstance.current && window.google) {
      if (activeViewMode === 'Satellite View') {
        googleMapInstance.current.setMapTypeId(window.google.maps.MapTypeId.SATELLITE);
        googleMapInstance.current.setTilt(0);
      } else if (activeViewMode === '3D View') {
        googleMapInstance.current.setMapTypeId(window.google.maps.MapTypeId.HYBRID);
        googleMapInstance.current.setTilt(45);
        googleMapInstance.current.setHeading(45);
      } else {
        googleMapInstance.current.setMapTypeId(window.google.maps.MapTypeId.ROADMAP);
        googleMapInstance.current.setTilt(0);
      }
      renderGoogleOverlays(window.google, googleMapInstance.current);
    }
    if (leafletMapInstance.current) {
      if (leafletTileLayer.current) {
        leafletMapInstance.current.removeLayer(leafletTileLayer.current);
      }
      const isSatellite = activeViewMode === 'Satellite View' || activeViewMode === '3D View';
      const tileUrl = isSatellite
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileAttr = isSatellite ? '&copy; Esri World Imagery' : '&copy; OpenStreetMap contributors';
      const tileLayer = L.tileLayer(tileUrl, { maxZoom: 19, attribution: tileAttr }).addTo(leafletMapInstance.current);
      leafletTileLayer.current = tileLayer;
      leafletMapInstance.current.invalidateSize();
    }
  }, [activeViewMode, renderGoogleOverlays]);

  // Sync State / District pan & zoom on both maps
  useEffect(() => {
    const target = REGION_COORDINATES[selectedDistrict] || REGION_COORDINATES[selectedState];
    if (target) {
      if (googleMapInstance.current) {
        googleMapInstance.current.panTo({ lat: target.lat, lng: target.lng });
        googleMapInstance.current.setZoom(target.zoom || 13);
      }
      if (leafletMapInstance.current) {
        leafletMapInstance.current.setView([target.lat, target.lng], target.zoom || 13);
      }
      handleCoords(target.lat, target.lng);
    }
  }, [selectedDistrict, selectedState, handleCoords]);

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
    const center = defaultCenter;
    if (activeEngine === 'google' && googleMapInstance.current) {
      googleMapInstance.current.panTo({ lat: center.lat, lng: center.lng });
      googleMapInstance.current.setZoom(center.zoom || 13);
    } else if (leafletMapInstance.current) {
      leafletMapInstance.current.setView([center.lat, center.lng], center.zoom || 13);
    }
    handleCoords(center.lat, center.lng);
  };

  const activeSpot = selectedHotspot || visibleHotspots[0] || HOTSPOTS[0];

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100">
      {/* 1. GOOGLE MAPS DEDICATED CONTAINER */}
      <div
        ref={googleContainerRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
          activeEngine === 'google' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* 2. LEAFLET OSM DEDICATED CONTAINER */}
      <div
        ref={leafletContainerRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
          activeEngine === 'leaflet' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Interactive Engine Switcher Toggle (Top-Left) */}
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
          <span>{activeEngine === 'google' ? 'Google Maps JavaScript API' : 'Leaflet + OpenStreetMap GIS'}</span>
        </div>

        {/* Google Maps Restriction Alert if fallback triggered */}
        {googleAuthError && activeEngine === 'leaflet' && (
          <div className="bg-amber-50/95 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 shadow-xs backdrop-blur-md animate-in fade-in">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Google Maps domain restricted on Vercel. Auto-switched to <strong>Leaflet OpenStreetMap</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Map Control Buttons (Top-Right) */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
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

      {/* Floating Hotspot HUD Quick-Card (Bottom-Left) */}
      {showPopup && activeSpot && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 w-72 z-20 animate-in fade-in zoom-in-95 duration-200">
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
              <span className="font-bold text-red-600">{activeSpot.riskScore}% ({activeSpot.riskBand})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time Window:</span>
              <span className="font-semibold text-slate-800">{activeSpot.timeWindow}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Related Cases:</span>
              <span className="font-semibold text-slate-800">{activeSpot.relatedCases} Cases</span>
            </div>
            <div className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
              {activeSpot.description}
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectHotspot) onSelectHotspot(activeSpot);
            }}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View Cases ({activeSpot.relatedCases})</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
}
