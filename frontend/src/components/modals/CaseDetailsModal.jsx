import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  FileDown,
  UserCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../../data/mockData';

export default function CaseDetailsModal({ caseId = 'CT-3026-002', onClose }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [notes, setNotes] = useState(
    'Initial analysis indicates rapid UPI diversion through multi-tier mule accounts. Primary ATM withdrawal predicted in Satellite area.'
  );
  const [notesSaved, setNotesSaved] = useState(false);

  const caseData =
    MOCK_COMPLAINTS.find((c) => c.id === caseId) || MOCK_COMPLAINTS[1];

  const tabs = [
    'Overview',
    'Transactions',
    'Predictions',
    'Network',
    'Investigation',
    'Documents',
    'Timeline',
  ];

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Case Details</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {caseData.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Predictive cyber intelligence and money trail analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 overflow-x-auto text-xs font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Body Content (3 Columns matching Panel 9) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Case Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Case Information
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Case ID</span>
                <span className="font-semibold text-slate-900 font-mono">{caseData.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Complainant</span>
                <span className="font-semibold text-slate-900">{caseData.complainant}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Fraud Type</span>
                <span className="font-semibold text-slate-900">{caseData.fraudType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-slate-900">{caseData.amount}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Transaction Date</span>
                <span className="font-medium text-slate-800">{caseData.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 items-center">
                <span className="text-slate-500">Status</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {caseData.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 items-center">
                <span className="text-slate-500">Risk Level</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                  {caseData.riskLevel}
                </span>
              </div>
            </div>

            {/* Investigation Notes */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Investigation Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add investigation notes..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-800 bg-slate-50/50"
              />
              <button
                onClick={handleSaveNotes}
                className="mt-2 w-full py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                {notesSaved ? 'Notes Saved!' : 'Save Notes'}
              </button>
            </div>
          </div>

          {/* Column 2: Location Prediction */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Location Prediction
            </h3>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-52 flex items-center justify-center">
              {/* Concentric Heatmap Radar Simulation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-100" />
              <div className="absolute w-44 h-44 rounded-full border border-red-200/50 flex items-center justify-center animate-ping duration-1000 opacity-20" />
              <div className="absolute w-36 h-36 rounded-full border border-red-300/40 bg-red-100/30 flex items-center justify-center" />
              <div className="absolute w-24 h-24 rounded-full border border-red-400/60 bg-red-200/40 flex items-center justify-center" />
              <div className="relative z-10 text-center">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-md ring-4 ring-red-400/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="inline-block mt-2 font-mono text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full font-bold">
                  23.0305° N, 72.5075° E
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1 text-center">
              <h4 className="font-bold text-xs text-slate-900">
                {caseData.location || 'Ahmedabad - Satellite'}
              </h4>
              <p className="text-xs font-semibold text-red-600">
                {caseData.probability || 82}% probability
              </p>
              <p className="text-[11px] text-slate-500">
                {caseData.timeWindow || '12 Oct 2026, 10 AM - 2 PM'}
              </p>
            </div>
          </div>

          {/* Column 3: Model Insights & Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Model Insights
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Transaction Amount</span>
                  <span className="font-semibold text-slate-900">35%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Location History</span>
                  <span className="font-semibold text-slate-900">28%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Account Linkage</span>
                  <span className="font-semibold text-slate-900">18%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Time Pattern</span>
                  <span className="font-semibold text-slate-900">12%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Device Pattern</span>
                  <span className="font-semibold text-slate-900">7%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '7%' }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quick Actions
              </h4>
              <button
                onClick={() => alert(`Intelligence Dossier downloaded for ${caseData.id}`)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Generate Report</span>
              </button>
              <button
                onClick={() => alert(`Assigned to Sub-Inspector Cyber Cell Ahmedabad`)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Assign Officer</span>
              </button>
              <button
                onClick={() => alert(`Case ${caseData.id} marked as resolved.`)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-50 transition shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark as Resolved</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
