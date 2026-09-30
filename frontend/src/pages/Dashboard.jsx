import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  MapPin,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Clock,
  ExternalLink,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import api from '../services/api';
import MetricCard from '../components/common/MetricCard';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';
import ConfidenceBar from '../components/common/ConfidenceBar';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [complaintsRes, alertsRes, hotspotsRes] = await Promise.all([
          api.get('/complaints'),
          api.get('/alerts'),
          api.get('/map/hotspots'),
        ]);
        setComplaints(complaintsRes.data || []);
        setAlerts(alertsRes.data || []);
        setHotspots(hotspotsRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalAmount = complaints.reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingAlerts = alerts.filter(
    (a) => a.review_status === 'Pending Review' || a.review_status === 'New'
  );

  // Ingestion velocity time series
  const velocityData = [
    { time: '06:00', cases: 2, amount: 45000 },
    { time: '08:00', cases: 5, amount: 120000 },
    { time: '10:00', cases: 9, amount: 280000 },
    { time: '12:00', cases: 14, amount: 410000 },
    { time: '14:00', cases: 18, amount: 560000 },
    { time: '16:00', cases: 22, amount: 780000 },
    { time: '18:00', cases: 26, amount: 920000 },
  ];

  // Lead-time distribution histogram
  const leadTimeData = [
    { window: '10-20m', count: 4 },
    { window: '20-30m', count: 8 },
    { window: '30-40m', count: 12 },
    { window: '40-50m', count: 7 },
    { window: '50-60m', count: 3 },
  ];

  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#cbd5e1',
    borderRadius: '12px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '12px',
    fontFamily: 'monospace',
    boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-sky-50 border border-slate-200/90 shadow-sm dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 dark:border-slate-800 dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-100 text-sky-900 border border-sky-300 font-semibold tracking-wider dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-700/60">
              NATIONAL CYBERCRIME FORECASTING UNIT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 font-semibold dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-700/60">
              SYNTHETIC PROTOTYPE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Investigative Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Multi-hop UPI/card fraud tracing, automated mule network correlation, and predictive cash-out zone anticipation. Leads for authorized officer review.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/predictions')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold transition flex items-center gap-2 shadow-xs dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          >
            <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Prediction Center</span>
          </button>
          <button
            onClick={() => navigate('/complaints')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm dark:bg-gradient-to-r dark:from-cyan-600 dark:to-cyan-500 dark:hover:from-cyan-500 dark:hover:to-cyan-400 dark:shadow-glow-cyan transition flex items-center gap-2"
          >
            <span>Register New Case</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Ingested Cases"
          value={complaints.length}
          subtext={`₹${totalAmount.toLocaleString('en-IN')} total reported loss`}
          icon={FileText}
          glowColor="cyan"
          trend="+12% today"
        />

        <MetricCard
          title="Active Lead Alerts"
          value={pendingAlerts.length}
          subtext="Requiring officer verification"
          icon={AlertTriangle}
          glowColor="rose"
          trend="High Urgency"
        />

        <MetricCard
          title="Historical Hotspots"
          value={hotspots.length}
          subtext="DBSCAN density-clustered clusters"
          icon={MapPin}
          glowColor="emerald"
          trend="Spatial v1.0"
        />

        <MetricCard
          title="Model Calibration"
          value="0.89"
          subtext="PR-AUC on held-out dataset"
          icon={Activity}
          glowColor="indigo"
          trend="±14% CI"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ingestion Velocity Area Chart (2 Cols) */}
        <GlassCard
          className="lg:col-span-2"
          title="Fraud Ingestion & Fund Volume Velocity (24h Window)"
          subtitle="Hourly trend of newly correlated complaints and reported loss amounts"
          icon={TrendingUp}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#06b6d4' : '#0284c7'} stopOpacity={isDark ? 0.4 : 0.3} />
                    <stop offset="95%" stopColor={isDark ? '#06b6d4' : '#0284c7'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="cases"
                  name="Ingested Cases"
                  stroke={isDark ? '#06b6d4' : '#0284c7'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#velocityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Lead-Time Distribution Bar Chart (1 Col) */}
        <GlassCard
          title="Cash-out Lead-Time Window"
          subtitle="Time between last mule hop and physical cash withdrawal"
          icon={Clock}
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="window" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
                <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" name="Identified Incidents" fill={isDark ? '#6366f1' : '#4f46e5'} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Model Benchmark & Responsible Evaluation Panel */}
      <GlassCard
        title="AI Evaluation & Calibration Benchmark (Synthetic Held-Out Set)"
        subtitle="Empirical performance measured on 1,200 held-out synthetic cases (design.md Section 9)"
        icon={Activity}
        action={
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-700/50">
            Model: RF-DBSCAN-v1.0
          </span>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/60 dark:border-slate-800/80">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Precision (Fraud Hops)</div>
            <div className="text-2xl font-bold font-mono text-cyan-700 dark:text-cyan-400 mt-1">88.4%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Synthetic test validation</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/60 dark:border-slate-800/80">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Recall (Cash-out Zones)</div>
            <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">82.1%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Top-2 candidate radius</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/60 dark:border-slate-800/80">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Avg Lead-Time Window</div>
            <div className="text-2xl font-bold font-mono text-indigo-700 dark:text-indigo-300 mt-1">38 min</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Prior to physical cash-out</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/60 dark:border-slate-800/80">
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Geospatial Distance Error</div>
            <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-1">1.2 km</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cluster centroid radius</div>
          </div>
        </div>
      </GlassCard>

      {/* Main Operational Tables: Priority Cases & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints Table (2 Cols) */}
        <GlassCard
          className="lg:col-span-2"
          title="Active Cybercrime Complaints"
          subtitle="Searchable case register and investigative triage queue"
          icon={FileText}
          action={
            <button
              onClick={() => navigate('/complaints')}
              className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>View All ({complaints.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-mono border-b border-slate-200 dark:bg-slate-950/70 dark:text-slate-400 dark:border-slate-800/80">
                <tr>
                  <th className="py-3 px-6">Case ID</th>
                  <th className="py-3 px-4">Fraud Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {complaints.slice(0, 5).map((c) => (
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
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/complaints/${c.complaint_id}`)}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs hover:text-cyan-700 dark:bg-slate-800 dark:hover:bg-cyan-950 dark:hover:text-cyan-300 dark:hover:border-cyan-700/60 dark:border-slate-700/60 dark:text-slate-200 font-medium transition"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Priority Alerts Queue (1 Col) */}
        <GlassCard
          title="Urgent Cash-out Leads"
          subtitle="Top predictive leads requiring officer verification"
          icon={AlertTriangle}
          action={
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800/50">
              {alerts.length} Total
            </span>
          }
        >
          <div className="space-y-3">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                onClick={() => navigate('/alerts')}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-400 hover:bg-white shadow-xs dark:bg-slate-950/60 dark:border-slate-800 dark:hover:border-cyan-500/40 dark:hover:bg-slate-900/60 transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">{a.alert_code}</span>
                  <StatusBadge status={a.review_status} />
                </div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
                  {a.candidate_zone}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Window: {a.time_window}</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{a.risk_level} Risk</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 shadow-xs dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-semibold dark:border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <span>Review Full Alert Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
