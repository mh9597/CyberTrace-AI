import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  UserCheck,
  CheckSquare,
  Square,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { MOCK_ALERTS } from '../data/mockData';
import { useCaseModal } from '../components/layout/Layout';

export default function Alerts() {
  const { openCaseModal } = useCaseModal();
  const [activeTab, setActiveTab] = useState('All Alerts');
  const [selectedAlert, setSelectedAlert] = useState(MOCK_ALERTS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All Risk Levels');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const tabs = [
    { name: 'All Alerts', count: 58 },
    { name: 'High Risk', count: 24 },
    { name: 'Under Review', count: 18 },
    { name: 'Resolved', count: 16 },
  ];

  const filteredAlerts = MOCK_ALERTS.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRisk =
      selectedRisk === 'All Risk Levels' || a.riskLevel === selectedRisk;

    const matchStatus =
      selectedStatus === 'All Status' || a.status === selectedStatus;

    return matchSearch && matchRisk && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching Panel 7 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Alerts & Investigation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Review AI-generated alerts and manage investigation workflow
        </p>
      </div>

      {/* Tabs matching Panel 7 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.name
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Filters Toolbar matching Panel 7 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by case, keyword, location..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option>All Risk Levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option>All Status</option>
            <option>Under Review</option>
            <option>Open</option>
            <option>Resolved</option>
          </select>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>01 Oct - 12 Oct</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Alerts List (Left) + Alert Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredAlerts.map((alert) => {
            const isSelected = selectedAlert.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`bg-white rounded-2xl border p-4 shadow-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                      {alert.id}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-slate-700">
                          Case: {alert.caseId}
                        </span>
                        <span>&bull;</span>
                        <span>{alert.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                      {alert.probability}%
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {alert.time}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md font-medium text-slate-600 bg-slate-100">
                    Status: <span className="font-bold text-slate-800">{alert.status}</span>
                  </span>
                  <span className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Alert Details Panel matching Panel 7 */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 font-mono">
                Alert Details
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedAlert.title}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
              High Risk
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-slate-500 block">Case ID</span>
              <button
                onClick={() => openCaseModal(selectedAlert.caseId)}
                className="font-mono font-bold text-blue-600 hover:underline"
              >
                {selectedAlert.caseId}
              </button>
            </div>
            <div>
              <span className="text-slate-500 block">Predicted Location</span>
              <span className="font-bold text-slate-900">{selectedAlert.location}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 block">Estimated Time Window</span>
              <span className="font-semibold text-slate-800">
                {selectedAlert.timeWindow}
              </span>
            </div>
          </div>

          {/* Mini Risk Heatmap / Satellite Preview Map */}
          <div>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
              Spatial Vector Radar
            </span>
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-44 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-slate-100" />
              <div className="absolute w-36 h-36 rounded-full border border-red-300 bg-red-100/30 flex items-center justify-center" />
              <div className="absolute w-24 h-24 rounded-full border border-red-400 bg-red-200/40 flex items-center justify-center" />
              <div className="relative z-10 text-center">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="inline-block mt-1 font-mono text-[9px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full font-bold">
                  23.0305° N, 72.5075° E
                </span>
              </div>
            </div>
          </div>

          {/* Supporting Evidence Checklist matching Panel 7 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Supporting Evidence
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Transaction data corroborated across multiple accounts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Related mule accounts activated within 48-hour window</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Historical pattern match: 94% similarity to Jamtara syndicate</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Map analysis: Proximity to high-density ATM clusters in Satellite</span>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Panel 7 */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => alert(`Marked ${selectedAlert.id} as Under Review`)}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition"
            >
              Mark as Under Review
            </button>
            <button
              onClick={() => alert(`Assigned ${selectedAlert.id} to Investigating Officer`)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              Assign to Officer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
