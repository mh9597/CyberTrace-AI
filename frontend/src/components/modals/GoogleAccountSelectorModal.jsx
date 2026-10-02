import React, { useState } from "react";
import { ShieldCheck, User, Plus, Check } from "lucide-react";

export default function GoogleAccountSelectorModal({
  isOpen,
  onClose,
  onSelectAccount,
  onAddNewAccount,
}) {
  const [deviceAccounts, setDeviceAccounts] = useState(() => {
    return [
      {
        name: "Officer Vikram Sharma",
        email: "officer.vikram@gmail.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        badge: "State Cyber Cell",
      },
      {
        name: "Raghav Mehta",
        email: "raghav.mehta@gmail.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        badge: "Cyber Command HQ",
      },
      {
        name: "Meera Deshmukh",
        email: "meera.deshmukh@gmail.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        badge: "Senior Cyber Superintendent",
      },
    ];
  });

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  if (!isOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const newAcc = {
      name: customName.trim() || customEmail.split("@")[0],
      email: customEmail.trim().toLowerCase(),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      badge: "Google Account",
    };
    onSelectAccount(newAcc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-gray-800">
        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex flex-col items-center text-center">
          {/* Official Google 'G' Logo */}
          <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-gray-100 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">Choose an account</h3>
          <p className="text-xs text-gray-500 mt-1">
            to continue to <span className="font-semibold text-gray-700">CyberTrace AI Portal</span>
          </p>
        </div>

        {/* Account List */}
        {!isAddingCustom ? (
          <div className="py-2 px-2 max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {deviceAccounts.map((acc, index) => (
              <button
                key={index}
                onClick={() => onSelectAccount(acc)}
                className="w-full p-3.5 flex items-center justify-between gap-3.5 hover:bg-gray-50/90 rounded-2xl transition group text-left cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                      {acc.name}
                    </p>
                    <p className="text-xs text-gray-500 font-normal truncate">{acc.email}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono shrink-0">
                  Device
                </span>
              </button>
            ))}

            {/* Use Another Account Button */}
            <button
              onClick={() => setIsAddingCustom(true)}
              className="w-full p-3.5 flex items-center gap-3.5 hover:bg-gray-50/90 rounded-2xl transition group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition">
                  Use another account
                </p>
                <p className="text-xs text-gray-400">Add an official Google workspace account</p>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Google Email address</label>
              <input
                type="email"
                required
                autoFocus
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">Display Name (Optional)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Officer Name"
                className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Back to accounts
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Continue with Account
              </button>
            </div>
          </form>
        )}

        {/* Footer info & Cancel */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <p className="text-[11px] text-gray-400">CyberTrace AI OAuth 2.0</p>
          <button
            onClick={onClose}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-200/60 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
