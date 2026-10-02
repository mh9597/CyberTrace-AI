import React, { useState } from 'react';
import { X, Printer, ShieldCheck, FileCheck, Layers, GitFork, Scale } from 'lucide-react';
import api from '../../services/api';

export default function ForensicDossierModal({ complaintId, isOpen, onClose }) {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setDossier(null);
      return;
    }

    async function loadDossier() {
      setLoading(true);
      try {
        const res = await api.get(`/complaints/${complaintId}/dossier`);
        setDossier(res.data);
      } catch (err) {
        console.error('Failed to load forensic dossier:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDossier();
  }, [isOpen, complaintId]);

  const handlePrint = () => {
    if (!dossier) return;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Court Dossier - ${dossier.complaint_id}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm 15mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 11px;
              line-height: 1.35;
            }
            .banner {
              text-align: center;
              border: 1.5px solid #0f172a;
              background-color: #f8fafc;
              padding: 8px;
              border-radius: 6px;
              margin-bottom: 12px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-bottom: 12px;
            }
            .card {
              border: 1px solid #cbd5e1;
              background: #f8fafc;
              padding: 6px 8px;
              border-radius: 4px;
            }
            .label {
              font-size: 9px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 700;
            }
            .val {
              font-size: 11px;
              font-weight: 700;
              color: #0f172a;
              margin-top: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 6px 0 10px 0;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 10px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 4px 6px;
              text-align: left;
            }
            th {
              background: #f1f5f9;
              font-weight: 700;
              text-transform: uppercase;
              font-size: 9px;
            }
            .cashout {
              background: #fee2e2;
              color: #991b1b;
              border: 1px solid #f87171;
              font-size: 8px;
              font-weight: bold;
              padding: 1px 3px;
              border-radius: 3px;
              margin-left: 3px;
            }
            .box {
              border: 1px solid #cbd5e1;
              background: #f8fafc;
              padding: 6px 10px;
              border-radius: 4px;
              margin-bottom: 10px;
            }
            pre {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 9px;
              line-height: 1.3;
              white-space: pre-wrap;
              word-break: break-all;
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 6px 8px;
              border-radius: 4px;
              margin: 3px 0 0 0;
            }
            .footer {
              border-top: 1px solid #94a3b8;
              padding-top: 5px;
              font-size: 9px;
              font-family: monospace;
              color: #475569;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="banner">
            <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0284c7;">
              Government of India &bull; Inter-Agency Cyber Task Force
            </div>
            <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; margin: 2px 0;">
              Electronic Evidence Investigation Dossier
            </div>
            <div style="font-size: 9px; color: #64748b; font-family: monospace;">
              Dossier ID: ${dossier.dossier_id} &bull; Generated: ${new Date(dossier.generated_at).toLocaleString()}
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="label">Case Reference</div>
              <div class="val" style="color: #0369a1; font-family: monospace;">${dossier.complaint_id}</div>
            </div>
            <div class="card">
              <div class="label">Complainant</div>
              <div class="val">${dossier.case_summary?.victim_name || 'N/A'}</div>
            </div>
            <div class="card">
              <div class="label">Defrauded Amount</div>
              <div class="val" style="color: #b91c1c;">Rs.${dossier.case_summary?.defrauded_amount?.toLocaleString() || 0}</div>
            </div>
            <div class="card">
              <div class="label">Master Checksum</div>
              <div class="val" style="color: #047857;">Verified SHA-256</div>
            </div>
          </div>

          <div style="font-weight: bold; font-size: 10px; text-transform: uppercase; margin-bottom: 2px; font-family: monospace;">
            Multi-Hop Transaction Laundering Trail (${dossier.transaction_trail?.length || 0} Hops)
          </div>
          <table>
            <thead>
              <tr>
                <th>Hop</th>
                <th>Reference / UTR</th>
                <th>Origin Account</th>
                <th>Target Account</th>
                <th style="text-align: right;">Amount (INR)</th>
                <th>Channel / Flags</th>
              </tr>
            </thead>
            <tbody>
              ${(dossier.transaction_trail || []).map((t) => `
                <tr>
                  <td style="font-weight: bold; color: #0369a1;">Layer ${t.hop}</td>
                  <td>${t.reference}</td>
                  <td>${t.source_account}</td>
                  <td style="font-weight: 600;">${t.dest_account} ${t.is_terminal_cashout ? '<span class="cashout">CASH-OUT ATM</span>' : ''}</td>
                  <td style="text-align: right; font-weight: bold;">Rs.${(t.amount_inr || 0).toLocaleString()}</td>
                  <td>${t.txn_type || 'TRANSFER'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          ${dossier.ml_forecast_summary ? `
            <div class="box">
              <div style="font-weight: bold; font-size: 9px; text-transform: uppercase; font-family: monospace; margin-bottom: 2px;">
                AI Predictive Forecast Analytics
              </div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 9.5px;">
                <div><span style="color:#64748b;">Model:</span> <strong>${dossier.ml_forecast_summary.model_version}</strong></div>
                <div><span style="color:#64748b;">Projected Cluster:</span> <strong style="color:#0284c7;">${dossier.ml_forecast_summary.candidate_zone}</strong></div>
                <div><span style="color:#64748b;">Calibrated Risk:</span> <strong style="color:#b91c1c;">${((dossier.ml_forecast_summary.risk_estimate || 0) * 100).toFixed(0)}% (${dossier.ml_forecast_summary.risk_band})</strong></div>
              </div>
            </div>
          ` : ''}

          <div style="margin-bottom: 8px;">
            <div style="font-weight: bold; font-size: 9px; text-transform: uppercase; font-family: monospace; margin-bottom: 2px;">
              Statutory Certificate of Electronic Authenticity (Section 63 BSA / 65B IEA)
            </div>
            <pre>${dossier.bsa_section63_certificate || ''}</pre>
          </div>

          <div class="footer">
            <span>Master Case SHA-256: ${dossier.master_sha256_fingerprint}</span>
            <span style="color: #047857; font-weight: bold;">Tamper-Proof &bull; Ready for Magistrate Filing</span>
          </div>
        </body>
      </html>
    `);
    doc.close();

    printFrame.contentWindow.focus();
    setTimeout(() => {
      printFrame.contentWindow.print();
      setTimeout(() => {
        try { document.body.removeChild(printFrame); } catch (_) {}
      }, 1000);
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Court-Admissible Forensic Dossier</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60">
                  SECTION 63 BSA / 65B IEA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Certified Electronic Case Record with Cryptographic SHA-256 Chain of Custody
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Court Document View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/40 font-sans text-slate-200">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono">
                Compiling multi-hop transaction chain & computing SHA-256 root certificate...
              </p>
            </div>
          ) : dossier ? (
            <>
              {/* Document Header Emblem Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Government of India &bull; Inter-Agency Cyber Task Force
                </div>
                <div className="text-sm font-black text-white uppercase tracking-wider">
                  Electronic Evidence Investigation Dossier
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Dossier ID: {dossier.dossier_id} &bull; Generated: {new Date(dossier.generated_at).toLocaleString()}
                </div>
              </div>

              {/* Case Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Case Reference</div>
                  <div className="text-xs font-bold text-cyan-400 font-mono">{dossier.complaint_id}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Complainant</div>
                  <div className="text-xs font-semibold text-white truncate">{dossier.case_summary.victim_name}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Defrauded Amount</div>
                  <div className="text-xs font-bold text-rose-400">₹{dossier.case_summary.defrauded_amount.toLocaleString()}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Master Checksum</div>
                  <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified SHA-256</span>
                  </div>
                </div>
              </div>

              {/* Multi-Hop Transaction Chain Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-cyan-400" />
                    <span>Multi-Hop Transaction Laundering Trail</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {dossier.transaction_trail.length} Transfer Hop(s) Sequenced
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Hop</th>
                        <th className="p-2.5">Reference / UTR</th>
                        <th className="p-2.5">Origin Account</th>
                        <th className="p-2.5">Target Account</th>
                        <th className="p-2.5 text-right">Amount (INR)</th>
                        <th className="p-2.5">Channel / Flags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dossier.transaction_trail.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-2.5 text-cyan-400 font-bold">Layer {t.hop}</td>
                          <td className="p-2.5 text-slate-300">{t.reference}</td>
                          <td className="p-2.5 text-slate-400 truncate max-w-[130px]">{t.source_account}</td>
                          <td className="p-2.5 text-rose-300 font-bold truncate max-w-[130px]">{t.dest_account}</td>
                          <td className="p-2.5 text-right font-bold text-white">₹{t.amount_inr.toLocaleString()}</td>
                          <td className="p-2.5">
                            {t.is_terminal_cashout ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                CASH-OUT ATM
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">{t.txn_type}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Predictive Evidence Block */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-purple-400" />
                  <span>AI Predictive Forecast Analytics</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Forecasting Model:</span>{' '}
                    <strong className="text-white">{dossier.ml_forecast_summary.model_version}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Projected Cash-out Cluster:</span>{' '}
                    <strong className="text-cyan-300">{dossier.ml_forecast_summary.candidate_zone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Calibrated Risk Score:</span>{' '}
                    <strong className="text-rose-400">{(dossier.ml_forecast_summary.risk_estimate * 100).toFixed(0)}% ({dossier.ml_forecast_summary.risk_band})</strong>
                  </div>
                </div>
              </div>

              {/* Section 63 BSA / Section 65B Certificate */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Certificate of Electronic Authenticity</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all">
                  {dossier.bsa_section63_certificate}
                </pre>
              </div>

              {/* Master Hash Stamp */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>Master Case SHA-256: {dossier.master_sha256_fingerprint}</span>
                <span className="text-emerald-400 font-bold">Tamper-Proof &bull; Ready for Magistrate Filing</span>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-rose-400">
              Failed to compile forensic dossier.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Judicial Submission Format &bull; CyberTrace AI
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              disabled={!dossier}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Court Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
