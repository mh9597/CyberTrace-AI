import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Upload,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import ModalDialog from '../components/common/ModalDialog';
import TransactionImportModal from '../features/complaints/TransactionImportModal';

export default function Complaints() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [importModalCase, setImportModalCase] = useState(null);

  // New Complaint Form State
  const [formData, setFormData] = useState({
    complaint_id: `CT-2026-${Math.floor(100 + Math.random() * 900)}`,
    victim_name: '',
    victim_phone: '',
    fraud_type: 'UPI/payment fraud',
    amount: '',
    transaction_reference: '',
    notes: '',
  });

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/complaints', { params });
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadComplaints();
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setShowModal(false);
      setFormData({
        complaint_id: `CT-2026-${Math.floor(100 + Math.random() * 900)}`,
        victim_name: '',
        victim_phone: '',
        fraud_type: 'UPI/payment fraud',
        amount: '',
        transaction_reference: '',
        notes: '',
      });
      loadComplaints();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to register complaint');
    }
  };

  const statusOptions = [
    { label: 'All Cases', value: '' },
    { label: 'New', value: 'New' },
    { label: 'Under Analysis', value: 'Under Analysis' },
    { label: 'Alert Generated', value: 'Alert Generated' },
    { label: 'Under Investigation', value: 'Under Investigation' },
    { label: 'Resolved', value: 'Resolved' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Cybercrime Case Repository</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Ingest, review, and correlate financial cybercrime complaints into investigative leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadComplaints()}
            title="Refresh"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 dark:border-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-sm dark:shadow-glow-cyan transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Case</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xs backdrop-blur-md transition-colors duration-200">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by Case ID, reference, or fraud type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-600 transition font-mono dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
          />
        </form>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                statusFilter === opt.value
                  ? 'bg-sky-100 text-cyan-950 border border-sky-300 font-semibold shadow-xs dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-700/60'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:text-slate-200 dark:border-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Complaints Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 dark:bg-slate-950/70 dark:text-slate-400 dark:border-slate-800/80">
              <tr>
                <th className="py-3 px-6">Case Identifier</th>
                <th className="py-3 px-4">Fraud Type</th>
                <th className="py-3 px-4">Reported Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tx Reference</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400 font-mono">
                    Loading case registry...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <FolderOpen className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No matching cases found</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Try clearing search parameters or registering a new complaint.
                    </p>
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-3.5 px-6 font-mono font-bold text-cyan-700 dark:text-cyan-400">
                      {c.complaint_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{c.fraud_type}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{c.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                      {c.transaction_reference || 'N/A'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setImportModalCase(c.complaint_id)}
                          title="Import Transaction Ledger"
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 text-xs transition flex items-center gap-1"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Import</span>
                        </button>
                        <button
                          onClick={() => navigate(`/complaints/${c.complaint_id}`)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/80 dark:hover:bg-cyan-900 dark:text-cyan-300 dark:border-cyan-800/60 text-xs font-medium transition"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Guided Case Registration Modal */}
      <ModalDialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register Cybercrime Complaint"
        subtitle="Ingest initial victim report and initial transaction reference"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateComplaint} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Case Identifier</label>
              <input
                type="text"
                readOnly
                value={formData.complaint_id}
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-mono text-cyan-700 font-bold dark:bg-slate-950 dark:border-slate-800 dark:text-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Fraud Category</label>
              <select
                value={formData.fraud_type}
                onChange={(e) => setFormData({ ...formData, fraud_type: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
              >
                <option value="UPI/payment fraud">UPI/payment fraud</option>
                <option value="Credit Card Fraud">Credit Card Fraud</option>
                <option value="Phishing">Phishing</option>
                <option value="Identity Theft">Identity Theft</option>
                <option value="Crypto Investment Fraud">Crypto Investment Fraud</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Reported Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Initial Tx Reference</label>
              <input
                type="text"
                placeholder="TXN-DEMO-001"
                value={formData.transaction_reference}
                onChange={(e) =>
                  setFormData({ ...formData, transaction_reference: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pseudonymized Complainant</label>
              <input
                type="text"
                placeholder="Complainant #001"
                value={formData.victim_name}
                onChange={(e) => setFormData({ ...formData, victim_name: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Complainant Phone (Masked)</label>
              <input
                type="text"
                placeholder="+91-XXXXX-12345"
                value={formData.victim_phone}
                onChange={(e) => setFormData({ ...formData, victim_phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400 font-medium">Investigative Notes</label>
            <textarea
              rows="3"
              placeholder="Initial intake details, reported timeline, and authorized scope..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 dark:focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm dark:shadow-glow-cyan transition"
            >
              Commit Complaint
            </button>
          </div>
        </form>
      </ModalDialog>

      {/* CSV/JSON Import Modal */}
      {importModalCase && (
        <TransactionImportModal
          isOpen={Boolean(importModalCase)}
          onClose={() => setImportModalCase(null)}
          complaintId={importModalCase}
          onImportSuccess={loadComplaints}
        />
      )}
    </div>
  );
}
