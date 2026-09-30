import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Calendar,
  ChevronDown,
  UserCheck,
  AlertTriangle,
  FileCheck,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { SECURITY_METRICS } from '../data/mockData';

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState('Access Logs');

  const donutData = [
    { name: 'Normal', value: 92, color: '#2563EB' },
    { name: 'Warning', value: 5, color: '#F59E0B' },
    { name: 'Suspicious', value: 2, color: '#F97316' },
    { name: 'Critical', value: 1, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching Panel 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Security Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor access logs, security events and evidence integrity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => alert('Exporting SHA-256 tamper-evident security audit logs...')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards matching Panel 8 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Logins</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">
              {SECURITY_METRICS.totalLogins}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
              {SECURITY_METRICS.loginsTrend}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Failed Attempts</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">
              {SECURITY_METRICS.failedAttempts}
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
              Review
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Suspicious Activity</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">
              {SECURITY_METRICS.suspiciousActivity}
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
              Isolated
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Data Exports</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <div className="text-2xl font-bold text-slate-900">
              {SECURITY_METRICS.dataExports}
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
              Audited
            </span>
          </div>
        </div>
      </div>

      {/* Tabs matching Panel 8 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['Access Logs', 'Security Events', 'Evidence Integrity', 'API Usage'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Middle Row: User Access Activity Chart (Left) + Security Overview Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: User Access Activity Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                User Access Activity
              </h3>
              <p className="text-xs text-slate-500">
                Daily activity categorized by law enforcement roles
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
                <span className="text-slate-600 font-medium">Admin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
                <span className="text-slate-600 font-medium">Investigator</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
                <span className="text-slate-600 font-medium">Officer</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECURITY_METRICS.activityData} barSize={14}>
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Bar dataKey="Admin" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Investigator" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Officer" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Security Overview Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Security Overview
            </h3>
          </div>

          {/* Donut Chart with center label */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900">
                {SECURITY_METRICS.systemHealth}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                System Secure
              </span>
            </div>
          </div>

          {/* Donut Legend matching Panel 8 */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs pt-2">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Card: Recent Security Events Table matching Panel 8 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Recent Security Events
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            SHA-256 Hash Chain Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {SECURITY_METRICS.securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{log.user}</td>
                  <td className="py-3 px-4 text-slate-700">{log.action}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{log.ip}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${log.statusColor}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
