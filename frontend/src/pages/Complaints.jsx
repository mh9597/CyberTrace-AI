import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  LayoutGrid,
  List,
  Shield,
  Clock,
  ArrowUpRight,
  Building2,
  Phone,
  User,
  CreditCard,
  FileCheck,
  Lock,
  Share2,
  Paperclip,
  Check,
} from 'lucide-react';
import { useCaseModal } from '../components/layout/Layout';

// Enhanced realistic sample complaints data
const INITIAL_COMPLAINTS = [
  {
    id: 'CT-2026-002',
    complainant: 'Rajesh Patel',
    phone: '+91 98251 44102',
    email: 'rajesh.patel@gmail.com',
    aadhaar: 'XXXX-XXXX-8921',
    fraudType: 'Investment Scam',
    amount: '₹8,00,000',
    amountRaw: 800000,
    city: 'Ahmedabad',
    state: 'Gujarat',
    bank: 'State Bank of India',
    suspectBank: 'HDFC Bank (Mule L1)',
    suspectAccount: '50100492817291',
    utr: 'UTR20261001928471',
    date: '12 Oct 2026',
    time: '11:42 AM',
    status: 'Investigating',
    statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    riskLevel: 'Critical',
    riskScore: 82,
    riskColor: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900',
    assignedOfficer: 'Inspector Raj',
    evidenceCount: 3,
    summary: 'Victim lured into fictitious WhatsApp stock trading group guaranteeing 35% weekly returns. Transferred ₹8,00,000 across 3 mule accounts.',
  },
  {
    id: 'CT-2026-001',
    complainant: 'Priya Sharma',
    phone: '+91 94280 11984',
    email: 'priya.sharma@outlook.com',
    aadhaar: 'XXXX-XXXX-3419',
    fraudType: 'UPI Fraud',
    amount: '₹4,50,000',
    amountRaw: 450000,
    city: 'Vadodara',
    state: 'Gujarat',
    bank: 'Bank of Baroda',
    suspectBank: 'ICICI Bank (Mule L1)',
    suspectAccount: '194801002948',
    utr: 'UPI20261001849182',
    date: '12 Oct 2026',
    time: '10:15 AM',
    status: 'Mule Freezed',
    statusColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    riskLevel: 'High',
    riskScore: 88,
    riskColor: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-900',
    assignedOfficer: 'Sub-Inspector Mehta',
    evidenceCount: 4,
    summary: 'Fake electricity bill disconnection SMS with malicious APK download leading to unauthorized UPI collect request approval.',
  },
  {
    id: 'CT-3056-003',
    complainant: 'Vikram Merchant',
    phone: '+91 98200 48190',
    email: 'vikram.merchant@bombaycorp.in',
    aadhaar: 'XXXX-XXXX-6192',
    fraudType: 'Phishing Ring',
    amount: '₹12,40,000',
    amountRaw: 1240000,
    city: 'Mumbai',
    state: 'Maharashtra',
    bank: 'Axis Bank',
    suspectBank: 'Kotak Mahindra Bank',
    suspectAccount: '8491028491',
    utr: 'NEFT2026100192841',
    date: '11 Oct 2026',
    time: '04:20 PM',
    status: 'Investigating',
    statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    riskLevel: 'High',
    riskScore: 76,
    riskColor: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-900',
    assignedOfficer: 'Inspector Raj',
    evidenceCount: 2,
    summary: 'Spoofed corporate banking portal credentials harvested through spear-phishing email disguised as GST audit notification.',
  },
  {
    id: 'CT-2034-007',
    complainant: 'Ananya Desai',
    phone: '+91 97241 88203',
    email: 'ananya.desai@gmail.com',
    aadhaar: 'XXXX-XXXX-5510',
    fraudType: 'Fake Job / Loan',
    amount: '₹3,20,000',
    amountRaw: 320000,
    city: 'Surat',
    state: 'Gujarat',
    bank: 'Union Bank of India',
    suspectBank: 'Canara Bank',
    suspectAccount: '482019481928',
    utr: 'IMPS2026100184912',
    date: '10 Oct 2026',
    time: '02:10 PM',
    status: 'Pending Review',
    statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    riskLevel: 'Medium',
    riskScore: 48,
    riskColor: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    assignedOfficer: 'Unassigned',
    evidenceCount: 2,
    summary: 'Promised remote data analyst role requiring upfront security deposit and equipment software license fee.',
  },
  {
    id: 'CT-2026-005',
    complainant: 'Amit Joshi',
    phone: '+91 98110 59281',
    email: 'amit.joshi@delhinet.org',
    aadhaar: 'XXXX-XXXX-1940',
    fraudType: 'Investment Scam',
    amount: '₹18,50,000',
    amountRaw: 1850000,
    city: 'Delhi',
    state: 'Delhi NCR',
    bank: 'Punjab National Bank',
    suspectBank: 'Federal Bank',
    suspectAccount: '194820194812',
    utr: 'RTGS2026100194819',
    date: '09 Oct 2026',
    time: '05:30 PM',
    status: 'Investigating',
    statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    riskLevel: 'Critical',
    riskScore: 84,
    riskColor: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900',
    assignedOfficer: 'ACP Verma',
    evidenceCount: 5,
    summary: 'Algorithmic crypto arbitrage scheme operated through Telegram channel with fake profit dashboard screenshots.',
  },
  {
    id: 'CT-2019-012',
    complainant: 'Kavita Menon',
    phone: '+91 94471 29481',
    email: 'kavita.menon@keralatrust.in',
    aadhaar: 'XXXX-XXXX-7729',
    fraudType: 'UPI Fraud',
    amount: '₹1,80,000',
    amountRaw: 180000,
    city: 'Rajkot',
    state: 'Gujarat',
    bank: 'Bank of India',
    suspectBank: 'Paytm Payments Bank',
    suspectAccount: '919824819284',
    utr: 'UPI2026092819481',
    date: '08 Oct 2026',
    time: '09:12 AM',
    status: 'Resolved',
    statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    riskLevel: 'Low',
    riskScore: 22,
    riskColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    assignedOfficer: 'Sub-Inspector Mehta',
    evidenceCount: 3,
    summary: 'QR code scam on OLX marketplace. Nodal liaison successfully intercepted transaction and refunded 100% amount to victim.',
  },
];

