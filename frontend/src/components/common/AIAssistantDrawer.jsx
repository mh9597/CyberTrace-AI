import React, { useState, useEffect, useRef } from 'react';
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
  AlertTriangle,
  ChevronDown,
  Download,
} from 'lucide-react';
import api from '../../services/api';

const QUICK_ACTIONS = [
  {
    label: 'Predict Withdrawal Window',
    prompt: 'What is the predicted ATM cash-out withdrawal window and risk probability for this case?',
    icon: '⚡',
  },
  {
    label: 'Analyze Mule Network',
    prompt: 'Analyze the multi-hop mule account flow and identify intermediate beneficiary nodes.',
    icon: '🕸️',
  },
  {
    label: 'Draft Sec 91/102 Notice',
    prompt: 'Draft a formal Section 91/102 CrPC account freeze notice for the nodal bank officer.',
    icon: '📜',
  },
  {
    label: 'Modus Operandi Breakdown',
    prompt: 'Explain the suspect syndicate modus operandi, device fingerprints, and recommended countermeasures.',
    icon: '🛡️',
  },
];

export default function AIAssistantDrawer({ isOpen, onClose, defaultCaseId = null }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '**Namaste Officer.** I am the **CyberTrace AI Investigation Copilot**, powered by **OpenAI (GPT-4o)** via OpenRouter.\n\nI have real-time access to the case registry, transaction graph hops, and ATM withdrawal predictions. How can I assist your investigation today?',
      time: 'Ready',
      modelUsed: 'openai/gpt-4o-mini',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'notice'
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(defaultCaseId || '');
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
      // Build conversation history for context (exclude welcome message)
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
      // Heading 3 / 2
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const title = line.replace(/^#{2,3}\s+/, '');
        return (
          <h4 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-2 mb-1">
            {title}
          </h4>
        );
      }
      // Bullet list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
            {renderFormattedSpan(content)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s+/.test(line)) {
        const content = line.replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className="ml-2 text-slate-700 dark:text-slate-300 my-0.5 flex gap-1.5 leading-relaxed">
            <span className="font-semibold text-blue-600 dark:text-blue-400">{line.match(/^\d+\./)[0]}</span>
            <span>{renderFormattedSpan(content)}</span>
          </div>
        );
      }
      // Empty line
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      // Paragraph
      return (
        <p key={idx} className="my-1 leading-relaxed text-slate-700 dark:text-slate-300">
          {renderFormattedSpan(line)}
        </p>
      );
    });
  };

  // Render bold **text** and `code` inline
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
            className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono text-[10px]"
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
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    CyberTrace AI Copilot
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    OpenAI gpt-4o
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Cpu className="w-3 h-3 text-blue-500" />
                  Forensic Reasoning & Statutory Law Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClearHistory}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs + Active Case Context Dropdown */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="flex p-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800/80 shrink-0 text-xs font-medium">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                Intelligence Chat
              </button>
              <button
                onClick={() => setActiveTab('notice')}
                className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 ${
                  activeTab === 'notice'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                Sec 91/102 Notice
              </button>
            </div>

            {/* Case Selector Dropdown */}
            <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="bg-transparent w-full text-slate-800 dark:text-slate-200 focus:outline-hidden text-xs font-medium truncate"
              >
                <option value="">-- All Cases / General Knowledge --</option>
                {cases.map((c) => (
                  <option key={c.id || c.complaint_id} value={c.complaint_id}>
                    {c.complaint_id} - {c.fraud_type || 'Cybercrime'} (₹{c.amount ? Number(c.amount).toLocaleString('en-IN') : '0'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TAB 1: Intelligence Chat */}
        {activeTab === 'chat' && (
          <>
            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-2xs ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-tr-none'
                        : m.isError
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900 rounded-tl-none'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    {m.role === 'assistant' ? (
                      <div className="prose prose-xs dark:prose-invert max-w-none text-xs">
                        {formatMarkdown(m.content)}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}

                    {/* Metadata Footer for AI responses */}
                    {m.role === 'assistant' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 font-mono">
                          <Cpu className="w-2.5 h-2.5" />
                          {m.modelUsed || 'openai/gpt-4o-mini'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(m.content, m.id)}
                            className="hover:text-blue-500 flex items-center gap-1 transition"
                            title="Copy Response"
                          >
                            {copiedMsgId === m.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedMsgId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <span>{m.time}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs italic pl-9 py-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Grounded LLM analyzing case graph & forecasting cash-out...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Queries */}
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 px-1 font-mono uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                Investigator Action Prompts
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.prompt)}
                    disabled={loading}
                    className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-left flex items-start gap-1.5 disabled:opacity-50"
                  >
                    <span className="text-xs shrink-0">{action.icon}</span>
                    <span className="truncate font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
                      ? `Ask Copilot about ${selectedCaseId} (e.g. suspect accounts, ML window)...`
                      : 'Ask CyberTrace AI Copilot about threats, mule accounts, or statutory steps...'
                  }
                  disabled={loading}
                  className="flex-1 bg-slate-100 dark:bg-slate-800/90 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-transparent focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}

        {/* TAB 2: Statutory Section 91/102 Notice Generator */}
        {activeTab === 'notice' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Statutory Account Freeze Notice (Sec 91 / 102 CrPC & BNSS 94)
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800/90 dark:text-blue-300">
                  Instantly compile a formal, court-admissible debit freeze requisition for bank nodal officers, injecting real transaction hashes, victim amount, and beneficiary accounts.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Bank / Payment Gateway Nodal Officer:
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={targetBank}
                      onChange={(e) => setTargetBank(e.target.value)}
                      placeholder="e.g. State Bank of India / HDFC Nodal Officer"
                      className="bg-transparent w-full text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Selected Case Dossier:
                  </label>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between border border-slate-200 dark:border-slate-700">
                    <span>{selectedCaseId || 'None selected (Will use active case)'}</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-sans font-semibold">
                      Auto-Injects Multi-Hop Accounts
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDraftNotice}
                  disabled={generatingNotice || !selectedCaseId}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {generatingNotice ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Drafting Legal Statutory Order with OpenAI...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Draft Official Freeze Notice
                    </>
                  )}
                </button>
              </div>

              {generatedNotice && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-blue-500" />
                      Draft Notice Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(generatedNotice)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1 transition"
                      >
                        {copiedNotice ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedNotice ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={handleDownloadNotice}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export .txt</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto border border-slate-800 shadow-inner">
                    {generatedNotice}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
