import React, { useState } from 'react';
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
} from 'lucide-react';
import { MOCK_COMPLAINTS } from '../data/mockData';

export default function PredictionCenter() {
  const [activeTab, setActiveTab] = useState('New Prediction');
  const [selectedCaseId, setSelectedCaseId] = useState('CT-3026-002');
  const [isRunning, setIsRunning] = useState(false);
  const [probability, setProbability] = useState(82);

  const currentCase =
    MOCK_COMPLAINTS.find((c) => c.id === selectedCaseId) || MOCK_COMPLAINTS[1];

  const handleRunPrediction = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setProbability(82);
    }, 900);
  };

  const topLocations = [
    { city: 'Ahmedabad', percentage: 82, color: 'bg-red-500' },
    { city: 'Vadodara', percentage: 46, color: 'bg-orange-500' },
    { city: 'Surat', percentage: 38, color: 'bg-amber-500' },
    { city: 'Rajkot', percentage: 22, color: 'bg-blue-500' },
  ];

  const modelFeatures = [
    { name: 'Transaction Amount', value: 35, barColor: 'bg-blue-600' },
    { name: 'Location History', value: 28, barColor: 'bg-blue-500' },
    { name: 'Account Linkage', value: 18, barColor: 'bg-indigo-500' },
    { name: 'Transaction Frequency', value: 12, barColor: 'bg-purple-500' },
    { name: 'Time Pattern', value: 7, barColor: 'bg-cyan-500' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Prediction Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Run AI model to predict potential cash-out locations and time windows
        </p>
      </div>

      {/* Tabs matching Panel 4 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['New Prediction', 'Historical Predictions', 'Model Performance'].map((tab) => (
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

      {/* Three Top Cards Grid matching Panel 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Case Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Case Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Select Case ID</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {MOCK_COMPLAINTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.complainant} ({c.fraudType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Fraud Type</span>
                <span className="font-semibold text-slate-900">{currentCase.fraudType}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Amount</span>
                <span className="font-bold text-slate-900">{currentCase.amount}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Transaction Date</span>
                <span className="font-medium text-slate-800">{currentCase.date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleRunPrediction}
            disabled={isRunning}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Model...</span>
              </>
            ) : (
              <>
                <span>Run Prediction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Card 2: Prediction Result Card (Circular Probability Gauge) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 self-start">
            Prediction Result
          </h3>

          {/* Circular SVG Gauge matching Panel 4 */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="14"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="14"
                strokeDasharray={402}
                strokeDashoffset={402 - (402 * probability) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {probability}%
              </span>
              <span className="text-[11px] font-medium text-slate-500 mt-0.5">
                Cash-out Probability
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 inline-flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>HIGH RISK</span>
            </span>
          </div>
        </div>

        {/* Card 3: Estimated Time Window & Top Predicted Locations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Estimated Time Window
              </h3>
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-purple-900 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">12 Oct 2026</div>
                  <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>10:00 AM – 2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Top Predicted Locations
              </h3>
              <div className="space-y-2.5">
                {topLocations.map((loc) => (
                  <div key={loc.city} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${loc.color}`} />
                      <span>{loc.city}</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {loc.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Card: Model Explanation (Top Features) matching Panel 4 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Model Explanation (Top Features)
            </h3>
            <p className="text-xs text-slate-500">
              SHAP feature importance weighting for case {currentCase.id}
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-semibold">
            RF-XGBoost Ensemble
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {modelFeatures.map((feat) => (
            <div key={feat.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium truncate" title={feat.name}>
                  {feat.name}
                </span>
                <span className="font-bold text-slate-900">{feat.value}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${feat.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${feat.value * 2.2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
