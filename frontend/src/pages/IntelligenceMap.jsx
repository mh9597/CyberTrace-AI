import React, { useState, Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Globe,
  Compass,
  AlertTriangle,
  RefreshCw,
  Layers,
  ShieldCheck,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from 'lucide-react';
import GoogleMapView from '../features/map/GoogleMapView';
import { useHotspots } from '../features/map/useHotspots';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';

// Fallback Leaflet Marker Icons
const hotspotIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const candidateIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// React Error Boundary for Google Maps
class GoogleMapsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught error in Google Maps component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-400 font-mono text-xs space-y-4 rounded-2xl border border-slate-800">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
          <div className="text-white text-sm font-semibold">Google Maps Error Encountered</div>
          <div className="text-slate-400 text-xs text-center max-w-md">
            {this.state.error?.message || 'Error initializing Google Maps Platform'}
          </div>
          <button
            onClick={() => this.props.onFallback()}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
          >
            Switch to OpenStreetMap (Leaflet)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function IntelligenceMap() {
  const { hotspots, candidates, patrolUnits, loading } = useHotspots();
  const [provider, setProvider] = useState('google'); // 'google' or 'leaflet'
  const [showHotspots, setShowHotspots] = useState(true);
  const [showCandidates, setShowCandidates] = useState(true);
  const [showPatrols, setShowPatrols] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Geospatial Intelligence Map</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-300 font-semibold dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800/60">
              {provider === 'google' ? 'GOOGLE MAPS ENGINE' : 'LEAFLET OPENSTREETMAP'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time geospatial intelligence visualizing historical DBSCAN clusters and AI cash-out perimeters.
          </p>
        </div>

        {/* Map Provider & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Layer Toggles */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-1 rounded-xl text-xs font-mono shadow-xs">
            <button
              onClick={() => setShowCandidates(!showCandidates)}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1.5 ${
                showCandidates
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800/60'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400" />
              <span>Forecasts</span>
            </button>
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1.5 ${
                showHotspots
                  ? 'bg-purple-100 text-purple-900 border border-purple-300 font-semibold dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800/60'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
              <span>Hotspots</span>
            </button>
            <button
              onClick={() => setShowPatrols(!showPatrols)}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium flex items-center gap-1.5 ${
                showPatrols
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/60'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              <span>Patrol Units</span>
            </button>
          </div>

          {/* Provider Toggle */}
          <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setProvider('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                provider === 'google'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => setProvider('leaflet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                provider === 'leaflet'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>OpenStreetMap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Render with Overlays */}
      <div className="flex-1 w-full relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md dark:shadow-2xl">
        {provider === 'google' ? (
          <GoogleMapsErrorBoundary onFallback={() => setProvider('leaflet')}>
            <GoogleMapView
              hotspots={showHotspots ? hotspots : []}
              candidates={showCandidates ? candidates : []}
              patrolUnits={showPatrols ? patrolUnits : []}
              center={{ lat: 28.6295, lng: 77.2185 }}
              zoom={13}
            />
          </GoogleMapsErrorBoundary>
        ) : (
          <div className="w-full h-full relative">
            <MapContainer
              center={[28.6295, 77.2185]}
              zoom={12}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {showCandidates &&
                candidates.map((cand) => (
                  <React.Fragment key={cand.lead_id}>
                    <Marker
                      position={[cand.latitude, cand.longitude]}
                      icon={candidateIcon}
                      eventHandlers={{
                        click: () => setSelectedEntity({ ...cand, entityType: 'candidate' }),
                      }}
                    >
                      <Popup>
                        <div className="space-y-2 p-1 text-slate-800 dark:text-slate-100 font-sans max-w-xs">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                            <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                              {cand.complaint_id} FORECAST
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 font-semibold">
                              {(cand.risk_estimate * 100).toFixed(0)}% Risk
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{cand.zone_name}</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                            Time Window: {cand.estimated_window}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            Perimeter: {cand.radius_km} km radius
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[cand.latitude, cand.longitude]}
                      radius={cand.radius_km * 1000}
                      pathOptions={{
                        color: '#ef4444',
                        fillColor: '#ef4444',
                        fillOpacity: 0.15,
                        weight: 2,
                        dashArray: '4, 4',
                      }}
                    />
                  </React.Fragment>
                ))}

              {showHotspots &&
                hotspots.map((spot) => (
                  <React.Fragment key={spot.cluster_id}>
                    <Marker
                      position={[spot.latitude, spot.longitude]}
                      icon={hotspotIcon}
                      eventHandlers={{
                        click: () => setSelectedEntity({ ...spot, entityType: 'hotspot' }),
                      }}
                    >
                      <Popup>
                        <div className="space-y-1.5 p-1 text-slate-800 dark:text-slate-100 font-sans max-w-xs">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1">
                            <span className="font-mono text-xs text-indigo-700 dark:text-indigo-400 font-bold">
                              CLUSTER #{spot.cluster_id}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 font-semibold">
                              Density: {(spot.density_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{spot.zone_name}</div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                            Withdrawals: {spot.historical_withdrawals_count} recorded
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Peak Activity: {spot.peak_hours}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    <Circle
                      center={[spot.latitude, spot.longitude]}
                      radius={800}
                      pathOptions={{
                        color: '#8b5cf6',
                        fillColor: '#8b5cf6',
                        fillOpacity: 0.1,
                        weight: 1.5,
                      }}
                    />
                  </React.Fragment>
                ))}
            </MapContainer>
          </div>
        )}

        {/* Floating Map Legend Card */}
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-2 font-mono">
          <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Spatial Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300">Predicted Cash-out Candidate Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span className="text-slate-700 dark:text-slate-300">DBSCAN Historical Clustered Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Tactical Police Patrol Unit</span>
          </div>
        </div>

        {/* Selected Entity Inspector Drawer */}
        {selectedEntity && (
          <div className="absolute top-4 right-4 z-[1000] w-80 p-4 rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-in fade-in slide-in-from-right-4 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase">
                {selectedEntity.entityType === 'candidate' ? 'Forecast Lead' : 'DBSCAN Cluster'}
              </span>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedEntity.zone_name || `Cluster #${selectedEntity.cluster_id}`}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                Lat: {selectedEntity.latitude?.toFixed(4)}, Lng: {selectedEntity.longitude?.toFixed(4)}
              </div>
            </div>
            {selectedEntity.entityType === 'candidate' ? (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Confidence:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {(selectedEntity.risk_estimate * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Time Window:</span>
                  <span className="text-indigo-700 dark:text-indigo-300 font-semibold">{selectedEntity.estimated_window}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Density Score:</span>
                  <span className="text-purple-700 dark:text-purple-300 font-bold">
                    {(selectedEntity.density_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Historical Hits:</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {selectedEntity.historical_withdrawals_count} withdrawals
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
