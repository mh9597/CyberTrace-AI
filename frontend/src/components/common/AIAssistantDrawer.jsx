import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Which city has the highest cash-out probability today?',
  'Summarize active investment scam cases in Ahmedabad',
  'What is the predicted withdrawal window for CT-2026-001?',
  'Explain why Vadodara ATM cluster is flagged at 84%',
];

const PREDEFINED_RESPONSES = {
  default:
    'CyberTrace AI Engine (RF-DBSCAN v2.4) has identified 3 high-confidence cash-out candidates across Gujarat and Maharashtra. Recommended immediate action: alert local branch nodal officers.',
  highest:
    'Ahmedabad (Satellite & SG Highway corridor) holds the highest cash-out risk today at 82%, with an estimated withdrawal window of 11:30 AM – 02:00 PM across 4 flagged mule ATM nodes.',
  ahmedabad:
    'Ahmedabad currently has 42 linked complaints under Case CT-2026-002 (Investment Scam). ₹8,00,000 has been transferred into 3 intermediary accounts. The primary cash-out centroid is predicted within a 1.2 km radius of Satellite Road.',
  window:
    'For Case CT-2026-001 (UPI Fraud, ₹4,50,000), the RF-DBSCAN model estimates an 84% probability of cash-out between 10:00 AM – 02:00 PM today in the Vadodara Alkapuri commercial area.',
  vadodara:
    'The Vadodara cluster is flagged because transaction frequency matched the historical mule withdrawal pattern of the "Golden Triangle Ring" with 94.2% structural similarity.',
};

export default function AIAssistantDrawer({ isOpen, onClose, onSelectCase }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste Inspector Raj. I am CyberTrace AI, your cybercrime intelligence copilot. Ask me about threat hotspots, cash-out predictions, mule account traces, or case summaries.',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = PREDEFINED_RESPONSES.default;
      const lower = textToSend.toLowerCase();
      if (lower.includes('highest') || lower.includes('city') || lower.includes('today')) {
        reply = PREDEFINED_RESPONSES.highest;
      } else if (lower.includes('ahmedabad') || lower.includes('investment')) {
        reply = PREDEFINED_RESPONSES.ahmedabad;
      } else if (lower.includes('window') || lower.includes('ct-2026-001') || lower.includes('time')) {
        reply = PREDEFINED_RESPONSES.window;
      } else if (lower.includes('vadodara') || lower.includes('explain') || lower.includes('flagged')) {
        reply = PREDEFINED_RESPONSES.vadodara;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Ask CyberTrace AI
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-full border border-emerald-200 dark:border-emerald-800">
                  RF-DBSCAN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Predictive Law Enforcement Copilot
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 text-right font-medium ${
                    m.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing threat telemetry...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts Pill Container */}
        <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5 px-1 font-mono uppercase tracking-wider">
            Quick Queries
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
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
              placeholder="Ask about a case, city, or mule network..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
