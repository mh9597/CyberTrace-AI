import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X } from 'lucide-react';
import AICopilotPopup from './AICopilotPopup';

export default function AICopilotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Floating Bottom Corner AI Bubble */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none pointer-events-auto">
        {/* Tooltip Card (Appears to the left of the round bubble on hover) */}
        <div
          className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200/90 dark:border-slate-800/90 text-xs text-slate-700 dark:text-slate-200 transition-all duration-300 transform origin-right ${
            isHovered && !isOpen
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-3 scale-95 pointer-events-none'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-slate-900 dark:text-white">Ask AI Copilot</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded font-mono font-semibold border border-blue-200 dark:border-blue-900">
            GPT-4o
          </span>
        </div>

        {/* Circular Floating Action Bubble */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`group relative w-14 h-14 aspect-square rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-blue-600/35 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center border border-white/30 dark:border-white/20 ${
            isOpen ? 'ring-4 ring-blue-400/40' : ''
          }`}
          aria-label="Ask AI Copilot"
          title="Ask AI Copilot (OpenAI GPT-4o)"
        >
          {/* Animated Ambient Glow Ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 opacity-50 group-hover:opacity-85 blur-md transition-opacity duration-300 -z-10 animate-pulse" />

          {/* Clean Robot Icon / Close Icon */}
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X className="w-6 h-6 text-white transition-transform duration-300" />
            ) : (
              <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>

          {/* Live Online Badge Indicator */}
          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </span>
          )}
        </button>
      </div>

      {/* Popable Floating AI Copilot Widget */}
      <AICopilotPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelectCase={(caseId) => {
          navigate(`/complaints?id=${caseId}`);
        }}
      />
    </>
  );
}

