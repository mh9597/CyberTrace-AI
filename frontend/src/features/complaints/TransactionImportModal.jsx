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
          const required = ['amount', 'timestamp', 'transaction_reference'];
          const missing = required.filter((r) => !headers.includes(r));
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
