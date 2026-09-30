import React, { useState } from 'react';
import { X, ShieldAlert, Radio, Navigation, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function FieldInterceptCard({ unit, targetZone, targetLat, targetLng, complaintId, isOpen, onClose }) {
  const [dispatching, setDispatching] = useState(false);
  const [order, setOrder] = useState(null);

  if (!isOpen || !unit) return null;

  const handleDispatch = async () => {
    setDispatching(true);
    try {
      const res = await api.post('/map/patrol/dispatch', {
        unit_id: unit.unit_id,
        target_zone: targetZone || 'Connaught Place Commercial ATM Cluster',
        target_lat: targetLat || 28.6295,
        target_lng: targetLng || 77.2185,
        complaint_id: complaintId || 'CT-2026-001',
      });
      setOrder(res.data);
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Tactical Ground Intercept</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800/60">
                  {unit.call_sign}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{unit.station_name}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs font-sans text-slate-200">
          {order ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-2 text-center animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-white text-sm">Patrol Unit Dispatched Successfully</div>
              <div className="text-xs text-slate-300">
                Order Ref: <strong className="font-mono text-cyan-400">{order.dispatch_order_id}</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Unit {order.call_sign} is en route. ETA: <strong className="text-white">{order.eta_minutes} minutes</strong>.
              </div>
              <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                Radio Comm: {order.radio_frequency}
              </div>
            </div>
          ) : (
            <>
              {/* Unit Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">Distance</div>
                  <div className="text-sm font-bold text-white">{unit.distance_km} km</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">Intercept ETA</div>
                  <div className="text-sm font-bold text-amber-400">~{unit.eta_minutes} mins</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">Radio Channel</div>
                  <div className="text-xs font-mono font-bold text-cyan-400 truncate">{unit.radio_frequency}</div>
                </div>
              </div>

              {/* Personnel Details */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Lead Patrol Officer</div>
                <div className="text-xs font-semibold text-white">{unit.lead_officer} ({unit.personnel_count} Officers Assigned)</div>
                <div className="text-[11px] text-slate-400 font-mono">Control Helpline: {unit.contact_phone}</div>
              </div>

              {/* Target Location Alert */}
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-1">
                <div className="text-[10px] font-mono text-rose-300 font-bold uppercase flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  <span>Target Cash-out Perimeter</span>
                </div>
                <div className="text-xs font-semibold text-white">{targetZone || 'Connaught Place ATM Cluster, New Delhi'}</div>
                <div className="text-[11px] text-slate-400 font-mono">GPS: {targetLat || 28.6295}, {targetLng || 77.2185}</div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition">
            Dismiss
          </button>
          {!order && (
            <button
              onClick={handleDispatch}
              disabled={dispatching}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{dispatching ? 'Dispatching...' : 'Dispatch Patrol Unit'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
