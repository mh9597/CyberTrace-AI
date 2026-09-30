import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-300 transition-colors duration-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-100/60 dark:bg-gradient-to-b dark:from-[#0b1120] dark:via-[#070b14] dark:to-[#030712] transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