const FRAUD_TYPES = [
  'All Types',
  'Investment Scam',
  'UPI Fraud',
  'Phishing Ring',
  'Fake Job / Loan',
];

const STATUS_FILTERS = [
  'All Status',
  'Investigating',
  'Mule Freezed',
  'Pending Review',
  'Resolved',
];

export default function Complaints() {
  const { openCaseModal } = useCaseModal();

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('bento'); // 'bento' or 'table'
  const [quickViewCase, setQuickViewCase] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Complaint Form State
  const [formData, setFormData] = useState({
    complainant: '',
    phone: '',
    email: '',
    aadhaar: '',
    fraudType: 'Investment Scam',
    amount: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    bank: 'State Bank of India',
    suspectBank: 'HDFC Bank',
    suspectAccount: '',
    utr: '',
    summary: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm);

      const matchType =
        selectedType === 'All Types' || c.fraudType === selectedType;

      const matchStatus =
        selectedStatus === 'All Status' || c.status === selectedStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [complaints, searchTerm, selectedType, selectedStatus]);

  const handleRegisterComplaint = (e) => {
    e.preventDefault();
    if (!formData.complainant || !formData.amount) return;

    const rawAmt = parseFloat(formData.amount.replace(/[^0-9.]/g, '')) || 500000;
    const formattedAmt = `₹${rawAmt.toLocaleString('en-IN')}`;

    const newId = `CT-2026-0${complaints.length + 3}`;
    const newEntry = {
      id: newId,
      complainant: formData.complainant,
      phone: formData.phone || '+91 98765 43210',
      email: formData.email || 'victim@example.in',
      aadhaar: formData.aadhaar || 'XXXX-XXXX-9912',
      fraudType: formData.fraudType,
      amount: formattedAmt,
      amountRaw: rawAmt,
      city: formData.city,
      state: formData.state,
      bank: formData.bank,
      suspectBank: formData.suspectBank,
      suspectAccount: formData.suspectAccount || '50201948192841',
      utr: formData.utr || `UTR${Date.now()}`,
      date: '12 Oct 2026',
      time: 'Just now',
      status: 'Investigating',
      statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      riskLevel: rawAmt > 500000 ? 'Critical' : 'High',
      riskScore: rawAmt > 500000 ? 84 : 65,
      riskColor: rawAmt > 500000 ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900' : 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-900',
      assignedOfficer: 'Inspector Raj',
      evidenceCount: 1,
      summary: formData.summary || 'Initial cybercrime complaint lodged. Bank nodal liaisons initiated.',
    };

    setComplaints([newEntry, ...complaints]);
    setShowNewModal(false);
    showToast(`Case ${newId} registered successfully & AI risk scored at ${newEntry.riskScore}%!`);

    // Reset Form
    setFormData({
      complainant: '',
      phone: '',
      email: '',
      aadhaar: '',
      fraudType: 'Investment Scam',
      amount: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      bank: 'State Bank of India',
      suspectBank: 'HDFC Bank',
      suspectAccount: '',
      utr: '',
      summary: '',
    });
  };

  const handleFreezeAction = (caseId, e) => {
    e.stopPropagation();
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? {
              ...c,
              status: 'Mule Freezed',
              statusColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
            }
          : c
      )
    );
    showToast(`Mule accounts for case ${caseId} marked as FREEZED!`);
    if (quickViewCase && quickViewCase.id === caseId) {
      setQuickViewCase((prev) => ({
        ...prev,
        status: 'Mule Freezed',
        statusColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      }));
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row: Title & Action CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Complaints & Case Files
            </h1>
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              {filteredComplaints.length} CASES
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Intake register, FIR dossiers, mule account freezing, and evidentiary records
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle (Bento Grid vs Data Table) */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('bento')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'bento'
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Bento Card View (Pinterest Style)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Data Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Register New Complaint Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Complaint</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, name, city, phone..."
            className="w-full bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Fraud Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            {FRAUD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Export Report CTA */}
          <button
            onClick={() => showToast('Exporting Form 65B compliant CSV dataset...')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Bento Grid or Data Table */}
      {viewMode === 'bento' ? (
        /* Bento Grid (Pinterest Visual Style) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredComplaints.map((item) => (
            <div
              key={item.id}
              onClick={() => setQuickViewCase(item)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Ribbon */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  item.riskScore > 80
                    ? 'bg-red-500'
                    : item.riskScore > 60
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
                }`}
              />

              <div>
                {/* Header: Case ID, Risk Tag, Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                      {item.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.riskColor}`}>
                      {item.riskScore}% RISK
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                {/* Victim & Amount Headline */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {item.complainant}
                    </h3>
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        {item.amount}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Disputed Amount</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{item.fraudType}</span>
                    <span>&bull;</span>
                    <span>{item.city}, {item.state}</span>
                  </div>
                </div>

                {/* Summary snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {item.summary}
                </p>

                {/* Bank Route Pill */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[120px]">{item.bank}</span>
                  </div>
                  <span className="text-slate-400">&rarr;</span>
                  <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400 font-medium">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{item.suspectBank}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.status !== 'Mule Freezed' && (
                    <button
                      onClick={(e) => handleFreezeAction(item.id, e)}
                      className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-red-600 dark:text-red-400 text-[11px] font-semibold border border-red-200 dark:border-red-900 transition"
                      title="Freeze Mule Bank Account"
                    >
                      Freeze
                    </button>
                  )}
                  <button
                    onClick={() => setQuickViewCase(item)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                    title="Quick Dossier View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-Density Data Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 font-mono">
                <tr>
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Complainant / Entity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">AI Risk</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredComplaints.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setQuickViewCase(c)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {c.complainant}
                      </div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {c.fraudType}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {c.amount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {c.city}, {c.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.riskColor}`}>
                        {c.riskScore}% {c.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.statusColor}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => handleFreezeAction(c.id, e)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 text-[10px] font-semibold transition"
                          title="Freeze"
                        >
                          Freeze
                        </button>
                        <button
                          onClick={() => setQuickViewCase(c)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 transition"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick View Slide-out Drawer */}
      {quickViewCase && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                  {quickViewCase.id}
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {quickViewCase.complainant}
                  </h3>
                  <p className="text-xs text-slate-400">{quickViewCase.fraudType} &bull; {quickViewCase.city}</p>
                </div>
              </div>
              <button
                onClick={() => setQuickViewCase(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Dossier */}
            <div className="p-5 space-y-5 text-xs">
              {/* Financial & Status Hero Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Disputed Amount</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                    {quickViewCase.amount}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">UTR: {quickViewCase.utr}</span>
                </div>
                <div className="text-right space-y-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${quickViewCase.riskColor}`}>
                    {quickViewCase.riskScore}% {quickViewCase.riskLevel} Risk
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Assigned: {quickViewCase.assignedOfficer}
                  </div>
                </div>
              </div>

              {/* Case Narrative */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Incident Narrative
                </h4>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed">
                  {quickViewCase.summary}
                </p>
              </div>

              {/* Victim Contact Info */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Complainant Identity
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Mobile Number</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{quickViewCase.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{quickViewCase.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Aadhaar (Masked)</span>
                    <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{quickViewCase.aadhaar}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Jurisdiction</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{quickViewCase.city}, {quickViewCase.state}</span>
                  </div>
                </div>
              </div>

              {/* Suspect Mule Bank Trail */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Suspect Mule Route
                </h4>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Victim Bank</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{quickViewCase.bank}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-base">&rarr;</span>
                    <div className="text-right">
                      <span className="text-[10px] text-red-500 font-bold block">Suspect Destination</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{quickViewCase.suspectBank}</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex justify-between">
                    <span>Mule A/C: {quickViewCase.suspectAccount}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline" onClick={() => openCaseModal(quickViewCase.id)}>View Network Graph &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Evidence Vault */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
                  Verified Evidence Files ({quickViewCase.evidenceCount})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold block truncate">Bank_Statement.pdf</span>
                      <span className="text-[10px] text-slate-400 font-mono">1.4 MB • SHA256</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold block truncate">WhatsApp_Chat.png</span>
                      <span className="text-[10px] text-slate-400 font-mono">820 KB • Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Action Bar */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 flex items-center gap-2.5 sticky bottom-0">
              <button
                onClick={(e) => handleFreezeAction(quickViewCase.id, e)}
                disabled={quickViewCase.status === 'Mule Freezed'}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{quickViewCase.status === 'Mule Freezed' ? 'Mule Freezed' : 'Freeze Mule Account'}</span>
              </button>
              <button
                onClick={() => showToast(`Dossier for ${quickViewCase.id} exported under Sec 65B!`)}
                className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Register New Complaint" Modal Form */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Register Cybercrime Complaint
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Lodges official cyber complaint, generates telemetry, and initiates AI risk scoring
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterComplaint} className="mt-5 space-y-4 text-xs">
              {/* Section 1: Complainant Information */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  1. Complainant Identity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Complainant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.complainant}
                      onChange={(e) => setFormData({ ...formData, complainant: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98250 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="victim@example.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      City / Jurisdiction
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer"
                    >
                      <option>Ahmedabad</option>
                      <option>Vadodara</option>
                      <option>Surat</option>
                      <option>Rajkot</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Financial & Fraud Details */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  2. Incident & Financial Telemetry
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Fraud Category *
                    </label>
                    <select
                      value={formData.fraudType}
                      onChange={(e) => setFormData({ ...formData, fraudType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer"
                    >
                      <option>Investment Scam</option>
                      <option>UPI Fraud</option>
                      <option>Phishing Ring</option>
                      <option>Fake Job / Loan</option>
                      <option>Cryptocurrency Fraud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Total Disputed Amount (₹) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5,00,000"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Suspect Bank & UTR Reference */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  3. Suspect Account & Transaction Hash
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Victim Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. State Bank of India"
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Suspect Mule Account / UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 502019481928 or scammer@okhdfc"
                      value={formData.suspectAccount}
                      onChange={(e) => setFormData({ ...formData, suspectAccount: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      UTR / Transaction Reference Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTR20261001928471"
                      value={formData.utr}
                      onChange={(e) => setFormData({ ...formData, utr: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Narrative & File Attachment */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Incident Synopsis
                </label>
                <textarea
                  rows="3"
                  placeholder="Detail the sequence of events, communication channel, and deceptive techniques utilized..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                ></textarea>
              </div>

              {/* Drag and Drop Evidence Upload Zone */}
              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-800/30">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Upload Evidentiary Documents
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Bank Statements, WhatsApp Export, APK payloads, or Call Logs (Max 25MB)
                </span>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer shadow-xs active:scale-95"
                >
                  Register Complaint &amp; Run AI Risk Scoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
