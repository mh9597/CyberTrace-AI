import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Shield,
  Award,
  KeyRound,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  BadgeCheck,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileEditModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    role: 'investigator',
    badge_number: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        full_name: user.full_name || '',
        role: user.role || 'investigator',
        badge_number: user.badge_number || '',
        new_password: '',
        confirm_password: '',
      });
      setStatusMessage({ type: '', text: '' });
      setShowPassword(false);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const getInitials = (name) => {
    if (!name) return 'IR';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.full_name.trim()) {
      setStatusMessage({ type: 'error', text: 'Officer Full Name is required.' });
      return;
    }

    if (formData.new_password) {
      if (formData.new_password.length < 6) {
        setStatusMessage({
          type: 'error',
          text: 'New security key/password must be at least 6 characters long.',
        });
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setStatusMessage({
          type: 'error',
          text: 'Password confirmation does not match.',
        });
        return;
      }
    }

    setLoading(true);

    const payload = {
      full_name: formData.full_name.trim(),
      role: formData.role,
      badge_number: formData.badge_number.trim(),
    };

    if (formData.new_password) {
      payload.password = formData.new_password;
    }

    const result = await updateProfile(payload);
    setLoading(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: 'Officer credentials and profile updated successfully!',
      });
      setTimeout(() => {
        onClose();
      }, 900);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to update profile.',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Decorative Ribbon */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">Edit Officer Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update officer credentials & operational rank
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview Officer Badge Card */}
        <div className="px-6 pt-4 pb-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-inner border border-white/20">
                {getInitials(formData.full_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm truncate text-white">
                    {formData.full_name || 'Officer Name'}
                  </span>
                  <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="text-[11px] text-indigo-200 font-mono flex items-center gap-2 mt-0.5">
                  <span className="capitalize">{formData.role.replace('_', ' ')}</span>
                  <span>•</span>
                  <span>{formData.badge_number || 'BADGE-UNASSIGNED'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">
                  {user?.email || 'officer@cybertrace.gov.in'}
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Status Message */}
          {statusMessage.text && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-150 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Officer Full Name
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="e.g. Superintendent Rajesh Nair"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Operational Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-500" />
                Rank / Operational Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="investigator">Investigator</option>
                <option value="senior_officer">Senior Officer</option>
                <option value="admin">Administrator / Unit Head</option>
              </select>
            </div>

            {/* Badge Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Badge / Service ID
              </label>
              <input
                type="text"
                value={formData.badge_number}
                onChange={(e) => setFormData({ ...formData, badge_number: e.target.value })}
                placeholder="e.g. POL-GJ-7729"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono"
              />
            </div>
          </div>

          {/* Email (Readonly for identity security) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Government Email Address
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Primary Identity</span>
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed font-mono"
            />
          </div>

          {/* Security Key / Change Password Accordion */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                Change Security Access Key (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide Fields' : 'Update Key'}</span>
              </button>
            </div>

            {showPassword && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    New Passphrase
                  </label>
                  <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Confirm Passphrase
                  </label>
                  <input
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) =>
                      setFormData({ ...formData, confirm_password: e.target.value })
                    }
                    placeholder="Repeat passphrase"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
