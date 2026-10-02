import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck, Lock, Download, Calendar, ChevronDown, UserCheck,
  AlertTriangle, FileCheck, Activity, CheckCircle2, Eye, Zap,
  TrendingUp, Shield, Key, Server, Clock, BarChart2, Users,
  Check, RefreshCw, AlertCircle, Search, UserX,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { SECURITY_METRICS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

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

const DEFAULT_USERS = [
  { id: 1, email: "investigator@cybertrace.gov.in", full_name: "Investigating Officer (Field IO)", role: "investigator", badge_number: "IO-DELHI-409", is_active: true, created_at: "2026-09-01T10:00:00Z" },
  { id: 2, email: "senior.officer@cybertrace.gov.in", full_name: "Superintendent Rajesh Nair", role: "senior_officer", badge_number: "CMD-HQ-102", is_active: true, created_at: "2026-08-15T09:30:00Z" },
  { id: 3, email: "admin@cybertrace.gov.in", full_name: "Chief Security Administrator", role: "admin", badge_number: "ADMIN-SEC-001", is_active: true, created_at: "2026-07-01T08:00:00Z" },
];

export default function SecurityCenter() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isSeniorOfficer = user?.role === "senior_officer";

  const [activeTab, setActiveTab] = useState("Access Logs");
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [usersList, setUsersList] = useState(DEFAULT_USERS);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userMsg, setUserMsg] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const currentMetrics = useMemo(() => {
    if (selectedRange === "Last 7 Days") {
      return {
        totalLogins: "1,024",
        loginsTrend: "+12%",
        failedAttempts: "18",
        suspiciousActivity: "6",
        dataExports: "58",
        systemHealth: "99.2%",
        activityData: [
          { date: "Oct 06", Admin: 20, Investigator: 52, Officer: 40 },
          { date: "Oct 07", Admin: 26, Investigator: 48, Officer: 45 },
          { date: "Oct 08", Admin: 19, Investigator: 60, Officer: 50 },
          { date: "Oct 09", Admin: 28, Investigator: 55, Officer: 48 },
          { date: "Oct 10", Admin: 24, Investigator: 64, Officer: 55 },
          { date: "Oct 11", Admin: 30, Investigator: 70, Officer: 60 },
          { date: "Oct 12", Admin: 34, Investigator: 78, Officer: 65 },
        ],
      };
    } else if (selectedRange === "Last 30 Days") {
      return {
        totalLogins: "4,680",
        loginsTrend: "+24%",
        failedAttempts: "74",
        suspiciousActivity: "22",
        dataExports: "248",
        systemHealth: "98.4%",
        activityData: [
          { date: "Week 1", Admin: 110, Investigator: 280, Officer: 210 },
          { date: "Week 2", Admin: 130, Investigator: 310, Officer: 240 },
          { date: "Week 3", Admin: 145, Investigator: 340, Officer: 270 },
          { date: "Week 4", Admin: 160, Investigator: 390, Officer: 310 },
        ],
      };
    } else {
      // All Time
      return {
        totalLogins: "28,450",
        loginsTrend: "+42%",
        failedAttempts: "386",
        suspiciousActivity: "118",
        dataExports: "1,420",
        systemHealth: "97.9%",
        activityData: [
          { date: "Q1 2026", Admin: 850, Investigator: 2400, Officer: 1800 },
          { date: "Q2 2026", Admin: 1100, Investigator: 3100, Officer: 2200 },
          { date: "Q3 2026", Admin: 1350, Investigator: 3800, Officer: 2700 },
          { date: "Q4 2026", Admin: 1420, Investigator: 4100, Officer: 2900 },
        ],
      };
    }
  }, [selectedRange]);

  const fetchUsers = async () => {
    if (!isAdmin) return;
    setLoadingUsers(true);
    try {
      const res = await api.get("/users");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.log("Using cached users list:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "User Governance" && isAdmin) {
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole });
      setUserMsg(`Officer role updated to ${newRole.toUpperCase()}`);
      setTimeout(() => setUserMsg(null), 3000);
    } catch (e) {
      console.error("Role update failed:", e);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = !currentStatus;
    setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: nextStatus } : u)));
    try {
      await api.patch(`/users/${userId}/status`, { is_active: nextStatus });
      setUserMsg(`User status updated to ${nextStatus ? "Active" : "Suspended"}`);
      setTimeout(() => setUserMsg(null), 3000);
    } catch (e) {
      console.error("Status update failed:", e);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    const term = userSearchTerm.toLowerCase();
    return (
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.badge_number && u.badge_number.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto select-none transition-colors duration-200">
      {/* Toast Notification */}
      {userMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{userMsg}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Security Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-12">
            Access logs, security events, evidence integrity and platform governance
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSeniorOfficer ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Supervisory Audit Mode (Read-Only)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>CISO Security Active</span>
            </div>
          )}

          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {["Last 7 Days", "Last 30 Days", "All Time"].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => alert("Exporting SHA-256 audit logs with cryptographic hash chain...")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Logins", value: currentMetrics.totalLogins, trend: currentMetrics.loginsTrend, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
          { label: "Failed Attempts", value: currentMetrics.failedAttempts, trend: "Review", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", trendColor: "text-red-600 bg-red-50 border-red-200" },
          { label: "Suspicious Events", value: currentMetrics.suspiciousActivity, trend: "Isolated", icon: Activity, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", trendColor: "text-amber-600 bg-amber-50 border-amber-200" },
          { label: "Data Exports", value: currentMetrics.dataExports, trend: "Audited", icon: FileCheck, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-900/20", trendColor: "text-cyan-600 bg-cyan-50 border-cyan-200" },
        ].map((s) => (
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

      {/* Tabs Row */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-3 overflow-x-auto no-scrollbar">
        {["Access Logs", "Security Events", "Evidence Integrity", "API Usage", ...(isAdmin ? ["User Governance"] : [])].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {tab === "User Governance" ? (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>User Governance (Admin)</span>
              </span>
            ) : (
              tab
            )}
          </button>
        ))}
      </div>

      {/* Conditional Content: User Governance vs Default Security Panels */}
      {activeTab === "User Governance" && isAdmin ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>User Roles & Credential Governance</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage investigator, supervisory command, and platform administrator privileges
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  placeholder="Search user, badge, email..."
                  className="bg-slate-50 dark:bg-slate-700 text-xs rounded-xl pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-56"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                title="Refresh user list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3 px-4">Officer / User</th>
                  <th className="py-3 px-4">Badge ID</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{u.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {u.badge_number || "IO-SEC-FIELD"}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border appearance-none cursor-pointer focus:outline-none ${
                          u.role === "investigator"
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            : u.role === "senior_officer"
                            ? "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                            : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        <option value="investigator">Investigator (Field IO)</option>
                        <option value="senior_officer">Senior Officer (Supervisory)</option>
                        <option value="admin">Admin (CISO / Governance)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {u.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.is_active)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          u.is_active
                            ? "border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            : "border-emerald-200 dark:border-emerald-800 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        }`}
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">User Access Activity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daily activity by law enforcement role</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {[{ c: "bg-blue-600", l: "Admin" }, { c: "bg-indigo-500", l: "Investigator" }, { c: "bg-cyan-500", l: "Officer" }].map((i) => (
                    <div key={i.l} className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-sm ${i.c}`} />
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{i.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentMetrics.activityData} barSize={12} barGap={2}>
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
                        {donutData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{currentMetrics.systemHealth}</span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">System Secure</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-700 mt-3">
                  {donutData.map((d) => (
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
                <span className="text-[11px] text-slate-400 font-mono bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-600">
                  SHA-256 Hash Chain Verified
                </span>
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
                    {SECURITY_METRICS.securityLogs.map((log) => (
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
                  {COMPLIANCE.map((c) => (
                    <div key={c.label} className={`${c.bg} border ${c.border} rounded-xl px-3 py-2.5 flex items-center justify-between`}>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                      <div className={`flex items-center gap-1 ${c.color} text-xs font-bold`}>
                        <c.icon className="w-3.5 h-3.5" />
                        {c.status}
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
                  <Clock className="w-3.5 h-3.5" />
                  <span>Last scan: 2 min ago</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Quick Actions</h4>
                {[
                  { label: "Force Logout All Sessions", icon: Lock, danger: true, adminOnly: true },
                  { label: "Download Evidence Package", icon: FileCheck, danger: false, adminOnly: false },
                  { label: "Rotate API Keys", icon: Key, danger: false, adminOnly: true },
                  { label: "Run Integrity Check", icon: Shield, danger: false, adminOnly: false },
                ].map((a) => {
                  const isBlocked = isSeniorOfficer && a.adminOnly;
                  return (
                    <button
                      key={a.label}
                      disabled={isBlocked}
                      onClick={() => alert(`${a.label}...`)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                        isBlocked
                          ? "border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
                          : a.danger
                          ? "border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                          : "border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <a.icon className="w-3.5 h-3.5 shrink-0" />
                        {a.label}
                      </span>
                      {isBlocked && (
                        <span className="text-[10px] text-slate-400 font-mono">Admin Only</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}