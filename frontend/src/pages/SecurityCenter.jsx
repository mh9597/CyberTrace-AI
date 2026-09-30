import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  UserCheck,
  Activity,
  Key,
  RefreshCw,
  CheckCircle2,
  Database,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';

export default function SecurityCenter() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.get('/security/audit-logs');
        setLogs(res.data.logs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const handleVerifyEvidence = async () => {
    setVerifying(true);
    try {
      const res = await api.get('/security/evidence/1/integrity');
      setVerificationResult(res.data);
    } catch (e) {
      alert('Verification query failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Lock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          <span>Security Center & Cryptographic Audit Vault</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          Role-based access enforcement, SHA-256 evidence integrity validation, and immutable access logs.
        </p>
      </div>

      {/* RBAC Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <GlassCard className="p-5" hoverGlow="indigo">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase">
              Admin Role
            </span>
            <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
            Full administrative authority. Manages investigator accounts, models, system configuration, and audit archives.
          </p>
          <div className="mt-3 text-[10px] font-mono text-slate-500">
            Least-Privilege Enforcement: ACTIVE
          </div>
        </GlassCard>

        <GlassCard className="p-5" hoverGlow="cyan">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 uppercase">
              Investigator Role
            </span>
            <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
            Case ingestion, transaction import, execution of ML prediction pipelines, and alert reviews.
          </p>
          <div className="mt-3 text-[10px] font-mono text-slate-500">
            Scoped Access Boundary: POLICE_UNIT
          </div>
        </GlassCard>

        <GlassCard className="p-5" hoverGlow="emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              Senior Officer Role
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-medium">
            Cross-jurisdiction intelligence authorization, alert dismissals, patrol deployment verification.
          </p>
          <div className="mt-3 text-[10px] font-mono text-slate-500">
            Authorization Level: TIER_1_SUPERVISOR
          </div>
        </GlassCard>
      </div>

      {/* Cryptographic SHA-256 Evidence Integrity Verification */}
      <GlassCard
        title="Evidence Cryptographic Integrity Verification (SHA-256)"
        subtitle="Bitwise cryptographic validation comparing recorded ledger digests against on-disk evidence payloads"
        icon={ShieldCheck}
        action={
          <button
            onClick={handleVerifyEvidence}
            disabled={verifying}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm dark:shadow-glow-cyan transition flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Computing Hash...' : 'Verify Evidence Hash'}</span>
          </button>
        }
      >
        {verificationResult ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">File Identifier:</span>
              <span className="text-slate-900 dark:text-white font-bold">{verificationResult.filename}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Stored SHA-256 Digest:</span>
              <span className="text-cyan-800 dark:text-cyan-300 font-bold truncate max-w-sm">{verificationResult.stored_hash}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Recomputed Bitwise Digest:</span>
              <span className="text-cyan-800 dark:text-cyan-300 font-bold truncate max-w-sm">{verificationResult.calculated_hash}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Integrity Assessment:</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  verificationResult.status === 'VERIFIED_INTACT'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{verificationResult.status}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
            <Database className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Evidence Vault Ready</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Click "Verify Evidence Hash" to test bitwise match of case evidence files against stored digests.
            </p>
          </div>
        )}
      </GlassCard>

      {/* Immutable Audit Log Table */}
      <GlassCard
        title="Tamper-Evident Access & Decision Audit Log"
        subtitle="Append-only record of officer actions, evidence access, and algorithmic executions"
        icon={Activity}
      >
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200 dark:bg-slate-950/70 dark:text-slate-400 dark:border-slate-800">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-4">Officer / Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Record</th>
                <th className="py-3 px-6 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-6 text-slate-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-cyan-700 dark:text-cyan-300 font-bold">{log.actor}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{log.action}</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{log.target}</td>
                  <td className="py-3 px-6 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800/50 font-bold">
                      {log.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
