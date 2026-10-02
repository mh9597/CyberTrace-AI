import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Search, Filter, Calendar, ChevronDown, Clock,
  MapPin, ShieldAlert, CheckCircle2, ArrowRight, Bell, Zap,
  UserCheck, FileText, Eye, TrendingUp, X, BarChart2, Plus,
  Send, RefreshCw, Lock, ShieldCheck, Download, AlertCircle
} from "lucide-react";
import { MOCK_ALERTS } from "../data/mockData";
import { useCaseModal } from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { can, PERMISSIONS } from "../utils/permissions";
import api from "../services/api";

const STAGES = [
  { id: 1, label: "Alert Raised", key: "Alert Raised" },
  { id: 2, label: "Under Review", key: "Under Review" },
  { id: 3, label: "FIR Filed", key: "FIR Filed" },
  { id: 4, label: "Freeze Order", key: "Freeze Order" },
  { id: 5, label: "Closed", key: "Closed" },
];

const OFFICERS = [
  "Sub-Inspector Ananya Rao",
  "Superintendent Rajesh Nair",
  "Chief Inspector Vikram Sharma",
  "Duty Cyber Officer",
];

export default function Alerts() {
  const { openCaseModal } = useCaseModal();
  const { user } = useAuth();
  const canAuthorizeAlerts = can(user, PERMISSIONS.AUTHORIZE_HIGH_RISK_ACTION);
  const canAssignOfficers = can(user, PERMISSIONS.ASSIGN_IO);

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Alerts");
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("All Risk Levels");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [newNote, setNewNote] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showOfficerDropdown, setShowOfficerDropdown] = useState(false);

  // 1. Fetch live alerts with fallback to mock data
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/alerts");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Normalize backend alerts
        const backendAlerts = res.data.map((item) => ({
          id: item.id || `AL-${item.id}`,
          backendId: item.id,
          title: item.decision_notes?.split("\n")[0] || `${item.risk_level} Risk Cash-out Alert`,
          caseId: item.complaint_id ? `CT-2026-00${item.complaint_id}` : "CT-2026-001",
          location: item.candidate_zone || "Janpath & Outer Circle ATM Cluster",
          probability: item.risk_level === "High" ? 88 : item.risk_level === "Medium" ? 72 : 55,
          time: new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: item.review_status === "Pending Review" ? "Under Review" : item.review_status || "Open",
          riskLevel: item.risk_level || "High",
          timeWindow: item.time_window || "Immediate Window",
          evidence: ["Transaction velocity spike", "ATM proximity cluster match", "Multi-tier mule account trail"],
          assignedOfficer: item.assigned_officer_name || "Sub-Inspector Ananya Rao",
          decisionNotes: item.decision_notes || "",
          stage: item.review_status === "Action Taken" || item.review_status === "Closed" || item.review_status === "Resolved" ? 5 : item.review_status === "Verified Lead" ? 3 : 2,
        }));

        // Merge with mock alerts ensuring unique IDs
        const combined = [...backendAlerts];
        MOCK_ALERTS.forEach((mock) => {
          if (!combined.some((c) => c.caseId === mock.caseId)) {
            combined.push({
              ...mock,
              backendId: null,
              assignedOfficer: "Sub-Inspector Ananya Rao",
              decisionNotes: mock.evidence ? mock.evidence.join(" | ") : "",
              stage: mock.status === "Resolved" ? 5 : mock.status === "Under Review" ? 2 : 1,
            });
          }
        });
        setAlerts(combined);
        if (!selectedAlertId && combined.length > 0) {
          setSelectedAlertId(combined[0].id);
        }
      } else {
        // Fallback to formatted MOCK_ALERTS
        const formatted = MOCK_ALERTS.map((mock) => ({
          ...mock,
          backendId: null,
          assignedOfficer: "Sub-Inspector Ananya Rao",
          decisionNotes: mock.evidence ? mock.evidence.join(" | ") : "",
          stage: mock.status === "Resolved" ? 5 : mock.status === "Under Review" ? 2 : 1,
        }));
        setAlerts(formatted);
        if (!selectedAlertId && formatted.length > 0) {
          setSelectedAlertId(formatted[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch alerts from backend, using synthetic mock dataset:", err);
      const formatted = MOCK_ALERTS.map((mock) => ({
        ...mock,
        backendId: null,
        assignedOfficer: "Sub-Inspector Ananya Rao",
        decisionNotes: mock.evidence ? mock.evidence.join(" | ") : "",
        stage: mock.status === "Resolved" ? 5 : mock.status === "Under Review" ? 2 : 1,
      }));
      setAlerts(formatted);
      if (!selectedAlertId && formatted.length > 0) {
        setSelectedAlertId(formatted[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0] || MOCK_ALERTS[0];

  // Dynamic tab counts
  const tabCounts = useMemo(() => {
    return {
      all: alerts.length,
      highRisk: alerts.filter((a) => a.riskLevel === "High").length,
      underReview: alerts.filter((a) => a.status === "Under Review" || a.status === "Pending Review").length,
      resolved: alerts.filter((a) => a.status === "Resolved" || a.status === "Closed" || a.stage === 5).length,
    };
  }, [alerts]);

  const tabs = [
    { name: "All Alerts", count: tabCounts.all },
    { name: "High Risk", count: tabCounts.highRisk },
    { name: "Under Review", count: tabCounts.underReview },
    { name: "Resolved", count: tabCounts.resolved },
  ];

  // Filtering alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRisk = selectedRisk === "All Risk Levels" || a.riskLevel === selectedRisk;
      const matchStatus = selectedStatus === "All Status" || a.status === selectedStatus;

      let matchTab = true;
      if (activeTab === "High Risk") {
        matchTab = a.riskLevel === "High";
      } else if (activeTab === "Under Review") {
        matchTab = a.status === "Under Review" || a.status === "Pending Review";
      } else if (activeTab === "Resolved") {
        matchTab = a.status === "Resolved" || a.status === "Closed" || a.stage === 5;
      }

      return matchSearch && matchRisk && matchStatus && matchTab;
    });
  }, [alerts, searchTerm, selectedRisk, selectedStatus, activeTab]);

  // Update Alert Status and Stage
  const handleStageChange = async (targetStageId) => {
    if (!selectedAlert) return;
    const targetStage = STAGES.find((s) => s.id === targetStageId);
    if (!targetStage) return;

    let newStatus = targetStage.label;
    if (targetStageId === 5) newStatus = "Resolved";
    else if (targetStageId === 1) newStatus = "Open";

    // Optimistic UI update
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? { ...a, stage: targetStageId, status: newStatus }
          : a
      )
    );

    // Sync to backend if backend ID exists
    if (selectedAlert.backendId) {
      try {
        await api.patch(`/alerts/${selectedAlert.backendId}`, {
          review_status: newStatus,
          decision_notes: `Investigation stage advanced to [${targetStage.label}]`,
        });
      } catch (e) {
        console.error("Backend sync error:", e);
      }
    }

    showNotification(`Investigation advanced to: ${targetStage.label}`);
  };

  const handleAssignOfficer = async (officerName) => {
    if (!selectedAlert) return;
    setShowOfficerDropdown(false);

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id ? { ...a, assignedOfficer: officerName } : a
      )
    );

    if (selectedAlert.backendId) {
      try {
        await api.patch(`/alerts/${selectedAlert.backendId}`, {
          review_status: selectedAlert.status || "Under Review",
          assigned_officer_name: officerName,
        });
      } catch (e) {
        console.error("Backend officer update error:", e);
      }
    }

    showNotification(`Assigned case lead to ${officerName}`);
  };

  const handleDraftNotice = async () => {
    if (!selectedAlert) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const noteEntry = `[${timestamp} by ${user?.name || "Investigator"}]: Prepared Section 91 CrPC freeze requisition for mule account trail. Submitted for supervisory authorization.`;

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              decisionNotes: a.decisionNotes ? `${a.decisionNotes}\n${noteEntry}` : noteEntry,
              status: "Under Review",
            }
          : a
      )
    );

    if (selectedAlert.backendId) {
      try {
        await api.patch(`/alerts/${selectedAlert.backendId}`, {
          decision_notes: `[INVESTIGATOR REQUISITION]: Section 91 CrPC freeze requisition prepared. Awaiting supervisory command sign-off.`,
          review_status: "Under Review",
        });
      } catch (e) {
        console.error("Backend draft notice error:", e);
      }
    }

    showNotification("Section 91 Freeze Requisition drafted and flagged for Supervisory Command.");
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedAlert) return;

    setIsSubmittingNote(true);
    const noteText = newNote.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const noteEntry = `[${timestamp} by ${selectedAlert.assignedOfficer || "Investigator"}]: ${noteText}`;

    // Optimistic UI Update
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              decisionNotes: a.decisionNotes ? `${a.decisionNotes}\n${noteEntry}` : noteEntry,
            }
          : a
      )
    );
    setNewNote("");

    if (selectedAlert.backendId) {
      try {
        await api.post(`/alerts/${selectedAlert.backendId}/notes`, { note: noteText });
      } catch (err) {
        console.error("Failed to append note to backend:", err);
      }
    }

    setIsSubmittingNote(false);
    showNotification("Investigation note appended successfully.");
  };

  const showNotification = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const riskColor = (lvl) =>
    lvl === "High"
      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
      : lvl === "Medium"
      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";

  const statusColor = (s) =>
    s === "Under Review" || s === "Pending Review"
      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      : s === "Open"
      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      : s === "Resolved" || s === "Closed"
      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600";

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-8">
      {/* Status toast banner */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Alerts & Investigation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-11">
            Predictive AI threat detection, money mule cash-out perimeter alerts, and case intervention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-500" : ""}`} />
            <span>Refresh</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{tabCounts.highRisk} High Risk Active</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Active Alerts", value: tabCounts.all, color: "text-slate-900 dark:text-white", bg: "bg-white dark:bg-slate-800", border: "border-slate-200 dark:border-slate-700" },
          { label: "High Risk Cash-outs", value: tabCounts.highRisk, color: "text-red-600 dark:text-red-400", bg: "bg-red-50/50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
          { label: "Under LEA Review", value: tabCounts.underReview, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50/50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800" },
          { label: "Intervened / Resolved", value: tabCounts.resolved, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50/50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl border ${s.border} p-4 shadow-xs`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.name
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            {tab.name} <span className="ml-1 opacity-80">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by case ID, zone, keyword, ATM..."
            className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            {["All Risk Levels", "High", "Medium", "Low"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            {["All Status", "Under Review", "Open", "Resolved"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Active Operational Cycle</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Alert List (Left) + Detailed Investigation Workbench (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredAlerts.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
              No active alerts matching the selected filters.
            </div>
          )}
          {filteredAlerts.map((alert) => {
            const isSelected = selectedAlert && selectedAlert.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlertId(alert.id)}
                className={`bg-white dark:bg-slate-800 rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/10 dark:bg-blue-900/10"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        alert.riskLevel === "High"
                          ? "bg-red-50 dark:bg-red-900/30 text-red-600"
                          : "bg-amber-50 dark:bg-amber-900/30 text-amber-600"
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {alert.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {alert.caseId}
                        </span>
                        <span>·</span>
                        <span className="truncate max-w-[130px]">{alert.location}</span>
                        <span>·</span>
                        <span>{alert.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${riskColor(alert.riskLevel)}`}>
                      {alert.probability}% Prob
                    </span>
                    <span className={`block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${statusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{alert.timeWindow}</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                    Investigate <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Interactive Investigation Workbench */}
        {selectedAlert && (
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-5">
              {/* Alert Header & Action Banner */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-700 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Alert Dossier & Intervention
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {selectedAlert.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => openCaseModal(selectedAlert.caseId)}
                      className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Case: {selectedAlert.caseId} <Eye className="w-3 h-3" />
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Officer: <strong className="text-slate-700 dark:text-slate-200">{selectedAlert.assignedOfficer || "Unassigned"}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${riskColor(selectedAlert.riskLevel)}`}>
                    {selectedAlert.riskLevel} Risk
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor(selectedAlert.status)}`}>
                    {selectedAlert.status}
                  </span>
                </div>
              </div>

              {/* Key Metadata Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { label: "Withdrawal Prob", value: `${selectedAlert.probability}%`, highlight: true },
                  { label: "Target Zone", value: selectedAlert.location },
                  { label: "Review Status", value: selectedAlert.status },
                  { label: "Time Window", value: selectedAlert.timeWindow },
                  { label: "Assigned Lead", value: selectedAlert.assignedOfficer || "Duty Officer" },
                  { label: "Case ID", value: selectedAlert.caseId, mono: true },
                ].map((f) => (
                  <div key={f.label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                      {f.label}
                    </p>
                    <p className={`font-bold text-slate-900 dark:text-white truncate ${f.highlight ? "text-red-600 dark:text-red-400 text-sm" : ""} ${f.mono ? "font-mono" : ""}`}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* 5-Stage Investigation Progress Tracker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Investigation Workflow Stage
                  </h4>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    Click stage to advance
                  </span>
                </div>
                <div className="flex items-center gap-0 p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
                  {STAGES.map((stage, i) => {
                    const isDone = (selectedAlert.stage || 1) >= stage.id;
                    const isCurrent = (selectedAlert.stage || 1) === stage.id;
                    return (
                      <div key={stage.id} className="flex items-center flex-1 min-w-0">
                        <button
                          onClick={() => handleStageChange(stage.id)}
                          className="flex flex-col items-center group cursor-pointer focus:outline-none"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              isDone
                                ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                : isCurrent
                                ? "bg-amber-500 border-amber-500 text-white shadow-xs ring-2 ring-amber-400/30"
                                : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400 hover:border-blue-400"
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : stage.id}
                          </div>
                          <span
                            className={`text-[9px] font-semibold mt-1 text-center w-14 leading-tight truncate transition-colors ${
                              isCurrent
                                ? "text-blue-600 dark:text-blue-400 font-bold"
                                : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {stage.label}
                          </span>
                        </button>
                        {i < STAGES.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mb-4 mx-1 transition-all ${
                              (selectedAlert.stage || 1) > stage.id
                                ? "bg-blue-600"
                                : "bg-slate-200 dark:bg-slate-600"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Supporting Evidence List */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Corroborated Forensic Evidence
                </h4>
                <div className="space-y-1.5">
                  {(selectedAlert.evidence || ["Transaction data corroborated", "Related mule accounts activated", "Historical pattern match 94%", "ATM proximity cluster detected"]).map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs bg-slate-50/70 dark:bg-slate-700/30 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{ev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investigation Activity Log & Notes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" /> Case Activity Log & Case Notes
                </h4>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 border border-slate-200 dark:border-slate-600 max-h-36 overflow-y-auto space-y-1.5 text-xs">
                  {selectedAlert.decisionNotes ? (
                    selectedAlert.decisionNotes.split("\n").map((noteLine, idx) => (
                      <p key={idx} className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                        {noteLine}
                      </p>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">No formal decision notes recorded yet.</p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add operational update / dispatch note..."
                    className="flex-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !newNote.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </form>
              </div>              {/* Action Buttons & Officer Assignment */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2.5 relative">
                <button
                  onClick={() => handleStageChange(2)}
                  className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold transition cursor-pointer"
                >
                  Mark Under Review
                </button>

                {canAuthorizeAlerts ? (
                  <button
                    onClick={() => handleStageChange(4)}
                    className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize Freeze Order</span>
                  </button>
                ) : (
                  <button
                    onClick={handleDraftNotice}
                    className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Draft Section 91 CrPC requisition for Senior Officer authorization"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Draft Sec 91 Notice</span>
                  </button>
                )}

                {canAssignOfficers && (
                  <div className="relative">
                    <button
                      onClick={() => setShowOfficerDropdown(!showOfficerDropdown)}
                      className="py-2.5 px-3.5 rounded-xl bg-slate-900 text-white dark:bg-slate-700 dark:text-white hover:bg-slate-800 text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign Lead</span>
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>

                    {showOfficerDropdown && (
                      <div className="absolute right-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-1.5 z-30 space-y-1 text-xs animate-in fade-in duration-150">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                          Assign Officer
                        </div>
                        {OFFICERS.map((officer) => (
                          <button
                            key={officer}
                            onClick={() => handleAssignOfficer(officer)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                              selectedAlert.assignedOfficer === officer
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            {officer}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {canAuthorizeAlerts && (
                  <button
                    onClick={() => handleStageChange(5)}
                    className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Resolve & Close</span>
                  </button>
                )}
              </div>

              {!canAuthorizeAlerts && (
                <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Field IO Mode: Freezes & Lead Reassignments require Supervisory Authorization.</span>
                </div>
              )}
            </div>

            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/10 rounded-2xl border border-rose-200 dark:border-rose-800/50 p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                  AI Tactical Recommendation (Probabilistic Lead)
                </span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                Based on money mule graph velocity and spatial clustering, cash withdrawal is forecast at <strong>{selectedAlert.location}</strong> during <strong>{selectedAlert.timeWindow}</strong>. Plainclothes patrol unit deployment to nearby ATM perimeters recommended under Section 91 CrPC.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}