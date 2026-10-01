import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Target,
  AlertTriangle,
  Building2,
  Phone,
  Radio,
  Download,
  Share2,
  Lock,
  ArrowUpRight,
  ChevronDown,
  Info,
  Check,
  X,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

// Rich mock case intelligence profiles for prediction center
const PREDICTION_CASES = [
  {
    id: 'CT-2026-001',
    complainant: 'Priya Sharma',
    fraudType: 'UPI Fraud',
    amount: '₹4,50,000',
    amountRaw: 450000,
    city: 'Vadodara',
    state: 'Gujarat',
    suspectBank: 'ICICI Bank (Mule L1)',
    suspectAccount: '194801002948',
    probability: 88,
    riskLevel: 'Critical',
    timeWindow: '12:00 PM – 02:00 PM Today',
    windowStart: '12:00 PM',
    windowEnd: '02:00 PM',
    timeRemaining: '48 mins until peak',
    likelyLocation: 'Vadodara - Alkapuri Commercial Area',
    address: 'Near Alkapuri Post Office, RC Dutt Road, Vadodara, Gujarat 390007',
    radiusKm: 1.2,
    flaggedNodes: ['ATM #1042 - SBI Alkapuri', 'ATM #2081 - HDFC Express', 'Axis Bank Branch E-Lobby'],
    patrolUnit: 'PCR Van 14 (Sub-Insp. Zala)',
    patrolDistance: '1.4 km away (5 mins ETA)',
    xaiFeatures: [
      { name: 'Transaction Velocity Spike', score: 94, impact: 'High', detail: 'Rapid ₹1L transfers within 4 mins matching mule cash-out prep' },
      { name: 'Mule Account Recency', score: 89, impact: 'High', detail: 'Account created 4 days ago with zero prior domestic utility payments' },
      { name: 'Historical DBSCAN Cluster Match', score: 88, impact: 'High', detail: 'Matches the "Golden Triangle Mule Ring" centroid coordinates' },
      { name: 'ATM Terminal Clustering', score: 76, impact: 'Medium', detail: 'High cash reserve ATMs within 600m radius of transit junction' },
      { name: 'Temporal Withdrawal Cycle', score: 71, impact: 'Medium', detail: 'Mule ring consistently operates during branch shift-change hours' },
    ],
    timeDistribution: [
      { hour: '09 AM', prob: 12 },
      { hour: '10 AM', prob: 28 },
      { hour: '11 AM', prob: 54 },
      { hour: '12 PM', prob: 88 }, // Peak
      { hour: '01 PM', prob: 82 },
      { hour: '02 PM', prob: 45 },
      { hour: '03 PM', prob: 22 },
      { hour: '04 PM', prob: 10 },
    ],
    explanation: 'RF-DBSCAN v2.4 classified this case with 88% confidence based on transaction velocity exceeding 3 standard deviations, coupled with destination mule account IP clustering in the Vadodara Alkapuri sub-district. Historical telemetry confirms 4 identical cash-outs occurred in this cluster over the past 14 days.',
  },
  {
    id: 'CT-2026-002',
    complainant: 'Rajesh Patel',
    fraudType: 'Investment Scam',
    amount: '₹8,00,000',
    amountRaw: 800000,
    city: 'Ahmedabad',
    state: 'Gujarat',
    suspectBank: 'HDFC Bank (Mule L1)',
    suspectAccount: '50100492817291',
    probability: 82,
    riskLevel: 'Critical',
    timeWindow: '01:30 PM – 03:30 PM Today',
    windowStart: '01:30 PM',
    windowEnd: '03:30 PM',
    timeRemaining: '1 hr 45 mins until peak',
    likelyLocation: 'Ahmedabad - Satellite & SG Highway Corridor',
    address: 'Near ISCON Cross Roads, SG Highway, Satellite, Ahmedabad 380015',
    radiusKm: 1.8,
    flaggedNodes: ['ATM #3021 - Kotak Mahindra SG Hwy', 'ATM #4190 - ICICI Satellite', 'SBI Drive-In ATM Hub'],
    patrolUnit: 'Cheetah Squad 07 (ASI Vaghela)',
    patrolDistance: '2.1 km away (8 mins ETA)',
    xaiFeatures: [
      { name: 'Layer-2 Funneling Match', score: 92, impact: 'High', detail: 'Funds fractured into 4 sub-accounts of ₹2,00,000 each' },
      { name: 'Location Telemetry Similarity', score: 86, impact: 'High', detail: 'Device IMEI matches SG Highway fraud ring active since Aug 2026' },
      { name: 'DBSCAN Centroid Density', score: 82, impact: 'High', detail: 'High volume withdrawal node with 18 past reported incidents' },
      { name: 'Banking Gateway Latency', score: 68, impact: 'Medium', detail: 'Automated IMPS routing pattern identified' },
      { name: 'Weekend Surge Factor', score: 62, impact: 'Medium', detail: 'Syndicate prefers high-traffic commercial retail centers' },
    ],
    timeDistribution: [
      { hour: '09 AM', prob: 8 },
      { hour: '10 AM', prob: 18 },
      { hour: '11 AM', prob: 36 },
      { hour: '12 PM', prob: 52 },
      { hour: '01 PM', prob: 78 },
      { hour: '02 PM', prob: 82 }, // Peak
      { hour: '03 PM', prob: 64 },
      { hour: '04 PM', prob: 28 },
    ],
    explanation: 'The model identified a classic layering and cash-out profile: ₹8,00,000 was fractured into equal amounts across 4 accounts. The withdrawal centroid aligns with the SG Highway commercial strip where high-limit ATMs allow rapid cash extraction.',
  },
  {
    id: 'CT-3056-003',
    complainant: 'Vikram Merchant',
    fraudType: 'Phishing Ring',
    amount: '₹12,40,000',
    amountRaw: 1240000,
    city: 'Mumbai',
    state: 'Maharashtra',
    suspectBank: 'Kotak Mahindra Bank',
    suspectAccount: '8491028491',
    probability: 76,
    riskLevel: 'High',
    timeWindow: '03:00 PM – 05:00 PM Today',
    windowStart: '03:00 PM',
    windowEnd: '05:00 PM',
    timeRemaining: '3 hrs 12 mins until peak',
    likelyLocation: 'Mumbai - Andheri East Kurla Commercial Strip',
    address: 'Near Chakala Metro Station, Andheri-Kurla Road, Mumbai 400093',
    radiusKm: 2.4,
    flaggedNodes: ['ATM #118 - Axis Chakala', 'ATM #982 - Bank of Baroda Hub', 'IndusInd 24x7 Kiosk'],
    patrolUnit: 'Mobile Patrol 09 (Insp. Kadam)',
    patrolDistance: '3.2 km away (12 mins ETA)',
    xaiFeatures: [
      { name: 'Mule Ring Interconnect', score: 88, impact: 'High', detail: 'Shared beneficiary phone number linked to 14 cyber complaints' },
      { name: 'Corporate Phishing Vector', score: 81, impact: 'High', detail: 'Credentials harvested via fake GST reconciliation portal' },
      { name: 'Metro Corridor Clustering', score: 76, impact: 'High', detail: 'Cash-out location adjacent to rapid transit transit lines' },
      { name: 'Amount Velocity Matrix', score: 70, impact: 'Medium', detail: 'RTGS transfer immediately split into ATM withdrawal caps' },
      { name: 'Branch Withdrawal Override', score: 58, impact: 'Medium', detail: 'Mule self-token verification detected' },
    ],
    timeDistribution: [
      { hour: '11 AM', prob: 14 },
      { hour: '12 PM', prob: 24 },
      { hour: '01 PM', prob: 42 },
      { hour: '02 PM', prob: 58 },
      { hour: '03 PM', prob: 76 }, // Peak
      { hour: '04 PM', prob: 72 },
      { hour: '05 PM', prob: 40 },
      { hour: '06 PM', prob: 18 },
    ],
    explanation: 'Andheri East corridor shows repetitive mule withdrawals within 4 hours of corporate credential phishing. The syndicate extracts ₹50,000 per card across multiple adjacent ATMs to avoid branch scrutiny.',
  },
];

