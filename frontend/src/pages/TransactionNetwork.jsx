import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GitFork,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Layers,
  Info,
  Table,
  Eye,
  Radio,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import EvidenceBadge from '../components/common/EvidenceBadge';

export default function TransactionNetwork() {
  const [searchParams] = useSearchParams();
  const caseIdParam = searchParams.get('caseId');

  const [complaints, setComplaints] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(caseIdParam || 'CT-2026-001');
  const [networkData, setNetworkData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'table'

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await api.get('/complaints');
        setComplaints(res.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadCases();
  }, []);

  useEffect(() => {
    async function loadNetwork() {
      if (!selectedCaseId) return;
      setLoading(true);
      try {
        const res = await api.get(`/complaints/${selectedCaseId}/network`);
        setNetworkData(res.data);
        if (res.data.nodes?.length > 0) {
          setSelectedNode(res.data.nodes[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadNetwork();
  }, [selectedCaseId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <GitFork className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <span>Transaction Network & Mule Chain Intelligence</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Topological visualization of laundering hops, split transfers, and physical cash-out terminals.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'graph'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Topology</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Accessible Table</span>
            </button>
          </div>

          {/* Case Selector */}
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-cyan-600 shadow-xs dark:bg-slate-950 dark:border-slate-800 dark:text-cyan-300 dark:focus:border-cyan-500"
          >
            {complaints.map((c) => (
              <option key={c.id} value={c.complaint_id}>
                {c.complaint_id} — {c.fraud_type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-500 dark:text-slate-400 font-mono text-xs">
          Building topological network graph for {selectedCaseId}...
        </div>
      ) : networkData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual or Tabular View (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard
              title={`Topological Mule Chain (Case ${selectedCaseId})`}
              subtitle={`${networkData.nodes?.length || 0} Entities &bull; ${networkData.edges?.length || 0} Transfers`}
              icon={GitFork}
              action={
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-300 font-semibold dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800/50">
                  Directed Acyclic Graph
                </span>
              }
            >
              {viewMode === 'graph' ? (
                <div className="py-6 px-4 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-6 overflow-x-auto shadow-xs">
                  <div className="flex items-center justify-between min-w-[620px] gap-4">
                    {networkData.nodes.map((node, index) => {
                      const isSelected = selectedNode?.id === node.id;
                      const isCashOut = node.type === 'cash_out_atm';
                      const isVictim = node.type === 'victim';

                      return (
                        <React.Fragment key={node.id}>
                          {/* Node Box */}
                          <div
                            onClick={() => setSelectedNode(node)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border text-center shrink-0 w-44 select-none ${
                              isSelected
                                ? 'ring-2 ring-cyan-500 shadow-sm'
                                : 'hover:border-slate-400 dark:hover:border-slate-600'
                            } ${
                              isCashOut
                                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs dark:bg-rose-950/40 dark:border-rose-700/60 dark:text-rose-300'
                                : isVictim
                                ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs dark:bg-cyan-950/40 dark:border-cyan-700/60 dark:text-cyan-300'
                                : 'bg-white border-slate-200 text-slate-800 shadow-xs dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                              {isVictim
                                ? 'Origin Source'
                                : isCashOut
                                ? 'Cash-Out Point'
                                : `Mule Hop L${node.hop_level || index}`}
                            </div>
                            <div className="text-xs font-bold font-mono mt-1 truncate text-slate-900 dark:text-white">
                              {node.label || node.id}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              {node.type}
                            </div>
                          </div>

                          {/* Edge Connector Arrow */}
                          {index < networkData.nodes.length - 1 && (
                            <div className="flex flex-col items-center justify-center shrink-0 px-1 text-slate-400 dark:text-slate-500">
                              <ArrowRight className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                                Hop {index + 1}
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Accessible Tabular Alternative (WCAG 2.2 AA) */
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-6">Entity ID</th>
                        <th className="py-3 px-4">Entity Type</th>
                        <th className="py-3 px-4">Hop Level</th>
                        <th className="py-3 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {networkData.nodes.map((n) => (
                        <tr key={n.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-6 font-bold text-cyan-700 dark:text-cyan-300">{n.id}</td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{n.type}</td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Level {n.hop_level || 0}</td>
                          <td className="py-3 px-6 text-right">
                            <button
                              onClick={() => setSelectedNode(n)}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-sans transition"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>

            {/* Transfer Edges Table */}
            <GlassCard
              title="Directed Fund Movement Edges"
              subtitle="Documented transaction legs and provenance references"
              icon={Layers}
            >
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] border-b border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-6">Source</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {networkData.edges.map((e, idx) => (
                      <tr key={idx} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-6 text-cyan-700 dark:text-cyan-300 font-bold">{e.source}</td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">{e.target}</td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          ₹{e.amount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">{e.reference || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Node Inspector (1 Col) */}
          <div className="space-y-6">
            <GlassCard
              title="Entity Inspector"
              subtitle="Selected node telemetry and behavioral attributes"
              icon={Eye}
            >
              {selectedNode ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      Entity Identifier
                    </div>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                      {selectedNode.label || selectedNode.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/70 dark:border-slate-800">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Classification</div>
                      <div className="font-bold text-cyan-700 dark:text-cyan-300 mt-0.5">{selectedNode.type}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-xs dark:bg-slate-950/70 dark:border-slate-800">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Hop Distance</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        Hop {selectedNode.hop_level || 0}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-slate-950/70 dark:border-slate-800 space-y-1.5 font-mono shadow-xs">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Risk Assessment</div>
                    <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>{selectedNode.flags || 'Multi-Hop Rapid Split Fan-Out'}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Graph relationships represent documented transfers for officer review. They do not constitute autonomous proof of criminal intent.
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  Select any node in the graph above to inspect attributes.
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      ) : null}
    </div>
  );
}
