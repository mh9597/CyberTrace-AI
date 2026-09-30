import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ShieldAlert,
  Send,
  User,
  Filter,
  CheckCircle2,
  MapPin,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.review_status = statusFilter;
      const res = await api.get('/alerts', { params });
      setAlerts(res.data || []);
      if (res.data?.length > 0 && !selectedAlert) {
        setSelectedAlert(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter]);

  const handleUpdateStatus = async (alertId, newStatus) => {
    try {
      const res = await api.patch(`/alerts/${alertId}`, {
        review_status: newStatus,
        assigned_officer_name: user?.full_name || 'Investigating Officer',
        decision_notes: `Status updated to ${newStatus} by ${user?.full_name || 'Officer'}`,
      });
      setSelectedAlert(res.data);
      loadAlerts();
    } catch (e) {
      alert('Failed to update alert');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !selectedAlert) return;
    try {
      const res = await api.post(`/alerts/${selectedAlert.id}/notes`, { note: noteInput });
      setSelectedAlert(res.data);
      setNoteInput('');
      loadAlerts();
    } catch (e) {
      alert('Failed to append note');
    }
  };

  const filterOptions = [
    { label: 'All Alerts', value: '' },
    { label: 'Pending Review', value: 'Pending Review' },
    { label: 'Verified Lead', value: 'Verified Lead' },
    { label: 'Dismissed', value: 'Dismissed' },
    { label: 'Action Taken', value: 'Action Taken' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <span>Alerts & Investigation Decision Workflow</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review algorithmic cash-out forecasts, verify investigative leads, and record immutable officer decisions.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                statusFilter === opt.value
                  ? 'bg-rose-100 text-rose-900 border border-rose-300 font-semibold shadow-xs dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800/60'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-mono text-xs">
          Loading investigative alert queue...
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white border border-dashed border-slate-300 shadow-xs dark:bg-slate-900/60 dark:border-slate-800 space-y-2">
          <FolderOpen className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No Active Alerts In Queue</h3>
          <p className="text-xs text-slate-500">
            Generate new candidate forecasts in the Prediction Center to populate the triage queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts List (1 Col) */}
          <div className="space-y-3">
            {alerts.map((a) => {
              const isSelected = selectedAlert?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => setSelectedAlert(a)}
                  className={`p-4 rounded-xl cursor-pointer transition border text-xs space-y-2.5 ${
                    isSelected
                      ? 'bg-sky-50 border-cyan-400 shadow-xs ring-1 ring-cyan-400/50 dark:bg-slate-900 dark:border-cyan-500/50 dark:shadow-glow-cyan'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs dark:bg-slate-950/70 dark:border-slate-800/80 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-700 dark:text-cyan-300">{a.alert_code}</span>
                    <StatusBadge status={a.review_status} />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">{a.candidate_zone}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Window: {a.time_window}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{a.risk_level} Risk</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alert Decision Inspector (2 Cols) */}
          <div className="lg:col-span-2">
            {selectedAlert ? (
              <GlassCard
                title={`Lead Verification Dossier: ${selectedAlert.alert_code}`}
                subtitle={`Generated from Case ${selectedAlert.complaint_id || 'CT-2026-001'}`}
                icon={AlertTriangle}
                action={<StatusBadge status={selectedAlert.review_status} />}
              >
                <div className="space-y-6">
                  {/* Lead Zone Summary */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/70 dark:border-slate-800 space-y-2">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                      Forecast Target Location
                    </div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{selectedAlert.candidate_zone}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Time Window:</span>
                        <div className="text-slate-800 dark:text-slate-200 mt-0.5 font-semibold">{selectedAlert.time_window}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Assigned Officer:</span>
                        <div className="text-cyan-700 dark:text-cyan-300 font-bold mt-0.5">
                          {selectedAlert.assigned_officer_name || 'Unassigned'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Risk Assessment:</span>
                        <div className="text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                          {selectedAlert.risk_level} Priority
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Officer Decision Stepper & Actions */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/50 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                      Statutory Review Actions (Officer Decision)
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleUpdateStatus(selectedAlert.id, 'Verified Lead')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm dark:shadow-glow-emerald transition flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Verify Lead (Dispatch Alert)</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedAlert.id, 'Dismissed')}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 border border-slate-300 hover:border-rose-300 dark:bg-slate-800 dark:hover:bg-rose-950 dark:hover:text-rose-300 dark:text-slate-300 dark:border-slate-700 dark:hover:border-rose-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dismiss Lead (False Positive)</span>
                      </button>

                      <button
                        onClick={() => handleUpdateStatus(selectedAlert.id, 'Action Taken')}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm dark:shadow-glow-cyan transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Action Completed</span>
                      </button>
                    </div>
                  </div>

                  {/* Decision Remarks Log & Append Form */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
                      Officer Audit Notes & Decision Log
                    </span>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/70 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 leading-relaxed min-h-[60px]">
                      {selectedAlert.decision_notes || 'No decision remarks recorded yet.'}
                    </div>

                    <form onSubmit={handleAddNote} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Append official log note with timestamp..."
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-600 font-mono shadow-xs dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Append</span>
                      </button>
                    </form>
                  </div>
                </div>
              </GlassCard>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
