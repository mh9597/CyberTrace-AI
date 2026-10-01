import React, { useState, useRef, useEffect } from "react";
import {
  GitFork, Maximize2, ChevronDown, ShieldAlert, AlertTriangle,
  Lock, ArrowRight, Download, Filter, Eye, FileText,
  RefreshCw, Zap, TrendingUp, BarChart2, Clock, Search,
} from "lucide-react";
import { NETWORK_NODES, MOCK_COMPLAINTS } from "../data/mockData";

const ACCOUNT_TIMELINE = [
  { date: "12 Oct", label: "₹8,00,000 received", type: "credit", icon: "↓" },
  { date: "12 Oct", label: "₹4,00,000 split to A/c 778809", type: "debit", icon: "↑" },
  { date: "12 Oct", label: "₹2,40,000 to A/c 455666", type: "debit", icon: "↑" },
  { date: "11 Oct", label: "₹1,60,000 ATM withdrawal", type: "debit", icon: "↑" },
];

export default function TransactionNetwork() {
  const [selectedCase, setSelectedCase] = useState("CT-3026-002");
  const [selectedNode, setSelectedNode] = useState(NETWORK_NODES.center);
  const [searchTerm, setSearchTerm] = useState("");
  const cx = 360; const cy = 260;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow">
              <GitFork className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Transaction Network</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 ml-12">Visualize money trail, linked accounts and suspect nodes</p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs focus:outline-none cursor-pointer">
              {MOCK_COMPLAINTS.map(c => <option key={c.id} value={c.id}>Case: {c.id}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button onClick={() => alert("Expanded topology view")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition">
            <Maximize2 className="w-3.5 h-3.5" /><span>Expand Network</span>
          </button>
          <button onClick={() => alert("Exporting graph PDF...")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Accounts", value: "9", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Suspected Mules", value: "2", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Total Flow", value: "₹18.5L", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Network Depth", value: "Level 2", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Money Flow Graph</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Click any node to view account details</p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {[{ c: "bg-red-500", l: "Main Account" }, { c: "bg-blue-500", l: "Linked" }, { c: "bg-emerald-500", l: "Beneficiary" }, { c: "bg-orange-500", l: "Mule" }, { c: "bg-purple-500", l: "Related" }].map(i => (
                <div key={i.l} className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-full ${i.c}`} /><span className="text-slate-500 dark:text-slate-400">{i.l}</span></div>
              ))}
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-800 dark:to-slate-800" style={{ height: "520px" }}>
            <svg viewBox="0 0 720 520" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {["blue","purple","green","orange"].map(c => {
                  const fc = { blue: "#3B82F6", purple: "#8B5CF6", green: "#10B981", orange: "#F97316" }[c];
                  return <marker key={c} id={`arrow-${c}`} viewBox="0 0 10 10" refX="18" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={fc} /></marker>;
                })}
                <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
                </filter>
              </defs>
              <circle cx={cx} cy={cy} r="70" fill="url(#hubHalo)" className="animate-pulse" />
              {NETWORK_NODES.connected.map(node => {
                const rad = (node.angle * Math.PI) / 180;
                const nx = cx + node.dist * Math.cos(rad); const ny = cy + node.dist * Math.sin(rad);
                const mc = node.type === "Related Case" ? "purple" : node.type === "Beneficiary" ? "green" : node.type === "Suspected Mule" ? "orange" : "blue";
                return (
                  <g key={node.id}>
                    <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={node.color} strokeWidth="1.5" strokeDasharray="5 3" markerEnd={`url(#arrow-${mc})`} opacity="0.7" />
                  </g>
                );
              })}
              <g className="cursor-pointer" onClick={() => setSelectedNode(NETWORK_NODES.center)} filter="url(#shadow)">
                <circle cx={cx} cy={cy} r="42" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx={cx} cy={cy} r="52" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x={cx} y={cy - 10} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Main Account</text>
                <text x={cx} y={cy + 5} textAnchor="middle" fill="#FEE2E2" fontSize="9" fontFamily="monospace">A/c 112233</text>
                <text x={cx} y={cy + 18} textAnchor="middle" fill="#FEF08A" fontSize="8" fontWeight="bold">HIGH RISK</text>
              </g>
              {NETWORK_NODES.connected.map(node => {
                const rad = (node.angle * Math.PI) / 180;
                const nx = cx + node.dist * Math.cos(rad); const ny = cy + node.dist * Math.sin(rad);
                const sel = selectedNode.id === node.id;
                return (
                  <g key={node.id} className="cursor-pointer" filter="url(#shadow)"
                    onClick={() => setSelectedNode({ ...node, fullAccount: node.account + "XXXX", totalAmount: node.amount, transactions: 12, linkedCases: 1, risk: node.type === "Suspected Mule" ? "High" : "Medium" })}>
                    <circle cx={nx} cy={ny} r={sel ? 30 : 25} fill={node.color} stroke="#FFFFFF" strokeWidth={sel ? 3 : 2} />
                    {sel && <circle cx={nx} cy={ny} r="38" fill="none" stroke={node.color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />}
                    <text x={nx} y={ny - 2} textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">{node.account.replace("A/c ", "")}</text>
                    <text x={nx} y={ny + 10} textAnchor="middle" fill="#FFFFFF" fontSize="8">{node.amount}</text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-mono bg-white/80 dark:bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
              Graph Engine: NetworkX v3 - Topology depth 2
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Account Details</h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${selectedNode.risk === "High" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                {selectedNode.risk || "High"} Risk
              </span>
            </div>
            <div className="space-y-0 text-xs divide-y divide-slate-100 dark:divide-slate-700/50 mt-2">
              {[
                { label: "Account Number", value: selectedNode.fullAccount || selectedNode.account || "112233XXXX", mono: true },
                { label: "Account Type", value: selectedNode.type || "Savings" },
                { label: "Total Transactions", value: selectedNode.transactions || 42 },
                { label: "Total Amount", value: selectedNode.totalAmount || selectedNode.amount || "₹18,50,000", highlight: true },
                { label: "Linked Cases", value: selectedNode.linkedCases || 3 },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2.5">
                  <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                  <span className={`font-semibold text-right max-w-[160px] truncate ${row.highlight ? "text-blue-600 font-extrabold" : row.mono ? "font-mono text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200"}`}>
                    {String(row.value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 space-y-2">
              <button onClick={() => alert(`Freeze issued for ${selectedNode.fullAccount || selectedNode.account}`)} className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 text-xs font-bold transition">Freeze Account</button>
              <button onClick={() => alert("Flagged for STR/FIU audit")} className="w-full py-2.5 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-700 hover:bg-amber-50 text-xs font-semibold transition">Flag for Audit</button>
              <button onClick={() => alert("Opening transaction ledger")} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition">View Transactions</button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Transaction Timeline
            </h4>
            <div className="space-y-2.5">
              {ACCOUNT_TIMELINE.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${t.type === "credit" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{t.icon}</div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/10 rounded-2xl border border-violet-200 dark:border-violet-800/50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider">AI Network Analysis</span>
            </div>
            <p className="text-xs text-violet-700 dark:text-violet-300 leading-relaxed">
              Network topology suggests a <strong>Jamtara-pattern</strong> syndicate with 2 mule accounts activated within a 48-hour window. Recommend immediate freeze on nodes 4 and 5.
            </p>
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-violet-500">
              <TrendingUp className="w-3.5 h-3.5" /><span>Confidence: 91% - Model v2.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}