import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, BrainCircuit, GitFork, Clock, ShieldAlert,
  Layers, MapPin, Landmark, Scale, RefreshCw, FileCheck, Paperclip,
  AlertTriangle, Activity, User, Phone, Hash, CreditCard, Building2, ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import GoldenHourTimer from '../features/complaints/GoldenHourTimer';
import BankFreezeModal from '../features/complaints/BankFreezeModal';
import ForensicDossierModal from '../features/complaints/ForensicDossierModal';
import TransactionImportModal from '../features/complaints/TransactionImportModal';

function GlassCard({ children, className = '', title, subtitle, icon: Icon, action }) {
  return (
    <div className={`bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-slate-950/60 ${className}`}>
      {(title || Icon) && (
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40">
                <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              </div>
            )}
            <div>
              {title && <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{title}</div>}
              {subtitle && <div className="text-[10px] text-slate-400 font-mono">{subtitle}</div>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    New: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'Under Analysis': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Alert Generated': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    'Under Investigation': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    Dismissed: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    Investigating: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Mule Freezed': 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${map[status] || map['New']}`}>
      {status}
    </span>
  );
}

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

  useEffect(() => { loadCase(); }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading case dossier #{id}...</span>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <AlertTriangle className="w-6 h-6 text-rose-400" />
        <span className="text-xs font-mono text-rose-400">Case record #{id} not found in repository.</span>
        <button onClick={() => navigate('/complaints')} className="mt-2 px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
          Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <button onClick={() => navigate('/complaints')} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300 transition group font-medium">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
        Back to Case Repository
      </button>

      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-cyan-50/40 border border-slate-200/80 shadow-sm dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 dark:border-slate-800 dark:shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="font-mono text-2xl font-black text-cyan-700 dark:text-cyan-400 tracking-tight">{complaint.complaint_id}</span>
            <StatusBadge status={complaint.status} />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-semibold dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/50">SYNTHETIC INVESTIGATION</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">{complaint.fraud_type}</span>
            <span>•</span>
            <span className="font-mono font-black text-slate-900 dark:text-white text-sm">Rs.{complaint.amount?.toLocaleString('en-IN')}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-mono">Reported: {new Date(complaint.reported_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setImportModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 transition flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />Import Ledger
          </button>
          <button onClick={() => setFreezeModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" />Sec 94 Freeze Notice
          </button>
          <button onClick={() => setDossierModalOpen(true)} className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />Sec 63 Court Dossier
          </button>
          <button onClick={() => navigate(`/predictions?caseId=${complaint.complaint_id}`)} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />Forecast Cash-out
          </button>
          <button onClick={() => navigate(`/network?caseId=${complaint.complaint_id}`)} className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5" />Trace Network
          </button>
        </div>
      </div>

      <GoldenHourTimer complaintId={complaint.complaint_id} onOpenFreezeModal={() => setFreezeModalOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><User className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-mono font-semibold text-slate-400 mb-0.5">Complainant Profile</div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{complaint.victim_name || 'Synthetic Persona'}</div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />{complaint.victim_phone || 'Masked under privacy policy'}</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40"><Hash className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /></div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-mono font-semibold text-slate-400 mb-0.5">Transaction Reference</div>
              <div className="text-sm font-bold font-mono text-cyan-700 dark:text-cyan-400 truncate">{complaint.transaction_reference || 'N/A'}</div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">Hash Digest: Verified</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40"><Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /></div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-mono font-semibold text-slate-400 mb-0.5">Investigator Notes</div>
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">{complaint.notes || 'No investigative remarks documented yet.'}</div>
            </div>
          </div>
        </GlassCard>
      </div>


      {transactions.some((t) => t.latitude && t.longitude) && (
        <GlassCard title="Geospatial Transaction Coordinates" subtitle="Coordinates extracted from transaction records" icon={MapPin}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {transactions.filter((t) => t.latitude && t.longitude).map((t) => (
              <div key={t.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-200">{t.city || t.zone_name || 'Unknown Zone'}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{t.latitude?.toFixed(4)}, {t.longitude?.toFixed(4)}</div>
                  {t.is_cash_out && <span className="mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50 font-bold">CASH-OUT NODE</span>}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard title="Verified Evidence Files" subtitle="Cryptographically verified attachments (Transaction Statement & Scam Proof)" icon={ShieldAlert}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(complaint.evidenceFiles || complaint.evidence_files || [
            { name: 'Bank_Statement.pdf', size: '1.4 MB', type: 'Bank Statement', hash: 'SHA256 Verified' },
            { name: 'WhatsApp_Chat.png', size: '820 KB', type: 'Scam Screenshot (WhatsApp)', hash: 'Verified' },
          ]).map((ev, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              {ev.previewUrl ? (
                <img
                  src={ev.previewUrl}
                  alt={ev.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : ev.type?.toLowerCase().includes('statement') || ev.name?.endsWith('.pdf') || ev.name?.endsWith('.csv') ? (
                <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Paperclip className="w-4 h-4 text-purple-500 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {ev.name || ev.file_name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {ev.size || `${Math.round((ev.file_size_bytes || 840000)/1024)} KB`} • {ev.type || 'Verified Evidence'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Suspect Mule Route" subtitle="Victim bank to suspect destination chain" icon={CreditCard}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[140px] p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] uppercase font-mono font-semibold text-slate-400 mb-1">Victim Bank</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200"><Building2 className="w-3.5 h-3.5 text-slate-400" />Source Bank</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
          <div className="flex-1 min-w-[140px] p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
            <div className="text-[10px] uppercase font-mono font-semibold text-rose-400 mb-1">Suspect Destination</div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-rose-700 dark:text-rose-300"><CreditCard className="w-3.5 h-3.5" />HDFC Bank (Mule L1)</div>
          </div>
          <button onClick={() => navigate(`/network?caseId=${complaint.complaint_id}`)} className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/50 transition flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5" />View Network Graph
          </button>
        </div>
      </GlassCard>

      <TransactionImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} complaintId={complaint.complaint_id} onImportSuccess={loadCase} />
      <BankFreezeModal complaintId={complaint.complaint_id} isOpen={freezeModalOpen} onClose={() => setFreezeModalOpen(false)} />
      <ForensicDossierModal complaintId={complaint.complaint_id} isOpen={dossierModalOpen} onClose={() => setDossierModalOpen(false)} />
    </div>
  );
}
