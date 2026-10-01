import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Building2,
  Scale,
  Cpu,
  Maximize2,
  Minimize2,
  Minus,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

const QUICK_ACTIONS = [
  {
    label: 'ATM Cash-Out Window',
    prompt: 'What is the predicted ATM cash-out withdrawal window and risk probability for this case?',
    icon: '⚡',
    tag: 'ML Forecast',
  },
  {
    label: 'Trace Mule Flow',
    prompt: 'Analyze the multi-hop mule account flow and identify intermediate beneficiary nodes.',
    icon: '🕸️',
    tag: 'Graph AST',
  },
  {
    label: 'Draft Sec 91 Notice',
    prompt: 'Draft a formal Section 91/102 CrPC account freeze notice for the nodal bank officer.',
    icon: '📜',
    tag: 'Legal Order',
  },
  {
    label: 'Modus Operandi Breakdown',
    prompt: 'Explain the suspect syndicate modus operandi, device fingerprints, and recommended countermeasures.',
    icon: '🛡️',
    tag: 'Intelligence',
  },
];

export default function AICopilotPopup({ isOpen, onClose, defaultCaseId = null }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '**Namaste Officer.** I am the **CyberTrace AI Investigation Copilot**, powered by **OpenAI (GPT-4o)**.\n\nI have real-time access to the case registry, transaction graph hops, and ATM withdrawal predictions. How can I assist your investigation today?',
      time: 'Ready',
      modelUsed: 'openai/gpt-4o-mini',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'notice'
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(defaultCaseId || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusInfo, setStatusInfo] = useState({
    active_model: 'openai/gpt-4o-mini',
    provider: 'OpenRouter (OpenAI Engine)',
    status: 'ONLINE',
  });

  // Notice generator state
  const [targetBank, setTargetBank] = useState('State Bank of India / Nodal Officer');
  const [generatedNotice, setGeneratedNotice] = useState('');
  const [generatingNotice, setGeneratingNotice] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (defaultCaseId) {
      setSelectedCaseId(defaultCaseId);
    }
  }, [defaultCaseId]);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch copilot status
    api
      .get('/copilot/status')
      .then((res) => {
        if (res.data) setStatusInfo(res.data);
      })
      .catch((err) => {
        console.warn('Copilot status fetch error:', err);
      });

    // Fetch available complaints for context switcher
    api
      .get('/complaints')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data?.complaints || [];
        setCases(list);
        if (!selectedCaseId && list.length > 0) {
          setSelectedCaseId(list[0].complaint_id || '');
        }
      })
      .catch((err) => {
        console.warn('Complaints fetch error:', err);
      });
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (overrideText = null) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = newHistory
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        }));

      const res = await api.post('/copilot/chat', {
        message: textToSend,
        case_id: selectedCaseId || null,
        history: chatHistory.slice(-6),
      });

      const replyContent = res.data?.reply || 'Received analysis from AI Copilot.';
      const model = res.data?.model_used || statusInfo.active_model;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: replyContent,
          modelUsed: model,
          legalReferences: res.data?.legal_references || [],
          suggestedActions: res.data?.suggested_actions || [],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('AI Copilot request failed:', error);
      const errorMsg =
        error.response?.data?.detail ||
        'Unable to complete request. Please verify network and OpenRouter API status.';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ **Intelligence Service Alert:** ${errorMsg}`,
          isError: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftNotice = async () => {
    if (!selectedCaseId) {
      alert('Please select a Case ID first to draft a statutory notice.');
      return;
    }
    setGeneratingNotice(true);
    try {
      const res = await api.post('/copilot/draft-notice', {
        case_id: selectedCaseId,
        target_bank: targetBank,
      });
      setGeneratedNotice(res.data.notice_text || '');
    } catch (err) {
      console.error('Failed to generate notice:', err);
      setGeneratedNotice(
        `Error generating statutory notice: ${err.response?.data?.detail || err.message}`
      );
    } finally {
      setGeneratingNotice(false);
    }
  };

  const handleCopy = (text, id = null) => {
    navigator.clipboard.writeText(text);
    if (id) {
      setCopiedMsgId(id);
      setTimeout(() => setCopiedMsgId(null), 2000);
    } else {
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2000);
    }
  };

  const handleDownloadNotice = () => {
    if (!generatedNotice) return;
    const blob = new Blob([generatedNotice], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statutory_Notice_Sec91_${selectedCaseId || 'CASE'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          '**Session reset.** CyberTrace AI Copilot is standing by with live case telemetry.',
        time: 'Ready',
        modelUsed: statusInfo.active_model,
      },
    ]);
  };

  // Simple Markdown Formatter Helper
  const formatMarkdown = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const title = line.replace(/^#{2,3}\s+/, '');
        return (
          <h4 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-2.5 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {title}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
            {renderFormattedSpan(content)}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className="ml-2 text-slate-700 dark:text-slate-300 my-1 flex gap-1.5 leading-relaxed">
            <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">{line.match(/^\d+\./)[0]}</span>
            <span>{renderFormattedSpan(content)}</span>
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="my-1 leading-relaxed text-slate-700 dark:text-slate-300">
          {renderFormattedSpan(line)}
        </p>
      );
    });
  };

  const renderFormattedSpan = (str) => {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[10px] border border-blue-200/50 dark:border-slate-700"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div
      className={`fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-2xl shadow-indigo-950/30 overflow-hidden transform origin-bottom-right transition-all duration-300 ease-out animate-in zoom-in-95 fade-in slide-in-from-bottom-4 ${
        isExpanded
          ? 'w-[calc(100vw-2rem)] sm:w-[620px] h-[calc(100vh-8rem)] max-h-[720px]'
          : 'w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[calc(100vh-7.5rem)]'
      }`}
    >
      {/* 1. Header: Brand, Live Engine Status, Window Controls */}
      <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/30 dark:from-slate-800/80 dark:via-slate-900/80 dark:to-indigo-950/30 flex flex-col gap-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                  CyberTrace <span className="text-blue-600 dark:text-blue-400">Copilot</span>
                </h3>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-300/80 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  GPT-4o
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Cpu className="w-2.5 h-2.5 text-blue-500" />
                Live Investigation & Legal Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Reset Conversation"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse Size' : 'Expand Size'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer hidden sm:block"
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              title="Minimize to Bubble"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs + Active Case Selector */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="flex p-0.5 rounded-xl bg-slate-200/70 dark:bg-slate-800/80 shrink-0 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bot className="w-3 h-3" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('notice')}
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                activeTab === 'notice'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Scale className="w-3 h-3" />
              Sec 91 Freeze
            </button>
          </div>

          {/* Compact Case Selector */}
          <div className="flex-1 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 rounded-xl px-2 py-1 text-xs">
            <ShieldAlert className="w-3 h-3 text-blue-500 shrink-0" />
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-transparent w-full text-slate-800 dark:text-slate-200 focus:outline-hidden text-[11px] font-medium truncate cursor-pointer"
            >
              <option value="">All Cases / Global Telemetry</option>
              {cases.map((c) => (
                <option key={c.id || c.complaint_id} value={c.complaint_id}>
                  {c.complaint_id} - {c.fraud_type || 'Cybercrime'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: Chat Mode */}
      {activeTab === 'chat' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-2 ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[86%] rounded-2xl p-3 shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-tr-xs'
                      : m.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-tl-xs'
                      : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose prose-xs dark:prose-invert max-w-none text-[11.5px] leading-relaxed">
                      {formatMarkdown(m.content)}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-[11.5px] leading-relaxed">{m.content}</div>
                  )}

                  {/* Metadata Footer */}
                  {m.role === 'assistant' && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[9.5px] text-slate-400">
                      <span className="font-mono text-slate-400 dark:text-slate-500">
                        {m.modelUsed || 'openai/gpt-4o-mini'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(m.content, m.id)}
                          className="hover:text-blue-500 flex items-center gap-0.5 transition cursor-pointer"
                          title="Copy"
                        >
                          {copiedMsgId === m.id ? (
                            <Check className="w-2.5 h-2.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                          <span>{copiedMsgId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <span>{m.time}</span>
                      </div>
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs italic pl-8 py-1.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px]">Reasoning over case graph & ATM forecast...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  disabled={loading}
                  className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-[10.5px] font-medium transition cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedCaseId
                    ? `Ask Copilot about ${selectedCaseId}...`
                    : 'Ask about mule accounts, ATM windows, or suspects...'
                }
                disabled={loading}
                className="flex-1 bg-slate-100/90 dark:bg-slate-800/90 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3 py-2 border border-transparent focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: Section 91/102 Freeze Notice Generator */}
      {activeTab === 'notice' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-3 text-xs">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Statutory Freeze Order Requisition
              </div>
              <p className="text-[10.5px] leading-relaxed text-blue-800/90 dark:text-blue-300">
                Generates a formal legal freeze order (Sec 91/102 CrPC & BNSS 94) injecting mule accounts, beneficiary hashes, and victim loss for bank nodal officers.
              </p>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Bank / Nodal Officer:
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={targetBank}
                    onChange={(e) => setTargetBank(e.target.value)}
                    placeholder="e.g. SBI / HDFC Nodal Officer"
                    className="bg-transparent w-full text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selected Dossier Context:
                </label>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                  <span className="font-bold">{selectedCaseId || 'All Cases'}</span>
                  <span className="text-[9.5px] text-blue-600 dark:text-blue-400 font-sans font-semibold">
                    Auto-Injects Multi-Hop Nodes
                  </span>
                </div>
              </div>

              <button
                onClick={handleDraftNotice}
                disabled={generatingNotice || !selectedCaseId}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {generatingNotice ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Drafting Legal Notice...
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    Draft Official Debit Freeze Notice
                  </>
                )}
              </button>
            </div>

            {generatedNotice && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Scale className="w-3 h-3 text-blue-500" />
                    Order Preview
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(generatedNotice)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedNotice ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedNotice ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleDownloadNotice}
                      className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-[10px] flex items-center gap-1 transition cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export .txt</span>
                    </button>
                  </div>
                </div>

                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800 shadow-inner">
                  {generatedNotice}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
