import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { ROLE_CONFIG } from '../../utils/permissions';

export default function RestrictedAccess({ userRole = 'investigator', requiredRoles = [] }) {
  const navigate = useNavigate();
  const roleMeta = ROLE_CONFIG[userRole] || {
    badgeLabel: userRole?.toUpperCase(),
    badgeColor: 'blue',
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[11px] font-bold tracking-wide uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Authorization Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your current role does not have statutory clearance to access this section of the CyberTrace AI platform.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Your Active Authority:</span>
            <span className="font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
              {roleMeta.badgeLabel}
            </span>
          </div>
          {requiredRoles.length > 0 && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Required Roles:</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {requiredRoles.join(', ')}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          Security Event ID: SEC-AUTH-{Date.now().toString().slice(-6)} • Logged to Audit Vault
        </p>
      </div>
    </div>
  );
}
