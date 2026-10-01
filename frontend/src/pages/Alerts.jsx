import React, { useState } from "react";
import {
  AlertTriangle, Search, Filter, Calendar, ChevronDown, Clock,
  MapPin, ShieldAlert, CheckCircle2, ArrowRight, Bell, Zap,
  UserCheck, FileText, Eye, TrendingUp, X, BarChart2,
} from "lucide-react";
import { MOCK_ALERTS } from "../data/mockData";
import { useCaseModal } from "../components/layout/Layout";

const INVESTIGATION_STAGES = [
  { id: 1, label: "Alert Raised", done: true },
  { id: 2, label: "Under Review", done: true },
  { id: 3, label: "FIR Filed", done: false },
  { id: 4, label: "Freeze Order", done: false },
  { id: 5, label: "Closed", done: false },
];

export default function Alerts() {
  const { openCaseModal } = useCaseModal();
  const [activeTab, setActiveTab] = useState("All Alerts");
  const [selectedAlert, setSelectedAlert] = useState(MOCK_ALERTS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("All Risk Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const tabs = [
    { name: "All Alerts", count: 58, color: "text-slate-600" },
    { name: "High Risk", count: 24, color: "text-red-600" },
    { name: "Under Review", count: 18, color: "text-amber-600" },
    { name: "Resolved", count: 16, color: "text-emerald-600" },
  ];

  const filteredAlerts = MOCK_ALERTS.filter(a => {
    const m = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.caseId.toLowerCase().includes(searchTerm.toLowerCase()) || a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const r = selectedRisk === "All Risk Levels" || a.riskLevel === selectedRisk;
    const s = selectedStatus === "All Status" || a.status === selectedStatus;
    return m && r && s;
  });

  const riskColor = (lvl) => lvl === "High" ? "bg-red-50 text-red-700 border-red-200" : lvl === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
  const statusColor = (s) => s === "Under Review" ? "bg-amber-50 text-amber-700 border-amber-200" : s === "Open" ? "bg-blue-50 text-blue-700 border-blue-200" : s === "Resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Alerts & Investigation</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-12">AI-generated alerts with investigation workflow management</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span>24 High Risk Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Alerts", value: "58", color: "text-slate-900 dark:text-white", bg: "bg-white dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" },
          { label: "High Risk", value: "24", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
          { label: "Under Review", value: "18", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
          { label: "Resolved", value: "16", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl border ${s.border} p-4 shadow-xs`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-3">
        {tabs.map(tab => (
          <button key={tab.name} onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.name ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
            {tab.name} <span className="ml-1 opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search alerts by case, keyword, location..."
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedRisk} onChange={e => setSelectedRisk(e.target.value)} className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer">
            {["All Risk Levels", "High", "Medium", "Low"].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer">
            {["All Status", "Under Review", "Open", "Resolved"].map(o => <option key={o}>{o}</option>)}
          </select>
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /><span>01 Oct - 12 Oct</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No alerts matching filters.</div>
          )}
          {filteredAlerts.map(alert => {
            const sel = selectedAlert.id === alert.id;
            return (
              <div key={alert.id} onClick={() => setSelectedAlert(alert)}
                className={`bg-white dark:bg-slate-800 rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${sel ? "border-blue-500 ring-2 ring-blue-500/10 shadow-sm" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${alert.riskLevel === "High" ? "bg-red-50 dark:bg-red-900/20" : "bg-amber-50 dark:bg-amber-900/20"}`}>
                      <ShieldAlert className={`w-4 h-4 ${alert.riskLevel === "High" ? "text-red-600" : "text-amber-600"}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{alert.title}</h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{alert.caseId}</span>
                        <span>·</span><span>{alert.location}</span>
                        <span>·</span><span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${riskColor(alert.riskLevel)}`}>{alert.probability}%</span>
                    <span className={`block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${statusColor(alert.status)}`}>{alert.status}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" /><span>{alert.timeWindow}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">Inspect <ArrowRight className="w-3 h-3" /></span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alert Details</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">{selectedAlert.title}</h3>
                <button onClick={() => openCaseModal(selectedAlert.caseId)} className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline mt-1 block">Case: {selectedAlert.caseId}</button>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${riskColor(selectedAlert.riskLevel)}`}>{selectedAlert.riskLevel} Risk</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {[
                { label: "Probability", value: `${selectedAlert.probability}%`, highlight: true },
                { label: "Location", value: selectedAlert.location },
                { label: "Status", value: selectedAlert.status },
                { label: "Reported", value: selectedAlert.time },
                { label: "Risk Level", value: selectedAlert.riskLevel },
                { label: "Case ID", value: selectedAlert.caseId, mono: true },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">{f.label}</p>
                  <p className={`font-bold text-slate-900 dark:text-white ${f.highlight ? "text-red-600 dark:text-red-400 text-sm" : ""} ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" /> Time Window & Location
              </h4>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{selectedAlert.timeWindow}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />{selectedAlert.location}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">Investigation Progress</h4>
              <div className="flex items-center gap-0">
                {INVESTIGATION_STAGES.map((stage, i) => (
                  <div key={stage.id} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${stage.done ? "bg-blue-600 border-blue-600 text-white" : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-400"}`}>
                        {stage.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.id}
                      </div>
                      <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-1 text-center w-16 leading-tight">{stage.label}</span>
                    </div>
                    {i < INVESTIGATION_STAGES.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-5 ${stage.done ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-600"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Supporting Evidence
              </h4>
              <div className="space-y-2">
                {(selectedAlert.evidence || ["Transaction data corroborated", "Related mule accounts activated", "Historical pattern match 94%", "ATM proximity cluster detected"]).map((ev, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{ev}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button onClick={() => alert(`Marked ${selectedAlert.id} as Under Review`)} className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition">
                Mark as Under Review
              </button>
              <button onClick={() => alert(`Assigned to officer`)} className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition">
                Assign to Officer
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/10 rounded-2xl border border-rose-200 dark:border-rose-800/50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">AI Recommendation</span>
            </div>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              Based on historical patterns, a <strong>Jamtara-style syndicate</strong> is likely to attempt cash withdrawal at <strong>{selectedAlert.location}</strong> during the predicted window. Recommend deploying plainclothes officers to nearby ATM clusters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}