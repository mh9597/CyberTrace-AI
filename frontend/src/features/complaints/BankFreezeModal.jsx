import React, { useState } from 'react';
import { X, Copy, Check, Download, ShieldCheck, Landmark, FileText, AlertOctagon } from 'lucide-react';
import api from '../../services/api';

export default function BankFreezeModal({ complaintId, isOpen, onClose }) {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setNotice(null);
      setCopied(false);
      return;
    }

    async function generateNotice() {
      setLoading(true);
      try {
        const res = await api.post(`/complaints/${complaintId}/freeze-notice`);
        setNotice(res.data);
      } catch (err) {
        console.error('Failed to generate freeze notice:', err);
      } finally {
        setLoading(false);
      }
    }

    generateNotice();
  }, [isOpen, complaintId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (notice?.formatted_notice_text) {
      navigator.clipboard.writeText(notice.formatted_notice_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (!notice) return;

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
          <title>Statutory Freeze Notice - ${notice.notice_id}</title>
          <style>
            @page { size: A4; margin: 12mm 15mm; }
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 11px;
              line-height: 1.4;
            }
            .banner {
              text-align: center;
              border: 1.5px solid #0f172a;
              background-color: #f8fafc;
              padding: 10px;
              border-radius: 6px;
              margin-bottom: 14px;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-bottom: 14px;
            }
            .card {
              border: 1px solid #cbd5e1;
              background: #f8fafc;
              padding: 8px;
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
            pre {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 10px;
              line-height: 1.4;
              white-space: pre-wrap;
              word-break: break-all;
              background: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 12px;
              border-radius: 6px;
              margin: 4px 0 14px 0;
            }
            .footer {
              border-top: 1px solid #94a3b8;
              padding-top: 6px;
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
            <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #b91c1c;">
              Statutory Law Enforcement Notice &bull; Immediate Compliance Required
            </div>
            <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 3px 0;">
              Account Freeze Advisory (Section 94 BNSS / Section 91 CrPC)
            </div>
            <div style="font-size: 9px; color: #64748b; font-family: monospace;">
              Notice ID: ${notice.notice_id} &bull; Case: ${complaintId || ''}
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="label">Target Institution</div>
              <div class="val">${notice.target_bank?.bank_name || 'N/A'}</div>
              <div style="font-size: 9px; color: #0284c7; font-family: monospace;">${notice.target_bank?.nodal_email || ''}</div>
            </div>
            <div class="card">
              <div class="label">Mule Account to Freeze</div>
              <div class="val" style="color: #b91c1c; font-family: monospace;">${notice.mule_target?.account_number || 'N/A'}</div>
              <div style="font-size: 9.5px; color: #475569;">Amount: Rs.${(notice.mule_target?.freeze_amount || 0).toLocaleString()}</div>
            </div>
            <div class="card">
              <div class="label">Cryptographic Digital Seal</div>
              <div class="val" style="color: #047857;">NIST SHA-256 Valid</div>
              <div style="font-size: 8.5px; color: #64748b; font-family: monospace; word-break: break-all;">${notice.sha256_digital_seal || ''}</div>
            </div>
          </div>

          <div style="font-weight: bold; font-size: 10px; text-transform: uppercase; font-family: monospace; margin-bottom: 2px;">
            Statutory Legal Text Payload
          </div>
          <pre>${notice.formatted_notice_text || ''}</pre>

          <div class="footer">
            <span>Cybercrime Command Centre &bull; High-Velocity Interception</span>
            <span style="color: #047857; font-weight: bold;">Legally Binding &bull; Verified Digital Seal</span>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Statutory Account Freeze Advisory</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 font-bold border border-rose-700/50">
                  SECTION 94 BNSS / 91 CrPC
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official Law Enforcement Direct Notice to Bank Nodal Fraud Desk
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-mono">
                Compiling statutory freeze order & cryptographic digital seal...
              </p>
            </div>
          ) : notice ? (
            <>
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Target Institution</div>
                  <div className="text-xs font-bold text-white">{notice.target_bank.bank_name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono truncate">{notice.target_bank.nodal_email}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Mule Account to Freeze</div>
                  <div className="text-xs font-mono font-bold text-rose-400">{notice.mule_target.account_number}</div>
                  <div className="text-[11px] text-slate-300">Amount: ₹{notice.mule_target.freeze_amount.toLocaleString()}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Cryptographic Seal</div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>NIST SHA-256 Valid</span>
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono truncate">
                    {notice.sha256_digital_seal}
                  </div>
                </div>
              </div>

              {/* Formatted Legal Notice Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">Statutory Legal Text Payload</span>
                  <span className="text-[11px] font-mono text-slate-500">Notice ID: {notice.notice_id}</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all max-h-64 overflow-y-auto">
                  {notice.formatted_notice_text}
                </pre>
              </div>

              {/* Compliance Disclaimer */}
              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <strong>Statutory Notice:</strong> Generated under regulatory inter-agency frameworks. Transmit immediately via verified CFCFRMS portal or authenticated LEA email to freeze debit facilities.
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs text-rose-400">
              Failed to load freeze advisory.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Direct Nodal Dispatch Protocol &bull; CyberTrace AI
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!notice}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={!notice}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
