import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Shield,
  AlertTriangle,
  Target,
  Calendar,
  ChevronDown,
  Pin,
  Maximize2,
  Minimize2,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Layers,
  CheckCircle2,
  DollarSign,
  FileText,
  Activity,
  Cpu,
  RefreshCw,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useCaseModal } from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';

// ── Data sets keyed by date-range so every chart + KPI changes on switch ──
const DATA_BY_RANGE = {
  'Last 7 Days': {
    kpi: {
      totalCases: '1,248', totalTrend: '+12%', totalTrendLabel: 'vs last week',
      activeInvest: '342', activeTrend: '+18%', activeTrendLabel: 'vs last week',
      highRiskAlerts: '68', riskTrend: '+24%', riskTrendLabel: 'vs last week',
      accuracy: '87.4%', accTrend: '+3%', accTrendLabel: 'vs last week',
    },
    caseTrend: [
      { month: '06 Oct', registered: 168, resolved: 112 },
      { month: '07 Oct', registered: 192, resolved: 136 },
      { month: '08 Oct', registered: 210, resolved: 164 },
      { month: '09 Oct', registered: 186, resolved: 148 },
      { month: '10 Oct', registered: 224, resolved: 178 },
      { month: '11 Oct', registered: 198, resolved: 162 },
      { month: '12 Oct', registered: 232, resolved: 190 },
    ],
    fraudType: [
      { name: 'Investment Scam', value: 42, amount: '₹14.2 Cr', color: '#2563EB' },
      { name: 'UPI Fraud', value: 28, amount: '₹6.8 Cr', color: '#06B6D4' },
      { name: 'Phishing Ring', value: 16, amount: '₹4.1 Cr', color: '#8B5CF6' },
      { name: 'Fake Job / Loan', value: 14, amount: '₹3.5 Cr', color: '#F59E0B' },
    ],
    fraudTotal: '₹28.6 Cr',
    cityRisk: [
      { city: 'Ahmedabad', risk: 82, cases: 420, color: '#EF4444' },
      { city: 'Vadodara', risk: 64, cases: 280, color: '#F97316' },
      { city: 'Surat', risk: 48, cases: 195, color: '#F59E0B' },
      { city: 'Rajkot', risk: 36, cases: 140, color: '#3B82F6' },
      { city: 'Mumbai', risk: 28, cases: 110, color: '#2563EB' },
      { city: 'Delhi', risk: 68, cases: 310, color: '#EF4444' },
      { city: 'Kolkata', risk: 74, cases: 340, color: '#DC2626' },
    ],
    timeWindow: [
      { slot: '08-10 AM', probability: 28 },
      { slot: '10-12 PM', probability: 64 },
      { slot: '12-02 PM', probability: 88 },
      { slot: '02-04 PM', probability: 72 },
      { slot: '04-06 PM', probability: 42 },
      { slot: '06-08 PM', probability: 18 },
    ],
    peakWindow: 'PEAK 12-2 PM',
    modelAccuracy: [
      { week: 'W1', precision: 76.2, recall: 71.4 },
      { week: 'W2', precision: 79.5, recall: 75.1 },
      { week: 'W3', precision: 82.1, recall: 78.6 },
      { week: 'W4', precision: 84.8, recall: 81.2 },
      { week: 'W5', precision: 86.3, recall: 83.9 },
      { week: 'W6', precision: 87.4, recall: 85.1 },
    ],
    f1Score: '86.2%', clusterDrift: '0.04 (Normal)',
    pipeline: [
      { stage: 'Reported', count: 1248, pct: '100%', color: 'bg-blue-500' },
      { stage: 'Investigating', count: 864, pct: '69%', color: 'bg-indigo-500' },
      { stage: 'Mule Accounts Freezed', count: 542, pct: '43%', color: 'bg-cyan-500' },
      { stage: 'Accused Identified', count: 328, pct: '26%', color: 'bg-amber-500' },
      { stage: 'Chargesheet Filed', count: 194, pct: '15%', color: 'bg-purple-500' },
      { stage: 'Funds Recovered', count: 142, pct: '11%', color: 'bg-emerald-500' },
    ],
    avgResolution: '14.2 Days', totalRecovered: '₹4.8 Cr Recovered in 2026',
    centroid: 'Vadodara Alkapuri',
  },
  'Last 30 Days': {
    kpi: {
      totalCases: '4,832', totalTrend: '+22%', totalTrendLabel: 'vs previous month',
      activeInvest: '1,106', activeTrend: '+31%', activeTrendLabel: 'vs previous month',
      highRiskAlerts: '214', riskTrend: '+18%', riskTrendLabel: 'vs previous month',
      accuracy: '86.8%', accTrend: '+5%', accTrendLabel: 'vs previous month',
    },
    caseTrend: [
      { month: 'Week 1', registered: 980, resolved: 640 },
      { month: 'Week 2', registered: 1120, resolved: 780 },
      { month: 'Week 3', registered: 1340, resolved: 960 },
      { month: 'Week 4', registered: 1392, resolved: 1080 },
    ],
    fraudType: [
      { name: 'Investment Scam', value: 38, amount: '₹52.1 Cr', color: '#2563EB' },
      { name: 'UPI Fraud', value: 32, amount: '₹28.4 Cr', color: '#06B6D4' },
      { name: 'Phishing Ring', value: 18, amount: '₹14.6 Cr', color: '#8B5CF6' },
      { name: 'Fake Job / Loan', value: 12, amount: '₹9.2 Cr', color: '#F59E0B' },
    ],
    fraudTotal: '₹104.3 Cr',
    cityRisk: [
      { city: 'Ahmedabad', risk: 86, cases: 1480, color: '#EF4444' },
      { city: 'Delhi', risk: 78, cases: 1320, color: '#DC2626' },
      { city: 'Kolkata', risk: 72, cases: 1180, color: '#EA580C' },
      { city: 'Vadodara', risk: 58, cases: 860, color: '#F97316' },
      { city: 'Surat', risk: 52, cases: 740, color: '#F59E0B' },
      { city: 'Mumbai', risk: 44, cases: 620, color: '#3B82F6' },
      { city: 'Rajkot', risk: 32, cases: 410, color: '#2563EB' },
    ],
    timeWindow: [
      { slot: '08-10 AM', probability: 34 },
      { slot: '10-12 PM', probability: 72 },
      { slot: '12-02 PM', probability: 92 },
      { slot: '02-04 PM', probability: 68 },
      { slot: '04-06 PM', probability: 48 },
      { slot: '06-08 PM', probability: 22 },
    ],
    peakWindow: 'PEAK 12-2 PM',
    modelAccuracy: [
      { week: 'W1', precision: 74.5, recall: 68.2 },
      { week: 'W2', precision: 78.1, recall: 72.6 },
      { week: 'W3', precision: 81.0, recall: 76.8 },
      { week: 'W4', precision: 84.3, recall: 80.4 },
      { week: 'W5', precision: 85.9, recall: 83.0 },
      { week: 'W6', precision: 86.8, recall: 84.2 },
    ],
    f1Score: '85.5%', clusterDrift: '0.06 (Normal)',
    pipeline: [
      { stage: 'Reported', count: 4832, pct: '100%', color: 'bg-blue-500' },
      { stage: 'Investigating', count: 3214, pct: '66%', color: 'bg-indigo-500' },
      { stage: 'Mule Accounts Freezed', count: 1948, pct: '40%', color: 'bg-cyan-500' },
      { stage: 'Accused Identified', count: 1064, pct: '22%', color: 'bg-amber-500' },
      { stage: 'Chargesheet Filed', count: 628, pct: '13%', color: 'bg-purple-500' },
      { stage: 'Funds Recovered', count: 386, pct: '8%', color: 'bg-emerald-500' },
    ],
    avgResolution: '16.8 Days', totalRecovered: '₹14.6 Cr Recovered in 2026',
    centroid: 'Delhi Jamtara Corridor',
  },
  'This Quarter': {
    kpi: {
      totalCases: '12,640', totalTrend: '+34%', totalTrendLabel: 'vs Q1 2026',
      activeInvest: '2,846', activeTrend: '+28%', activeTrendLabel: 'vs Q1 2026',
      highRiskAlerts: '584', riskTrend: '+42%', riskTrendLabel: 'vs Q1 2026',
      accuracy: '85.2%', accTrend: '+8%', accTrendLabel: 'vs Q1 2026',
    },
    caseTrend: [
      { month: 'Jul 2026', registered: 3840, resolved: 2680 },
      { month: 'Aug 2026', registered: 4120, resolved: 3040 },
      { month: 'Sep 2026', registered: 4680, resolved: 3520 },
    ],
    fraudType: [
      { name: 'Investment Scam', value: 36, amount: '₹148 Cr', color: '#2563EB' },
      { name: 'UPI Fraud', value: 30, amount: '₹82 Cr', color: '#06B6D4' },
      { name: 'Phishing Ring', value: 20, amount: '₹64 Cr', color: '#8B5CF6' },
      { name: 'Fake Job / Loan', value: 14, amount: '₹38 Cr', color: '#F59E0B' },
    ],
    fraudTotal: '₹332 Cr',
    cityRisk: [
      { city: 'Ahmedabad', risk: 88, cases: 3640, color: '#EF4444' },
      { city: 'Delhi', risk: 84, cases: 3280, color: '#DC2626' },
      { city: 'Kolkata', risk: 76, cases: 2860, color: '#EA580C' },
      { city: 'Mumbai', risk: 62, cases: 2140, color: '#F97316' },
      { city: 'Vadodara', risk: 54, cases: 1680, color: '#F59E0B' },
      { city: 'Surat', risk: 46, cases: 1420, color: '#3B82F6' },
      { city: 'Rajkot', risk: 34, cases: 920, color: '#2563EB' },
    ],
    timeWindow: [
      { slot: '08-10 AM', probability: 32 },
      { slot: '10-12 PM', probability: 68 },
      { slot: '12-02 PM', probability: 86 },
      { slot: '02-04 PM', probability: 78 },
      { slot: '04-06 PM', probability: 52 },
      { slot: '06-08 PM', probability: 26 },
    ],
    peakWindow: 'PEAK 12-4 PM',
    modelAccuracy: [
      { week: 'Jul W1', precision: 72.4, recall: 65.8 },
      { week: 'Jul W3', precision: 76.8, recall: 70.2 },
      { week: 'Aug W1', precision: 80.2, recall: 74.6 },
      { week: 'Aug W3', precision: 82.6, recall: 78.0 },
      { week: 'Sep W1', precision: 84.1, recall: 80.8 },
      { week: 'Sep W3', precision: 85.2, recall: 82.4 },
    ],
    f1Score: '83.8%', clusterDrift: '0.08 (Watch)',
    pipeline: [
      { stage: 'Reported', count: 12640, pct: '100%', color: 'bg-blue-500' },
      { stage: 'Investigating', count: 8204, pct: '65%', color: 'bg-indigo-500' },
      { stage: 'Mule Accounts Freezed', count: 4804, pct: '38%', color: 'bg-cyan-500' },
      { stage: 'Accused Identified', count: 2654, pct: '21%', color: 'bg-amber-500' },
      { stage: 'Chargesheet Filed', count: 1516, pct: '12%', color: 'bg-purple-500' },
      { stage: 'Funds Recovered', count: 884, pct: '7%', color: 'bg-emerald-500' },
    ],
    avgResolution: '18.4 Days', totalRecovered: '₹38.2 Cr Recovered in Q2',
    centroid: 'Ahmedabad SG Highway',
  },
  'FY 2026-27': {
    kpi: {
      totalCases: '48,260', totalTrend: '+46%', totalTrendLabel: 'vs FY 2025-26',
      activeInvest: '6,820', activeTrend: '+52%', activeTrendLabel: 'vs FY 2025-26',
      highRiskAlerts: '2,148', riskTrend: '+38%', riskTrendLabel: 'vs FY 2025-26',
      accuracy: '84.6%', accTrend: '+12%', accTrendLabel: 'vs FY 2025-26',
    },
    caseTrend: [
      { month: 'Apr 2026', registered: 6420, resolved: 4280 },
      { month: 'May 2026', registered: 7240, resolved: 5020 },
      { month: 'Jun 2026', registered: 7860, resolved: 5640 },
      { month: 'Jul 2026', registered: 8420, resolved: 6180 },
      { month: 'Aug 2026', registered: 9180, resolved: 7040 },
      { month: 'Sep 2026', registered: 9140, resolved: 7320 },
    ],
    fraudType: [
      { name: 'Investment Scam', value: 34, amount: '₹482 Cr', color: '#2563EB' },
      { name: 'UPI Fraud', value: 28, amount: '₹264 Cr', color: '#06B6D4' },
      { name: 'Phishing Ring', value: 22, amount: '₹218 Cr', color: '#8B5CF6' },
      { name: 'Fake Job / Loan', value: 16, amount: '₹142 Cr', color: '#F59E0B' },
    ],
    fraudTotal: '₹1,106 Cr',
    cityRisk: [
      { city: 'Delhi', risk: 92, cases: 12840, color: '#EF4444' },
      { city: 'Ahmedabad', risk: 86, cases: 10420, color: '#DC2626' },
      { city: 'Kolkata', risk: 80, cases: 8640, color: '#EA580C' },
      { city: 'Mumbai', risk: 72, cases: 7280, color: '#F97316' },
      { city: 'Vadodara', risk: 56, cases: 4820, color: '#F59E0B' },
      { city: 'Surat', risk: 48, cases: 3640, color: '#3B82F6' },
      { city: 'Rajkot', risk: 38, cases: 2420, color: '#2563EB' },
    ],
    timeWindow: [
      { slot: '08-10 AM', probability: 36 },
      { slot: '10-12 PM', probability: 74 },
      { slot: '12-02 PM', probability: 82 },
      { slot: '02-04 PM', probability: 76 },
      { slot: '04-06 PM', probability: 56 },
      { slot: '06-08 PM', probability: 30 },
    ],
    peakWindow: 'PEAK 10 AM-4 PM',
    modelAccuracy: [
      { week: 'Apr', precision: 68.4, recall: 62.0 },
      { week: 'May', precision: 72.8, recall: 66.4 },
      { week: 'Jun', precision: 76.2, recall: 71.2 },
      { week: 'Jul', precision: 80.4, recall: 75.8 },
      { week: 'Aug', precision: 82.8, recall: 79.4 },
      { week: 'Sep', precision: 84.6, recall: 81.6 },
    ],
    f1Score: '83.1%', clusterDrift: '0.11 (Elevated)',
    pipeline: [
      { stage: 'Reported', count: 48260, pct: '100%', color: 'bg-blue-500' },
      { stage: 'Investigating', count: 30884, pct: '64%', color: 'bg-indigo-500' },
      { stage: 'Mule Accounts Freezed', count: 17374, pct: '36%', color: 'bg-cyan-500' },
      { stage: 'Accused Identified', count: 9652, pct: '20%', color: 'bg-amber-500' },
      { stage: 'Chargesheet Filed', count: 5308, pct: '11%', color: 'bg-purple-500' },
      { stage: 'Funds Recovered', count: 2896, pct: '6%', color: 'bg-emerald-500' },
    ],
    avgResolution: '21.6 Days', totalRecovered: '₹124 Cr Recovered in FY 26-27',
    centroid: 'Delhi-Jamtara-Kolkata Axis',
  },
};

