import React, { useState } from 'react';
import {
  GitFork,
  Maximize2,
  ChevronDown,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  Download,
  Filter,
  Eye,
  FileText,
} from 'lucide-react';
import { NETWORK_NODES, MOCK_COMPLAINTS } from '../data/mockData';

export default function TransactionNetwork() {
  const [selectedCase, setSelectedCase] = useState('CT-3026-002');
  const [selectedNode, setSelectedNode] = useState(NETWORK_NODES.center);

  // Center coordinate of canvas
  const cx = 350;
  const cy = 250;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching Panel 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Transaction Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visualize money trail and linked accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              {MOCK_COMPLAINTS.map((c) => (
                <option key={c.id} value={c.id}>
                  Case: {c.id}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => alert('Expanded network topology view')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expand Network</span>
          </button>
        </div>
      </div>

      {/* Main Area: Canvas (Left 75%) + Account Details Panel (Right 25%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Network Canvas */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between min-h-[560px] relative overflow-hidden">
          {/* SVG Graph Canvas */}
          <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-50/50 to-white rounded-xl border border-slate-100 flex items-center justify-center">
            <svg
              viewBox="0 0 700 500"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrow-blue"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3B82F6" />
                </marker>
                <marker
                  id="arrow-purple"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#8B5CF6" />
                </marker>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                </marker>
                <marker
                  id="arrow-orange"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#F97316" />
                </marker>

                {/* Pulsing Aura for Hub */}
                <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#EF4444" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Hub Outer Pulsing Circle */}
              <circle cx={cx} cy={cy} r="65" fill="url(#hubHalo)" className="animate-pulse" />

              {/* Connecting Lines with Directional Arrows */}
              {NETWORK_NODES.connected.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const nx = cx + node.dist * Math.cos(rad);
                const ny = cy + node.dist * Math.sin(rad);

                let marker = 'url(#arrow-blue)';
                if (node.type === 'Related Case') marker = 'url(#arrow-purple)';
                if (node.type === 'Beneficiary') marker = 'url(#arrow-green)';
                if (node.type === 'Suspected Mule') marker = 'url(#arrow-orange)';

                return (
                  <g key={node.id}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={nx}
                      y2={ny}
                      stroke={node.color}
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      markerEnd={marker}
                    />
                  </g>
                );
              })}

              {/* CENTER HUB NODE: Main Account matching Panel 6 */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedNode(NETWORK_NODES.center)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r="40"
                  fill="#DC2626"
                  className="transition-transform group-hover:scale-105"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                <circle cx={cx} cy={cy} r="48" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Main Account
                </text>
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fill="#FEE2E2"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  A/c 112233
                </text>
                <text
                  x={cx}
                  y={cy + 18}
                  textAnchor="middle"
                  fill="#FEF08A"
                  fontSize="8"
                  fontWeight="bold"
                >
                  Risk: High
                </text>
              </g>

              {/* RADIATING NODES matching Panel 6 */}
              {NETWORK_NODES.connected.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const nx = cx + node.dist * Math.cos(rad);
                const ny = cy + node.dist * Math.sin(rad);

                const isSelected = selectedNode.id === node.id;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() =>
                      setSelectedNode({
                        ...node,
                        fullAccount: `${node.account}XXXX`,
                        totalAmount: node.amount,
                        transactions: 12,
                        linkedCases: 1,
                        risk: node.type === 'Suspected Mule' ? 'High' : 'Medium',
                      })
                    }
                  >
                    <circle
                      cx={nx}
                      cy={ny}
                      r={isSelected ? 30 : 25}
                      fill={node.color}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                      className="transition-all group-hover:scale-110 shadow-sm"
                    />
                    <text
                      x={nx}
                      y={ny - 3}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.account.replace('A/c ', '')}
                    </text>
                    <text
                      x={nx}
                      y={ny + 9}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="8"
                      fontWeight="medium"
                    >
                      {node.amount}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Legend matching Panel 6 */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="font-medium">Main Account</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="font-medium">Linked Account</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="font-medium">Beneficiary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="font-medium">Suspected Mule</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="font-medium">Related Case</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Graph Engine: NetworkX • Topology depth 2
            </span>
          </div>
        </div>

        {/* Right Panel: Account Details matching Panel 6 */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Account Details
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {selectedNode.type || 'Main Account'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Account Number</span>
              <span className="font-mono font-bold text-slate-900">
                {selectedNode.fullAccount || selectedNode.account || '112233XXXX'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Transactions</span>
              <span className="font-bold text-slate-900">
                {selectedNode.transactions || 42}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Total Amount</span>
              <span className="font-extrabold text-blue-600 text-sm">
                {selectedNode.totalAmount || selectedNode.amount || '₹18,50,000'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Linked Cases</span>
              <span className="font-bold text-slate-900">
                {selectedNode.linkedCases || 3}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Account Type</span>
              <span className="font-semibold text-slate-800">
                {selectedNode.type || 'Savings'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 items-center">
              <span className="text-slate-500">Risk Level</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                {selectedNode.risk || 'High'}
              </span>
            </div>
          </div>

          {/* Action Buttons matching Panel 6 */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => alert(`Freeze notice issued for ${selectedNode.fullAccount || selectedNode.account}`)}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold shadow-xs transition"
            >
              Freeze Account
            </button>

            <button
              onClick={() => alert(`Account flagged for STR/FIU audit`)}
              className="w-full py-2.5 px-4 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-semibold shadow-xs transition"
            >
              Flag for Audit
            </button>

            <button
              onClick={() => alert(`Opening transaction history ledger`)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
            >
              View Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