export default function PredictionCenter() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('live'); // 'live', 'backtest', 'metrics'
  const [selectedCaseId, setSelectedCaseId] = useState('CT-2026-001');
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const selectedCase =
    PREDICTION_CASES.find((c) => c.id === selectedCaseId) || PREDICTION_CASES[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRecompute = () => {
    setIsRecomputing(true);
    setTimeout(() => {
      setIsRecomputing(false);
      showToast(`RF-DBSCAN v2.4 re-analyzed case telemetry for ${selectedCase.id}. Forecast updated.`);
    }, 700);
  };

  const handleDispatchIntercept = () => {
    setShowDispatchModal(false);
    showToast(`🚨 High-Priority Intercept Dispatched to ${selectedCase.patrolUnit}! Coordinates shared.`);
  };

  const chartTheme = {
    gridColor: isDark ? '#1e293b' : '#f1f5f9',
    textColor: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none transition-colors duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: Title, Model Badge, Re-run Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Prediction Center
            </h1>
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>RF-DBSCAN v2.4</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Predictive cash-out forecasting, withdrawal window modeling, and explainable AI telemetry
          </p>
        </div>

        {/* Global Controls & Dispatch Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRecompute}
            disabled={isRecomputing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecomputing ? 'animate-spin text-purple-600' : 'text-slate-400'}`} />
            <span>{isRecomputing ? 'Recomputing...' : 'Re-run Model'}</span>
          </button>

          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition cursor-pointer active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Dispatch Field Intercept</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 w-full md:w-auto -mx-1 px-1">
          {[
            { id: 'live', label: 'Live Cash-Out Forecast' },
            { id: 'backtest', label: 'Historical Backtesting (89.2% Acc)' },
            { id: 'metrics', label: 'RF-DBSCAN Model Architecture' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Inspecting Case:</span>
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3 py-1.5 pr-8 text-xs font-bold font-mono text-blue-600 dark:text-blue-400 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              {PREDICTION_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.complainant} ({c.city})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {activeTab === 'live' ? (
        /* Bento Grid (Pinterest Inspired Layout) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card 1: AI Confidence & Probability Meter (col-span-4) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Cash-Out Probability Meter
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Likelihood of physical ATM cash extraction</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900">
                CRITICAL ALERT
              </span>
            </div>

            {/* Circular Gauge / Probability Dial */}
            <div className="py-6 flex flex-col items-center justify-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="transition-all duration-1000 ease-out"
                    stroke={selectedCase.probability > 80 ? '#EF4444' : '#F97316'}
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * selectedCase.probability) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Center Score */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                    {selectedCase.probability}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono mt-1">
                    Confidence
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="mt-3 text-center">
                <div className="text-xs font-extrabold text-red-600 dark:text-red-400">
                  HIGH-VELOCITY MULE EXTRACTION
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Based on 14,200 trained Indian cyber fraud instances
                </div>
              </div>
            </div>

            {/* Quick Specs Footer */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Disputed Sum</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{selectedCase.amount}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-medium">Mule Route</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block text-[11px]">{selectedCase.suspectBank}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Likely Cash-out Time Window (col-span-8) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Likely Withdrawal Time Window
                  </h3>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900">
                    {selectedCase.timeRemaining}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Predicted temporal distribution across 60-minute interval windows
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>{selectedCase.timeWindow}</span>
              </div>
            </div>

            {/* Time Window Area Chart */}
            <div className="h-56 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedCase.timeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                  <XAxis dataKey="hour" stroke={chartTheme.textColor} fontSize={11} tickLine={false} />
                  <YAxis stroke={chartTheme.textColor} fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartTheme.tooltipBg,
                      borderColor: chartTheme.tooltipBorder,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val}% Probability`, 'Withdrawal Risk']}
                  />
                  <Area
                    type="monotone"
                    dataKey="prob"
                    name="Withdrawal Probability"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#timeGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Window Timeline Callout */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>Optimal Intercept Phase: <strong>{selectedCase.windowStart} – {selectedCase.windowEnd}</strong></span>
              </div>
              <span className="text-red-500 font-semibold font-mono">Alert Status: ARMED</span>
            </div>
          </div>

          {/* Card 3: Likely Location Centroid & ATM Nodes (col-span-6) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Predicted Cash-Out Centroid
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Geospatial cluster radius and flagged ATM nodes</p>
                </div>
                <button
                  onClick={() => navigate('/map')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Open Intel Map</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Centroid Location Highlight Box */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent border border-red-200/60 dark:border-red-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {selectedCase.likelyLocation}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    {selectedCase.radiusKm} KM RADIUS
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                  {selectedCase.address}
                </p>
              </div>

              {/* Flagged ATM Terminals in Cluster */}
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Flagged Target Terminals ({selectedCase.flaggedNodes.length})
                </div>
                <div className="space-y-1.5">
                  {selectedCase.flaggedNodes.map((node) => (
                    <div
                      key={node}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{node}</span>
                      </div>
                      <span className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded">
                        High Cash Load
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nearest Field Unit Telemetry */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {selectedCase.patrolUnit}
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px]">
                {selectedCase.patrolDistance}
              </span>
            </div>
          </div>

          {/* Card 4: "Why This Prediction" Explanation Panel (col-span-6) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    "Why This Prediction" Explanation Panel
                  </h3>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                    SHAP / XAI
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>

              {/* Natural Language AI Synopsis */}
              <div className="mt-3 p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedCase.explanation}
              </div>

              {/* Feature Importance Bars */}
              <div className="mt-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Key Signal Weights Contributing to Forecast
                </div>

                <div className="space-y-2 text-xs">
                  {selectedCase.xaiFeatures.map((feat) => (
                    <div key={feat.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                          {feat.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-mono">{feat.impact} Impact</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-xs font-mono">
                            {feat.score}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700"
                          style={{ width: `${feat.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">
                        {feat.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Forensic Signatures Validated</span>
              </span>
              <span>Model Drift: <strong>0.04</strong></span>
            </div>
          </div>
        </div>
      ) : activeTab === 'backtest' ? (
        /* Historical Backtesting Tab */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historical Prediction Performance Verification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of AI predicted cash-out centroids vs confirmed physical ATM arrests in Q3 2026
              </p>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-200">
              89.2% ACCURACY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-800 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Predicted Window</th>
                  <th className="py-2.5 px-3">Actual Cash-out Time</th>
                  <th className="py-2.5 px-3">Target Location</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3 text-right">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">CT-2019-012</td>
                  <td className="py-3 px-3">09:00 AM – 10:30 AM</td>
                  <td className="py-3 px-3">09:12 AM</td>
                  <td className="py-3 px-3">Rajkot Yagnik Rd ATM Hub</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">Suspect Intercepted &amp; 100% Recovered</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">12 mins</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">CT-1942-088</td>
                  <td className="py-3 px-3">02:00 PM – 04:00 PM</td>
                  <td className="py-3 px-3">02:35 PM</td>
                  <td className="py-3 px-3">Surat Ring Rd Axis Kiosk</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">ATM Account Frozen Instantly</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">35 mins</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600">CT-1821-043</td>
                  <td className="py-3 px-3">06:00 PM – 07:30 PM</td>
                  <td className="py-3 px-3">06:50 PM</td>
                  <td className="py-3 px-3">Ahmedabad C.G. Road Node</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold">2 Mules Arrested at ATM Terminal</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400">50 mins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* RF-DBSCAN Model Architecture Tab */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                RF-DBSCAN v2.4 Technical Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Random Forest Classifier + Density-Based Spatial Clustering of Applications with Noise
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200">
              PYTHON 3.11 • SCIKIT-LEARN • FASTAPI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Spatial Clustering Parameter</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Epsilon: 0.045 (1.5 km)</div>
              <p className="text-[11px] text-slate-500">Haversine metric computed across Indian geographic coordinates</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Core Sample Threshold</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Min Samples: 5 Transactions</div>
              <p className="text-[11px] text-slate-500">Filters anomalous random withdrawals to eliminate false positives</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Tree Ensemble Size</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">250 Estimators</div>
              <p className="text-[11px] text-slate-500">Gini impurity metric calibrated against financial crime telemetry</p>
            </div>
          </div>
        </div>
      )}

      {/* Field Intercept Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Dispatch Field Intercept Team
                  </h3>
                  <p className="text-xs text-slate-400">Emergency Tactical Police Tasking</p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
                You are issuing an immediate surveillance &amp; intercept order for case <strong>{selectedCase.id}</strong>.
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Unit:</span>
                  <span className="font-bold">{selectedCase.patrolUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Centroid Target:</span>
                  <span className="font-bold text-right truncate max-w-[200px]">{selectedCase.likelyLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Time Window:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{selectedCase.timeWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance &amp; ETA:</span>
                  <span className="font-bold text-emerald-600">{selectedCase.patrolDistance}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatchIntercept}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                Transmit Dispatch Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