// Recent Activity Feed (same across ranges — it's a "live" feed)
const RECENT_ACTIVITIES = [
  {
    id: 'ACT-1',
    caseId: 'CT-2026-002',
    type: 'Complaint',
    title: 'New complaint registered',
    detail: 'Investment Scam • Amount: ₹8,00,000 • Ahmedabad Satellite',
    time: '2 min ago',
    tag: 'Critical',
    tagColor: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900',
    icon: FileText,
    iconColor: 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400',
  },
  {
    id: 'ACT-2',
    caseId: 'CT-2026-001',
    type: 'Prediction',
    title: 'High-risk cash-out window predicted',
    detail: 'Vadodara Alkapuri ATM Cluster • Window: 12 PM - 2 PM (88% prob)',
    time: '12 min ago',
    tag: 'AI Alert',
    tagColor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-900',
    icon: Target,
    iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  },
  {
    id: 'ACT-3',
    caseId: 'CT-3056-003',
    type: 'Freeze',
    title: 'Bank mule accounts freezed',
    detail: 'ICICI Bank • ₹12,40,000 blocked • Nodal officer confirmation received',
    time: '28 min ago',
    tag: 'Freezed',
    tagColor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    icon: CheckCircle2,
    iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
  },
  {
    id: 'ACT-4',
    caseId: 'CT-2034-007',
    type: 'Evidence',
    title: 'CDR & IP logs uploaded',
    detail: '3 evidence files verified • Assigned to Inspector Raj',
    time: '1 hour ago',
    tag: 'Evidence',
    tagColor: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    icon: Activity,
    iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { openCaseModal } = useCaseModal();
  const { isDark } = useTheme();

  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [pinnedCards, setPinnedCards] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  // Derive all data from selected dateRange
  const D = DATA_BY_RANGE[dateRange] || DATA_BY_RANGE['Last 7 Days'];

  const togglePin = (cardId, e) => {
    e.stopPropagation();
    setPinnedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const chartTheme = {
    gridColor: isDark ? '#1e293b' : '#f1f5f9',
    textColor: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#0f172a' : '#ffffff',
    tooltipBorder: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none transition-colors duration-200">
      {/* 1. Header Bar: Title, Range Selector & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dashboard
            </h1>
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Real-time analytics, predictive cash-out telemetry, and case status pipeline
          </p>
        </div>

        {/* Date Selector & Export Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>01 Oct 2026 - 12 Oct 2026</span>
          </div>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>FY 2026-27</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => navigate('/complaints')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <span>Complaints</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Row with Sparklines (Pinterest Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Cases */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Cases</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {D.kpi.totalCases}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{D.kpi.totalTrend} {D.kpi.totalTrendLabel}</span>
              </div>
            </div>
            {/* SVG Sparkline */}
            <div className="w-16 h-8 shrink-0">
              <svg viewBox="0 0 64 32" className="w-full h-full overflow-visible">
                <path d="M 0,26 C 16,28 28,18 42,22 C 52,24 58,10 64,8" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Investigations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Investigations</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {D.kpi.activeInvest}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{D.kpi.activeTrend} {D.kpi.activeTrendLabel}</span>
              </div>
            </div>
            <div className="w-16 h-8 shrink-0">
              <svg viewBox="0 0 64 32" className="w-full h-full overflow-visible">
                <path d="M 0,24 C 18,26 30,16 44,18 C 52,19 56,12 64,6" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 3: High Risk Alerts */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">High Risk Alerts</span>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {D.kpi.highRiskAlerts}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-red-500 dark:text-red-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{D.kpi.riskTrend} {D.kpi.riskTrendLabel}</span>
              </div>
            </div>
            <div className="w-16 h-8 shrink-0">
              <svg viewBox="0 0 64 32" className="w-full h-full overflow-visible">
                <path d="M 0,28 C 14,24 24,28 36,20 C 48,12 56,16 64,10" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 4: Prediction Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prediction Accuracy</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {D.kpi.accuracy}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{D.kpi.accTrend} {D.kpi.accTrendLabel}</span>
              </div>
            </div>
            <div className="w-16 h-8 shrink-0">
              <svg viewBox="0 0 64 32" className="w-full h-full overflow-visible">
                <path d="M 0,22 C 16,18 28,26 44,14 C 54,8 58,16 64,12" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bento Grid: Main Analytics Cards (NO map!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card A: Case Trends Line Chart (Registered vs Resolved) - col-span-8 */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Case Volume & Resolution Trajectory
                </h2>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                  Registered vs Resolved
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly trend of cybercrime complaints and successful recoveries
              </p>
            </div>

            {/* Pin & Maximize buttons (Pinterest feature) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => togglePin('trend', e)}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  pinnedCards['trend']
                    ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                }`}
                title="Pin this card"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setExpandedCard('trend')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition cursor-pointer"
                title="Expand view"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Recharts Area/Line Chart */}
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={D.caseTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="month" stroke={chartTheme.textColor} fontSize={11} tickLine={false} />
                <YAxis stroke={chartTheme.textColor} fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="registered" name="Registered Complaints" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReg)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card B: Fraud-Type Donut Distribution - col-span-4 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Fraud Classification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Share of financial cybercrime categories
              </p>
            </div>
            <button
              onClick={() => setExpandedCard('fraud')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
              title="Expand view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Donut Chart */}
          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={D.fraudType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {D.fraudType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val, name, item) => [`${val}% (${item.payload.amount})`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{D.fraudTotal}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Total Volume</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {D.fraudType.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="truncate">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate block text-[11px]">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.value}% • {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card C: Risk Score by City Bars - col-span-4 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Threat Intensity by City
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI Composite Vulnerability Score (0-100)
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>View Map</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Horizontal Bar Visuals */}
          <div className="space-y-3 pt-3">
            {D.cityRisk.map((city) => (
              <div key={city.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{city.city}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{city.cases} cases</span>
                    <span className="font-bold text-xs" style={{ color: city.color }}>{city.risk}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${city.risk}%`,
                      backgroundColor: city.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card D: Predicted Cash-out Time-Window Bars - col-span-4 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Predicted Cash-out Window
                </h2>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-900">
                  {D.peakWindow}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Likely ATM & branch withdrawal hours
              </p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          {/* Time Window Recharts Bar */}
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={D.timeWindow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="slot" stroke={chartTheme.textColor} fontSize={10} tickLine={false} />
                <YAxis stroke={chartTheme.textColor} fontSize={10} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`${val}% Probability`, 'Risk Probability']}
                />
                <Bar dataKey="probability" radius={[6, 6, 0, 0]}>
                  {D.timeWindow.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.probability > 75 ? '#EF4444' : entry.probability > 50 ? '#F97316' : '#3B82F6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Primary Mule Centroid: {D.centroid}</span>
            <span className="font-semibold text-red-500">Alert Patrols Active</span>
          </div>
        </div>

        {/* Card E: AI Model Accuracy & Evaluation Trend - col-span-4 */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  RF-DBSCAN Model Health
                </h2>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-900">
                  v2.4 STABLE
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Precision & Recall across prediction waves
              </p>
            </div>
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>

          {/* Model Accuracy Line Chart */}
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={D.modelAccuracy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                <XAxis dataKey="week" stroke={chartTheme.textColor} fontSize={11} tickLine={false} />
                <YAxis domain={[65, 95]} stroke={chartTheme.textColor} fontSize={11} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    borderColor: chartTheme.tooltipBorder,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Line type="monotone" dataKey="precision" name={`Precision (${D.kpi.accuracy})`} stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="recall" name={`Recall (${D.modelAccuracy[D.modelAccuracy.length - 1]?.recall}%)`} stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>F1 Score: <strong>{D.f1Score}</strong></span>
            <span>Cluster Drift: <strong>{D.clusterDrift}</strong></span>
          </div>
        </div>

        {/* Card F: Case Status Pipeline / Funnel - col-span-6 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Investigation Pipeline & Recovery Funnel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Conversion of registered cyber complaints into asset recoveries
              </p>
            </div>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>

          {/* Funnel Progress Steps */}
          <div className="space-y-3 pt-3">
            {D.pipeline.map((step) => (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{step.count} cases</span>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono">({step.pct})</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-500`}
                    style={{ width: step.pct }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Average Resolution Time: <strong>{D.avgResolution}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{D.totalRecovered}</span>
          </div>
        </div>

        {/* Card G: Recent Activity Feed - col-span-6 */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Intelligence Feed
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time officer actions and AI trigger telemetry
              </p>
            </div>
            <button
              onClick={() => navigate('/alerts')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All Alerts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Activity Items */}
          <div className="space-y-3 pt-2">
            {RECENT_ACTIVITIES.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => openCaseModal(act.caseId)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 group"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${act.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition truncate">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {act.detail}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-900">
                        {act.caseId}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${act.tagColor}`}>
                        {act.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Automated telemetry from 32 police stations</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Modal (Pinterest Pin-Style Zoom View) */}
      {expandedCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {expandedCard === 'trend' ? 'Case Trend Analytics Deep Dive' : 'Fraud Classification Breakdown'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Detailed inspection mode with granular parameters
                </p>
              </div>
              <button
                onClick={() => setExpandedCard(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6">
              {expandedCard === 'trend' ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={D.caseTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
                      <XAxis dataKey="month" stroke={chartTheme.textColor} />
                      <YAxis stroke={chartTheme.textColor} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="registered" name="Registered Complaints" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="resolved" name="Resolved Cases" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={D.fraudType} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                          {D.fraudType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {D.fraudType.map((item) => (
                      <div key={item.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{item.amount}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{item.value}% share</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setExpandedCard(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
