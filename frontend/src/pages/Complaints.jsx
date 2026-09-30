import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
} from 'lucide-react';
import { MOCK_COMPLAINTS, MOCK_STATS } from '../data/mockData';
import { useCaseModal } from '../components/layout/Layout';

export default function Complaints() {
  const { openCaseModal } = useCaseModal();
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewModal, setShowNewModal] = useState(false);

  // New complaint form state
  const [newCase, setNewCase] = useState({
    id: `CT-3026-00${complaints.length + 1}`,
    complainant: '',
    fraudType: 'UPI Fraud',
    amount: '',
    date: '12 Oct 2026',
    status: 'Open',
    riskLevel: 'High',
  });

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fraudType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType =
        selectedType === 'All Types' || c.fraudType === selectedType;

      const matchStatus =
        selectedStatus === 'All Status' || c.status === selectedStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [complaints, searchTerm, selectedType, selectedStatus]);

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    if (!newCase.complainant || !newCase.amount) return;
    const formattedCase = {
      ...newCase,
      amount: newCase.amount.startsWith('₹') ? newCase.amount : `₹${newCase.amount}`,
    };
    setComplaints([formattedCase, ...complaints]);
    setShowNewModal(false);
    setNewCase({
      id: `CT-3026-00${complaints.length + 2}`,
      complainant: '',
      fraudType: 'UPI Fraud',
      amount: '',
      date: '12 Oct 2026',
      status: 'Open',
      riskLevel: 'High',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Investigating':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Open':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Closed':
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High':
        return 'bg-red-50 text-red-600 border-red-200 font-bold';
      case 'Medium':
        return 'bg-amber-50 text-amber-600 border-amber-200 font-medium';
      case 'Low':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 font-medium';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Register new complaint, upload transaction data and manage cases
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* 4 Mini KPI Cards matching Panel 3 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{MOCK_STATS.totalCases}</div>
            <div className="text-xs text-slate-500 font-medium">Total Complaints</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{MOCK_STATS.activeInvestigations}</div>
            <div className="text-xs text-slate-500 font-medium">Active Investigations</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{MOCK_STATS.closedCases}</div>
            <div className="text-xs text-slate-500 font-medium">Closed Cases</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">{MOCK_STATS.highRiskCases}</div>
            <div className="text-xs text-slate-500 font-medium">High Risk Cases</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching Panel 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Name, Type..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option>All Types</option>
            <option>UPI Fraud</option>
            <option>Investment Scam</option>
            <option>Card Fraud</option>
            <option>KYC Fraud</option>
            <option>Trading Scam</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option>All Status</option>
            <option>Investigating</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Closed</option>
            <option>Resolved</option>
          </select>

          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>01 Oct - 12 Oct</span>
          </div>

          <button
            onClick={() => alert('Exporting complaints registry as CSV...')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Complaints Table matching Panel 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case ID</th>
                <th className="py-3.5 px-4">Complainant</th>
                <th className="py-3.5 px-4">Fraud Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredComplaints.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openCaseModal(item.id)}
                  className="hover:bg-blue-50/40 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 group-hover:underline">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.complainant}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{item.fraudType}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.amount}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] border ${getRiskBadge(
                        item.riskLevel
                      )}`}
                    >
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCaseModal(item.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Panel 3 */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredComplaints.length} of {complaints.length} cases</span>
          <div className="flex items-center gap-1.5 font-medium">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
              className="p-1.5 rounded-lg hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* New Complaint Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Register New Complaint</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Complainant Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newCase.complainant}
                  onChange={(e) =>
                    setNewCase({ ...newCase, complainant: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Fraud Category
                  </label>
                  <select
                    value={newCase.fraudType}
                    onChange={(e) =>
                      setNewCase({ ...newCase, fraudType: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option>UPI Fraud</option>
                    <option>Investment Scam</option>
                    <option>Card Fraud</option>
                    <option>KYC Fraud</option>
                    <option>Trading Scam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1,50,000"
                    value={newCase.amount}
                    onChange={(e) =>
                      setNewCase({ ...newCase, amount: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Upload Evidence / Statement (CSV/PDF)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500">
                    Click to attach bank statement or transaction logs
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
