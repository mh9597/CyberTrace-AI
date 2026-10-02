import React, { useState, useMemo, useRef } from 'react';
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
  UserCheck,
  ChevronDown,
  FileSpreadsheet,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCaseModal } from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import { can, PERMISSIONS } from '../utils/permissions';
import { ALL_INDIAN_STATES } from '../data/indiaGeodata';

// Enhanced realistic sample complaints data
const INITIAL_COMPLAINTS = [
  {
    id: 'CT-2026-002',
    complainant: 'Rajesh Patel',
    phone: '+91 98251 44102',
    email: 'rajesh.patel@gmail.com',
    aadhaar: 'XXXX-XXXX-8921',
    fraudType: 'Investment Scam',
    amount: 'Rs.8,00,000',
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
    summary: 'Victim lured into fictitious WhatsApp stock trading group guaranteeing 35% weekly returns. Transferred Rs.8,00,000 across 3 mule accounts.',
  },
  {
    id: 'CT-2026-001',
    complainant: 'Priya Sharma',
    phone: '+91 94280 11984',
    email: 'priya.sharma@outlook.com',
    aadhaar: 'XXXX-XXXX-3419',
    fraudType: 'UPI Fraud',
    amount: 'Rs.4,50,000',
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
    amount: 'Rs.12,40,000',
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
    amount: 'Rs.3,20,000',
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
    amount: 'Rs.18,50,000',
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
    amount: 'Rs.1,80,000',
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const canAuthorizeHighRisk = can(user, PERMISSIONS.AUTHORIZE_HIGH_RISK_ACTION);
  const canAssignIO = can(user, PERMISSIONS.ASSIGN_IO);

  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('bento'); // 'bento' or 'table'
  const [quickViewCase, setQuickViewCase] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  // New Complaint Form State with Dynamic Jurisdictions
  const [formData, setFormData] = useState({
    complainant: '',
    phone: '',
    email: '',
    aadhaar: '',
    fraudType: 'Investment Scam',
    amount: '',
    state: 'Gujarat',
    city: 'Ahmedabad',
    bank: 'State Bank of India',
    suspectBank: 'HDFC Bank',
    suspectAccount: '',
    utr: '',
    summary: '',
  });

  // Compulsory Evidentiary Documents State
  const [statementFile, setStatementFile] = useState(null);
  const [statementMeta, setStatementMeta] = useState(null);
  const [scamFile, setScamFile] = useState(null);
  const [scamMeta, setScamMeta] = useState(null);
  const [scamPreviewUrl, setScamPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const statementInputRef = useRef(null);
  const scamInputRef = useRef(null);

  // Dynamic Cities corresponding to selected State
  const availableCities = useMemo(() => {
    return ALL_INDIAN_STATES[formData.state] || ['Ahmedabad', 'Surat', 'Vadodara'];
  }, [formData.state]);

  const handleStateChange = (newState) => {
    const cities = ALL_INDIAN_STATES[newState] || [];
    setFormData((prev) => ({
      ...prev,
      state: newState,
      city: cities[0] || 'Main District',
    }));
  };

  // Real-time Dynamic AI Telemetry & Risk Scoring Estimator
  const dynamicRiskInfo = useMemo(() => {
    const rawAmt = parseFloat(String(formData.amount).replace(/[^0-9.]/g, '')) || 0;
    const type = formData.fraudType;
    let score = 48;
    let level = 'Medium';
    let color = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    let explanation = 'Single-hop digital trail. Forensic intake queued.';

    if (rawAmt >= 1000000 || type === 'Digital Arrest / CBI Extortion' || type === 'Investment Scam') {
      score = Math.min(98, 85 + Math.floor((rawAmt / 1000000) * 2));
      level = 'Critical';
      color = 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900';
      explanation = 'High-velocity siphon detected. Immediate Layer-1 mule freeze requisition triggered.';
    } else if (rawAmt >= 200000 || type === 'UPI Fraud' || type === 'Cryptocurrency Arbitrage') {
      score = 74;
      level = 'High';
      color = 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400 border-orange-200 dark:border-orange-900';
      explanation = 'Accelerated multi-tier movement. Automated ATM radius monitoring activated.';
    } else if (rawAmt > 0) {
      score = 52;
      level = 'Moderate';
      color = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      explanation = 'Single-hop transaction trail. Evidence verification pending.';
    }

    return { score, level, color, explanation, rawAmt };
  }, [formData.amount, formData.fraudType]);

  // Handle Document 1: Bank / Transaction Statement (Compulsory)
  const handleStatementChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Transaction Statement file size must not exceed 25MB.');
      return;
    }
    setUploadError('');
    setStatementFile(file);
    const hash = 'SHA256:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...verified';
    setStatementMeta({
      name: file.name,
      size: (file.size / 1024 > 1024)
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type || 'application/pdf',
      hash,
    });
  };

  const removeStatement = () => {
    setStatementFile(null);
    setStatementMeta(null);
    if (statementInputRef.current) statementInputRef.current.value = '';
  };

  // Handle Document 2: Scam Evidence Screenshot (Compulsory)
  const handleScamFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Scam Screenshot file size must not exceed 25MB.');
      return;
    }
    setUploadError('');
    setScamFile(file);
    const isImage = file.type.startsWith('image/');
    const preview = isImage ? URL.createObjectURL(file) : null;
    setScamPreviewUrl(preview);
    const hash = 'SHA256:' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...verified';
    setScamMeta({
      name: file.name,
      size: (file.size / 1024 > 1024)
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type,
      isImage,
      hash,
    });
  };

  const removeScamFile = () => {
    if (scamPreviewUrl) URL.revokeObjectURL(scamPreviewUrl);
    setScamFile(null);
    setScamPreviewUrl(null);
    setScamMeta(null);
    if (scamInputRef.current) scamInputRef.current.value = '';
  };

  const hasStatement = Boolean(statementFile);
  const hasScamFile = Boolean(scamFile);
  const isEvidenceComplete = Boolean(statementFile && scamFile);

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
    setUploadError('');

    if (!formData.complainant.trim()) {
      setUploadError('Please enter complainant name.');
      return;
    }
    if (!formData.phone.trim()) {
      setUploadError('Please enter complainant mobile number.');
      return;
    }
    if (!formData.amount.trim()) {
      setUploadError('Please enter total disputed amount.');
      return;
    }

    // STRICT COMPULSORY ATTACHMENTS ENFORCEMENT
    if (!statementFile && !scamFile) {
      setUploadError('COMPULSORY EVIDENCE MISSING: Both (1) Transaction / Bank Statement and (2) Scam Evidence Screenshot (WhatsApp, phishing link, etc.) are mandatory.');
      return;
    }
    if (!statementFile) {
      setUploadError('COMPULSORY DOCUMENT MISSING: Please upload the victim\'s Bank / Transaction Statement.');
      return;
    }
    if (!scamFile) {
      setUploadError('COMPULSORY DOCUMENT MISSING: Please upload a Scam Screenshot (e.g. WhatsApp chat, phishing link, or SMS).');
      return;
    }

    const rawAmt = dynamicRiskInfo.rawAmt || 500000;
    const formattedAmt = `Rs.${rawAmt.toLocaleString('en-IN')}`;
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
      bank: formData.bank || 'State Bank of India',
      suspectBank: formData.suspectBank || 'HDFC Bank (Mule L1)',
      suspectAccount: formData.suspectAccount || '50201948192841',
      utr: formData.utr || `UTR${Date.now()}`,
      date: '12 Oct 2026',
      time: 'Just now',
      status: 'Investigating',
      statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      riskLevel: dynamicRiskInfo.level,
      riskScore: dynamicRiskInfo.score,
      riskColor: dynamicRiskInfo.color,
      assignedOfficer: 'Inspector Raj',
      evidenceCount: 2,
      evidenceFiles: [
        {
          name: statementMeta?.name || 'Bank_Statement.pdf',
          size: statementMeta?.size || '1.4 MB',
          type: 'Bank / Transaction Statement',
          hash: statementMeta?.hash || 'SHA256-Verified',
        },
        {
          name: scamMeta?.name || 'Scam_Evidence.png',
          size: scamMeta?.size || '820 KB',
          type: 'Scam Screenshot',
          hash: scamMeta?.hash || 'SHA256-Verified',
          previewUrl: scamPreviewUrl,
        },
      ],
      summary: formData.summary || `Victim reported ₹${rawAmt.toLocaleString('en-IN')} fraudulent transfer via ${formData.fraudType}. Transaction statement and scam evidence submitted.`,
    };

    setComplaints([newEntry, ...complaints]);
    setShowNewModal(false);
    showToast(`Case ${newId} registered with 2 verified evidence documents! AI Risk Score: ${newEntry.riskScore}%.`);

    // Reset Form
    setFormData({
      complainant: '',
      phone: '',
      email: '',
      aadhaar: '',
      fraudType: 'Investment Scam',
      amount: '',
      state: 'Gujarat',
      city: 'Ahmedabad',
      bank: 'State Bank of India',
      suspectBank: 'HDFC Bank',
      suspectAccount: '',
      utr: '',
      summary: '',
    });
    setStatementFile(null);
    setStatementMeta(null);
    setScamFile(null);
    setScamPreviewUrl(null);
    setScamMeta(null);
    setUploadError('');
  };

  const handleFreezeAction = (caseId, e) => {
    e.stopPropagation();
    if (!canAuthorizeHighRisk) {
      showToast(`Field IO: Freeze requisitions submitted to Supervisory Command for authorization.`);
      return;
    }
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

  const handleAssignOfficerToCase = (officerName) => {
    if (!quickViewCase) return;
    const caseId = quickViewCase.id;
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === caseId
          ? { ...c, assignedOfficer: officerName }
          : c
      )
    );
    setQuickViewCase((prev) => ({ ...prev, assignedOfficer: officerName }));
    setShowAssignDropdown(false);
    showToast(`Case ${caseId} assigned to ${officerName}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none transition-colors duration-200">
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

          {/* Register New Complaint Button (Investigator Only as per Authority Matrix) */}
          {can(user, PERMISSIONS.CREATE_COMPLAINT) ? (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Complaint</span>
            </button>
          ) : (
            <div className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 flex items-center gap-1.5">
              <span>{user?.role === 'senior_officer' ? 'Supervisory Case Review' : 'Archival Dossier View'}</span>
            </div>
          )}

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
              onClick={() => navigate(`/complaints/${item.id}`)}
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
                      title={canAuthorizeHighRisk ? "Freeze Mule Bank Account" : "Submit Freeze Requisition for Supervisory Authorization"}
                    >
                      {canAuthorizeHighRisk ? 'Freeze' : 'Req. Freeze'}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/complaints/${item.id}`)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                    title="Open Full Case Dossier"
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
                    onClick={() => navigate(`/complaints/${c.id}`)}
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
                          title={canAuthorizeHighRisk ? "Freeze" : "Request Freeze"}
                        >
                          {canAuthorizeHighRisk ? 'Freeze' : 'Req.'}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/complaints/${c.id}`); }}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 transition"
                          title="Open Full Case Dossier"
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
            <form onSubmit={handleRegisterComplaint} className="mt-5 space-y-5 text-xs">
              {/* Section 1: Complainant Information & Dynamic Jurisdictions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    1. Complainant Identity & Jurisdiction
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    Dynamic Indian Jurisdiction
                  </span>
                </div>
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
                      Aadhaar / National ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XXXX-XXXX-9912"
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>

                  {/* Dynamic State Selection */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      State / Union Territory *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer"
                    >
                      {Object.keys(ALL_INDIAN_STATES).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic City Selection corresponding to State */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      City / District Jurisdiction *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden cursor-pointer"
                    >
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Financial & Fraud Details with Real-time AI Estimator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                    2. Incident & Financial Telemetry
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">
                    Real-Time AI Risk Scoring
                  </span>
                </div>
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
                      <option>Phishing Ring / Malicious URL</option>
                      <option>WhatsApp / Telegram Impersonation</option>
                      <option>Digital Arrest / CBI Extortion</option>
                      <option>Fake Job / Part-Time Task</option>
                      <option>Cryptocurrency Arbitrage</option>
                      <option>Loan App Extortion</option>
                      <option>Other Cybercrime</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Total Disputed Amount (Rs.) *
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

                {/* Real-time Dynamic AI Telemetry Preview */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span>Projected Threat Level:</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${dynamicRiskInfo.color}`}>
                          {dynamicRiskInfo.level} ({dynamicRiskInfo.score}%)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {dynamicRiskInfo.explanation}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0 pl-9 sm:pl-0">
                    <span className="text-[9px] uppercase font-mono text-slate-400 block">ATM Cash-out Horizon</span>
                    <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 font-mono">
                      {dynamicRiskInfo.rawAmt > 500000 ? '⚡ < 45 Mins (Urgent)' : 'Standard Monitoring'}
                    </span>
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
                      Suspect Bank & Branch Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ICICI Bank, Alkapuri Branch"
                      value={formData.suspectBank}
                      onChange={(e) => setFormData({ ...formData, suspectBank: e.target.value })}
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

              {/* Section 4: Narrative */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Incident Synopsis
                </label>
                <textarea
                  rows="2"
                  placeholder="Detail the sequence of events, communication channel, and deceptive techniques utilized..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                ></textarea>
              </div>

              {/* Section 5: COMPULSORY EVIDENTIARY DOCUMENTS (2 OF 2 MANDATORY) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      4. Compulsory Evidentiary Documents *
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900">
                      2 Required
                    </span>
                  </div>
                  {/* Live Validation Counter */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold">
                    {isEvidenceComplete ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 2/2 Complete
                      </span>
                    ) : hasStatement || hasScamFile ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> 1/2 Uploaded
                      </span>
                    ) : (
                      <span className="text-rose-500 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> 0/2 Uploaded (Mandatory)
                      </span>
                    )}
                  </div>
                </div>

                {/* Two Mandatory Upload Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Card 1: Bank / Transaction Statement */}
                  <div className={`p-4 rounded-2xl border-2 transition ${
                    statementFile 
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20' 
                      : 'border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-blue-400'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${statementFile ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/40'}`}>
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                            1. Transaction Statement *
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Bank passbook / UPI ledger (PDF, CSV, XLS)
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        statementFile 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        {statementFile ? 'ATTACHED' : 'COMPULSORY'}
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={statementInputRef}
                      onChange={handleStatementChange}
                      accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                      className="hidden"
                    />

                    {statementFile && statementMeta ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                            {statementMeta.name}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">
                            {statementMeta.size} • {statementMeta.hash.slice(0, 18)}...
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={removeStatement}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                          title="Remove Statement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => statementInputRef.current?.click()}
                        className="mt-3 w-full py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs hover:border-blue-400"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Upload Transaction Statement</span>
                      </button>
                    )}
                  </div>

                  {/* Card 2: Scam Evidence Screenshot */}
                  <div className={`p-4 rounded-2xl border-2 transition ${
                    scamFile 
                      ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/20' 
                      : 'border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-purple-400'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl ${scamFile ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/40'}`}>
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">
                            2. Scam Screenshot *
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            WhatsApp chat, phishing link, APK (PNG, JPG, PDF)
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        scamFile 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                      }`}>
                        {scamFile ? 'ATTACHED' : 'COMPULSORY'}
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={scamInputRef}
                      onChange={handleScamFileChange}
                      accept="image/*,.pdf"
                      className="hidden"
                    />

                    {scamFile && scamMeta ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {scamPreviewUrl ? (
                            <img
                              src={scamPreviewUrl}
                              alt="Scam Proof Thumbnail"
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                              <FileCheck className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                              {scamMeta.name}
                            </span>
                            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 block">
                              {scamMeta.size} • Verified
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeScamFile}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
                          title="Remove Scam Screenshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scamInputRef.current?.click()}
                        className="mt-3 w-full py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs hover:border-purple-400"
                      >
                        <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Upload Scam Screenshot</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Validation Error Alert Banner */}
                {uploadError && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                <div className="text-[11px] font-mono text-slate-400">
                  {isEvidenceComplete ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evidentiary criteria satisfied
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Both documents compulsory
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewModal(false);
                      setUploadError('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition cursor-pointer hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Register Complaint &amp; Run AI Risk Scoring</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
