import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  BrainCircuit,
  GitFork,
  ArrowLeft,
  Clock,
  ShieldAlert,
  Layers,
  MapPin,
  CheckCircle2,
  Landmark,
  Scale,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import GoldenHourTimer from '../features/complaints/GoldenHourTimer';
import BankFreezeModal from '../features/complaints/BankFreezeModal';
import ForensicDossierModal from '../features/complaints/ForensicDossierModal';
import TransactionImportModal from '../features/complaints/TransactionImportModal';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const loadCase = async () => {
    try {
      setLoading(true);
      const [compRes, txnsRes] = await Promise.all([
        api.get(`/complaints/${id}`),
        api.get(`/complaints/${id}/transactions`),
      ]);
      setComplaint(compRes.data);
      setTransactions(txnsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24 text-slate-400 font-mono text-xs">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
        Loading case dossier #{id}...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-24 text-rose-400 font-mono text-xs">
        Case record #{id} not found in repository.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/complaints')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-300 transition group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
        <span>Back to Case Repository</span>
      </button>

      {/* Case Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-sky-50 border border-slate-200/90 shadow-sm dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 dark:border-slate-800 dark:shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="font-mono text-2xl font-black text-cyan-800 dark:text-cyan-400 tracking-tight">
              {complaint.complaint_id}
            </span>
            <StatusBadge status={complaint.status} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/50">
              SYNTHETIC INVESTIGATION
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{complaint.fraud_type}</span>
            <span>&bull;</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
              ₹{complaint.amount?.toLocaleString('en-IN')}
            </span>
            <span>&bull;</span>
            <span className="font-mono text-slate-500 dark:text-slate-400">
              Reported: {new Date(complaint.reported_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 transition flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Import Ledger</span>
          </button>

          <button
            onClick={() => setFreezeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Sec 94 Freeze Notice</span>
          </button>

          <button
            onClick={() => setDossierModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Sec 63 Court Dossier</span>
          </button>

          <button
            onClick={() => navigate(`/predictions?caseId=${complaint.complaint_id}`)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm dark:shadow-glow-cyan transition flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Forecast Cash-out</span>
          </button>

          <button
            onClick={() => navigate(`/network?caseId=${complaint.complaint_id}`)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Trace Network</span>
          </button>
        </div>
      </div>

      {/* Pillar 1: Golden Hour SLA Countdown Tracker */}
      <GoldenHourTimer
        complaintId={complaint.complaint_id}
        onOpenFreezeModal={() => setFreezeModalOpen(true)}
      />

      {/* Case Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="p-4" hoverGlow="none">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider font-semibold">
            Complainant Profile
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{complaint.victim_name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {complaint.victim_phone || 'Masked under privacy policy'}
          </div>
        </GlassCard>

        <GlassCard className="p-4" hoverGlow="none">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider font-semibold">
            Initial Transaction Reference
          </div>
          <div className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 mt-1">
            {complaint.transaction_reference || 'N/A'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Hash Digest: Verified
          </div>
        </GlassCard>

        <GlassCard className="p-4" hoverGlow="none">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-mono tracking-wider font-semibold">
            Investigator Notes
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {complaint.notes || 'No investigative remarks documented yet.'}
          </div>
        </GlassCard>
      </div>

      {/* Associated Multi-Hop Transaction Trail */}
      <GlassCard
        title={`Correlated Transaction Trail (${transactions.length} hops)`}
        subtitle="Multi-hop transaction sequence linked by authorized identifiers"
        icon={Layers}
        action={
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
            {transactions.filter((t) => t.is_cash_out).length} cash-out withdrawal(s) observed
          </span>
        }
      >
        {transactions.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-300 dark:bg-slate-950/60 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">No transaction records imported yet.</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Upload a synthetic banking or wallet ledger to trace multi-hop fund flows.
            </p>
            <button
              onClick={() => setImportModalOpen(true)}
              className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Transaction CSV</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 dark:bg-slate-950/70 dark:text-slate-400 dark:border-slate-800/80">
                <tr>
                  <th className="py-3 px-6">Hop Level</th>
                  <th className="py-3 px-4">Tx Reference</th>
                  <th className="py-3 px-4">Source Account</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-6 text-right">Detection Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50 font-mono text-[11px]">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-cyan-700 dark:text-cyan-400">Hop L{t.hop_level}</td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{t.txn_reference}</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{t.source_account}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-200">
                      {t.dest_account}
                      {t.is_cash_out && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-rose-100 text-rose-800 border border-rose-300 font-bold dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800/60">
                          ATM CASH-OUT
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 dark:text-white font-bold">
                      ₹{t.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(t.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{t.txn_type}</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-amber-800 border border-slate-200 dark:bg-slate-800/80 text-[10px] dark:text-amber-300 dark:border-slate-700/60 font-semibold">
                        {t.suspicious_flags}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* CSV/JSON Transaction Import Modal */}
      <TransactionImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        complaintId={complaint.complaint_id}
        onImportSuccess={loadCase}
      />

      {/* Bank Freeze Notice Modal */}
      <BankFreezeModal
        complaintId={complaint.complaint_id}
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
      />

      {/* Court Dossier Modal */}
      <ForensicDossierModal
        complaintId={complaint.complaint_id}
        isOpen={dossierModalOpen}
        onClose={() => setDossierModalOpen(false)}
      />
    </div>
  );
}
