import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import CaseDetailsModal from '../modals/CaseDetailsModal';
import AICopilotBubble from '../common/AICopilotBubble';

export const CaseModalContext = createContext({
  openCaseModal: (caseId, caseData = null) => {},
  closeCaseModal: () => {},
});

export const useCaseModal = () => useContext(CaseModalContext);

export default function Layout() {
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [activeCaseData, setActiveCaseData] = useState(null);

  const openCaseModal = (caseId = 'CT-3026-002', caseData = null) => {
    setActiveCaseId(caseId);
    setActiveCaseData(caseData);
  };

  const closeCaseModal = () => {
    setActiveCaseId(null);
    setActiveCaseData(null);
  };

  return (
    <CaseModalContext.Provider value={{ openCaseModal, closeCaseModal }}>
      <div className="min-h-screen bg-[#F4F7FC] dark:bg-slate-950 flex flex-col text-[#0F172A] dark:text-slate-100 font-sans transition-colors duration-200">
        {/* Global Top Navbar (Sticky - Follows scroll) */}
        <Header />

        {/* Main Content Area spanning full width */}
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 bg-[#F4F7FC] dark:bg-slate-950 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

        {/* Floating Bottom Corner AI Copilot Chat Bubble */}
        <AICopilotBubble />

        {/* Global Case Details Modal */}
        {activeCaseId && (
          <CaseDetailsModal caseId={activeCaseId} customData={activeCaseData} onClose={closeCaseModal} />
        )}
      </div>
    </CaseModalContext.Provider>
  );
}

