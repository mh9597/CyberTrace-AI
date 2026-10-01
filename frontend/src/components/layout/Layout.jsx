import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import CaseDetailsModal from '../modals/CaseDetailsModal';

export const CaseModalContext = createContext({
  openCaseModal: (caseId) => {},
  closeCaseModal: () => {},
});

export const useCaseModal = () => useContext(CaseModalContext);

export default function Layout() {
  const [activeCaseId, setActiveCaseId] = useState(null);

  const openCaseModal = (caseId = 'CT-3026-002') => {
    setActiveCaseId(caseId);
  };

  const closeCaseModal = () => {
    setActiveCaseId(null);
  };

  return (
    <CaseModalContext.Provider value={{ openCaseModal, closeCaseModal }}>
      <div className="min-h-screen bg-[#F4F7FC] dark:bg-slate-950 flex flex-col text-[#0F172A] dark:text-slate-100 font-sans relative overflow-x-hidden transition-colors duration-200">
        {/* Ambient bottom-left fluid gradient wave matching reference image */}
        <div
          aria-hidden="true"
          className="fixed -bottom-40 -left-20 w-[520px] h-[520px] pointer-events-none -z-0 opacity-70 dark:opacity-20"
          style={{
            background:
              'radial-gradient(circle at 30% 70%, rgba(192, 132, 252, 0.45) 0%, rgba(253, 164, 175, 0.35) 35%, rgba(56, 189, 248, 0.25) 70%, transparent 100%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Global Top Header */}
        <Header />

        {/* Body Layout: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-5 lg:p-6 bg-[#F4F7FC] dark:bg-slate-950">
            <Outlet />
          </main>
        </div>

        {/* Global Case Details Modal */}
        {activeCaseId && (
          <CaseDetailsModal caseId={activeCaseId} onClose={closeCaseModal} />
        )}
      </div>
    </CaseModalContext.Provider>
  );
}
