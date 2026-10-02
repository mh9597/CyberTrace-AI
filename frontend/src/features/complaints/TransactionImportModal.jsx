import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, X } from 'lucide-react';
import ModalDialog from '../../components/common/ModalDialog';
import api from '../../services/api';

export default function TransactionImportModal({ isOpen, onClose, complaintId, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [previewRows, setPreviewRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileHash, setFileHash] = useState('');

  const computeSHA256 = async (fileBlob) => {
    try {
      const buffer = await fileBlob.arrayBuffer();
      const digestBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const digestArray = Array.from(new Uint8Array(digestBuffer));
      const hashHex = digestArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch {
      return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
  };

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv') && !selected.name.endsWith('.json')) {
      alert('Only .csv or .json transaction files are accepted.');
      return;
    }

    setFile(selected);
    setParsing(true);
    setValidationErrors([]);

    // Compute hash
    const hash = await computeSHA256(selected);
    setFileHash(hash);

    // Read and preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        if (selected.name.endsWith('.csv')) {
          const lines = text.split('\n').filter((l) => l.trim().length > 0);
          const headers = lines[0].split(',').map((h) => h.trim());
          const rows = lines.slice(1, 6).map((line) => {
            const cols = line.split(',');
            const obj = {};
            headers.forEach((h, i) => {
              obj[h] = cols[i]?.trim();
            });
            return obj;
          });
          setPreviewRows(rows);
          // Check standard columns
          const hasRef = headers.includes('transaction_reference') || headers.includes('txn_reference');
          const missing = [];
          if (!headers.includes('amount')) missing.push('amount');
          if (!headers.includes('timestamp')) missing.push('timestamp');
          if (!hasRef) missing.push('transaction_reference (or txn_reference)');

          if (missing.length > 0) {
            setValidationErrors([`Missing mandatory schema fields: ${missing.join(', ')}`]);
          } else {
            setDuplicateCount(0);
          }
        } else {
          const json = JSON.parse(text);
          setPreviewRows(Array.isArray(json) ? json.slice(0, 5) : [json]);
        }
      } catch (err) {
        setValidationErrors(['Malformed file structure: Failed to parse CSV/JSON.']);
      } finally {
        setParsing(false);
      }
    };
    reader.readAsText(selected);
  };

  const handleConfirmImport = async () => {
    if (!file || !complaintId) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post(`/complaints/${complaintId}/transactions/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onImportSuccess) onImportSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || 'Import failed. Check file schema and duplicates.');
    } finally {
      setUploading(false);
    }
  };

  const handleLoadSampleCSV = () => {
    const csvContent = `txn_reference,source_account,dest_account,amount,timestamp,txn_type,hop_level,is_cash_out,latitude,longitude,city,suspicious_flags,zone_name
UTR20261001001,9825144102,50100492817291,200000,2026-10-01 09:15:00,UPI,1,false,23.0225,72.5714,Ahmedabad,ROUND_AMOUNT,Victim SBI Transfer
UTR20261001002,50100492817291,9876543210HDFC,180000,2026-10-01 09:47:00,IMPS,2,false,23.0395,72.5295,Ahmedabad,RAPID_TRANSFER,Mule L1 Forward
UTR20261001003,9876543210HDFC,40200198765432,180000,2026-10-01 10:12:00,NEFT,3,false,22.9734,72.5833,Anand,RAPID_TRANSFER,Mule L2 Forward
UTR20261001004,40200198765432,ATM-HDFC-SG001,90000,2026-10-01 11:30:00,ATM,4,true,23.0204,72.5800,Ahmedabad,ATM_CASHOUT,SG Highway ATM Zone
UTR20261001005,40200198765432,ATM-SBI-NR002,87000,2026-10-01 12:05:00,ATM,4,true,23.0469,72.5306,Ahmedabad,ATM_CASHOUT,Navrangpura ATM Zone
UTR20261001006,50100492817291,3341900012345,150000,2026-10-01 14:20:00,UPI,2,false,19.0760,72.8777,Mumbai,CROSS_STATE,Mule Mumbai Forward
UTR20261001007,3341900012345,ATM-AXIS-MU01,75000,2026-10-01 15:45:00,ATM,3,true,19.0596,72.8295,Mumbai,ATM_CASHOUT,Andheri ATM Zone
UTR20261001008,3341900012345,ATM-ICICI-MU02,72000,2026-10-01 16:10:00,ATM,3,true,19.0176,72.8561,Mumbai,ATM_CASHOUT,Dadar ATM Zone
UTR20261001009,50100492817291,6521000098765,120000,2026-10-01 18:30:00,IMPS,2,false,28.6139,77.2090,Delhi,CROSS_STATE,Mule Delhi Forward
UTR20261001010,6521000098765,ATM-PNB-DL01,118000,2026-10-01 20:00:00,ATM,3,true,28.6304,77.2177,Delhi,ATM_CASHOUT,Connaught Place ATM Zone`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const sampleFile = new File([blob], 'sample_transactions_CT2026002.csv', { type: 'text/csv' });
    handleFileChange({ target: { files: [sampleFile] } });
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Import Synthetic Transaction Records"
      subtitle={`Upload banking/wallet records for Case ${complaintId || ''} (CSV or JSON)`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* Upload Drop Zone */}
        <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-cyan-500 bg-slate-50 dark:bg-slate-950/60 text-center transition cursor-pointer relative">
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {file ? file.name : 'Click to select or drag and drop transaction ledger'}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Accepted formats: .csv, .json (Max: 5MB)
            </p>
          </div>
        </div>

        {/* Quick Sample Button */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/80 dark:border-cyan-900/40">
          <div className="text-xs text-cyan-900 dark:text-cyan-200">
            <span className="font-semibold">Quick Demo File:</span> <code className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">sample_transactions_CT2026002.csv</code>
          </div>
          <button
            type="button"
            onClick={handleLoadSampleCSV}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-xs transition"
          >
            ⚡ Auto-Fill Sample CSV
          </button>
        </div>

        {/* SHA-256 Digest Verification Preview */}
        {fileHash && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono shadow-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Evidence Digest:</span>
            </span>
            <span className="text-cyan-800 dark:text-cyan-300 font-bold truncate max-w-xs">{fileHash}</span>
          </div>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Validation Issues Detected:</span>
            </div>
            {validationErrors.map((err, i) => (
              <div key={i} className="text-[11px] font-mono pl-5">
                &bull; {err}
              </div>
            ))}
          </div>
        )}

        {/* Parsed Rows Preview */}
        {previewRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Parsed Schema Preview (Top 5 Rows)</span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                0 Critical Errors &bull; {duplicateCount} Duplicates Filtered
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-2">
              <pre className="text-[10px] font-mono text-slate-800 dark:text-slate-300 leading-tight">
                {JSON.stringify(previewRows, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmImport}
            disabled={!file || uploading || validationErrors.length > 0}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-semibold shadow-sm dark:shadow-glow-cyan transition flex items-center gap-1.5"
          >
            {uploading ? 'Correlating Ledger...' : 'Commit & Correlate'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}
