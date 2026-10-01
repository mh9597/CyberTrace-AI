import React, { useState } from "react";
import {
  ShieldCheck, Lock, Download, Calendar, ChevronDown, UserCheck,
  AlertTriangle, FileCheck, Activity, CheckCircle2, Eye, Zap,
  TrendingUp, Shield, Key, Server, Clock, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { SECURITY_METRICS } from "../data/mockData";

const THREAT_DATA = [
  { month: "Jul", threats: 3, blocked: 3 },
  { month: "Aug", threats: 7, blocked: 6 },
  { month: "Sep", threats: 12, blocked: 11 },
  { month: "Oct", threats: 6, blocked: 6 },
];

const COMPLIANCE = [
  { label: "IT Act 2000", status: "Compliant", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  { label: "DPDP Act 2023", status: "Compliant", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  { label: "MHA Guidelines", status: "Compliant", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
  { label: "Evidence Integrity", status: "Verified", icon: Shield, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
];

const donutData = [
  { name: "Normal", value: 92, color: "#2563EB" },
  { name: "Warning", value: 5, color: "#F59E0B" },
  { name: "Suspicious", value: 2, color: "#F97316" },
  { name: "Critical", value: 1, color: "#EF4444" },
];

export default function SecurityCenter() {
  const [activeTab, setActiveTab] = useState("Access Logs");

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Security Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-12">Access logs, security events, evidence integrity and compliance</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /><span>System Secure</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
              {["Last 7 Days", "Last 30 Days", "All Time"].map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={() => alert("Exporting SHA-256 audit logs...")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer">
            <Download className="w-3.5 h-3.5 text-blue-600" /><span>Export Logs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Logins", value: SECURITY_METRICS.totalLogins, trend: SECURITY_METRICS.loginsTrend, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "Failed Attempts", value: SECURITY_METRICS.failedAttempts, trend: "Review", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", trendColor: "text-red-600 bg-red-50 border-red-200" },
          { label: "Suspicious Events", value: SECURITY_METRICS.suspiciousActivity, trend: "Isolated", icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", trendColor: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Data Exports", value: SECURITY_METRICS.dataExports, trend: "Audited", icon: FileCheck, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20", trendColor: "text-cyan-600 bg-cyan-50 border-cyan-200" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.trendColor}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-3 overflow-x-auto no-scrollbar">
        {["Access Logs", "Security Events", "Evidence Integrity", "API Usage"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${activeTab === tab ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">User Access Activity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily activity by law enforcement role</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {[{ c: "bg-blue-600", l: "Admin" }, { c: "bg-indigo-500", l: "Investigator" }, { c: "bg-cyan-500", l: "Officer" }].map(i => (
                <div key={i.l} className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-sm ${i.c}`} /><span className="text-slate-600 dark:text-slate-400 font-medium">{i.l}</span></div>
              ))}
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECURITY_METRICS.activityData} barSize={12} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} />
                <Bar dataKey="Admin" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Investigator" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Officer" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Security Overview</h3>
            <div className="relative w-44 h-44 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={55} outerRadius={72} paddingAngle={3} dataKey="value">
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{SECURITY_METRICS.systemHealth}</span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">System Secure</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-700 mt-3">
              {donutData.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" /> Threat Blocks
            </h4>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={THREAT_DATA} barSize={10} barGap={1}>
                  <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "10px", fontSize: "11px" }} />
                  <Bar dataKey="threats" fill="#FCA5A5" radius={[4, 4, 0, 0]} name="Threats" />
                  <Bar dataKey="blocked" fill="#6EE7B7" radius={[4, 4, 0, 0]} name="Blocked" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Security Events</h3>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600">SHA-256 Hash Chain Verified</span>
          </div>
          <div className="overflow-x-auto -mx-0.5">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                {SECURITY_METRICS.securityLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{log.user}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{log.action}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">{log.ip}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${log.statusColor}`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Compliance Status</h4>
            <div className="space-y-2">
              {COMPLIANCE.map(c => (
                <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl px-3 py-2.5 flex items-center justify-between`}>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                  <div className={`flex items-center gap-1 ${c.color} text-xs font-bold`}>
                    <c.icon className="w-3.5 h-3.5" />{c.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Security Posture AI</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              All systems operating within <strong>normal parameters</strong>. 18 failed login attempts detected from Rajkot — potential brute force. Auto-blocked at firewall. No data exfiltration detected.
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-600">
              <Clock className="w-3.5 h-3.5" /><span>Last scan: 2 min ago</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Quick Actions</h4>
            {[
              { label: "Force Logout All Sessions", icon: Lock, danger: true },
              { label: "Download Evidence Package", icon: FileCheck, danger: false },
              { label: "Rotate API Keys", icon: Key, danger: false },
              { label: "Run Integrity Check", icon: Shield, danger: false },
            ].map(a => (
              <button key={a.label} onClick={() => alert(`${a.label}...`)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${a.danger ? "border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"}`}>
                <a.icon className="w-3.5 h-3.5 shrink-0" />{a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}