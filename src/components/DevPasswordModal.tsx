import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Key,
  Lock,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
  X,
  Sparkles,
  Terminal,
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Crown,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';
import { AuthSession, AppPasswords, AuthorizedAdmin, ExcelCensusData } from '../types';
import {
  getAppPasswords,
  saveAppPasswords,
  resetAppPasswords,
  verifyDeveloperKey,
  getAuthorizedAdmins,
  addAuthorizedAdmin,
  removeAuthorizedAdmin,
  resetAuthorizedAdmins,
} from '../utils/security';
import { resetCensusData } from '../utils/censusUtils';

interface DevPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession | null;
  onPasswordsUpdated?: (passwords: AppPasswords) => void;
  onAdminsUpdated?: (admins: AuthorizedAdmin[]) => void;
  census?: ExcelCensusData;
  onUpdateCensus?: (newCensus: ExcelCensusData) => void;
  onOpenExcelUpload?: () => void;
  onDevLoginSuccess?: (session: AuthSession) => void;
}

export const DevPasswordModal: React.FC<DevPasswordModalProps> = ({
  isOpen,
  onClose,
  session,
  onPasswordsUpdated,
  onAdminsUpdated,
  census,
  onUpdateCensus,
  onOpenExcelUpload,
  onDevLoginSuccess,
}) => {
  const isAlreadyDev = Boolean(
    session?.username.toLowerCase().includes('zargham') ||
    session?.username.toLowerCase().includes('harshvardhan') ||
    session?.isDeveloper ||
    session?.hasExcelMasterAccess
  );

  const [activeTab, setActiveTab] = useState<'passwords' | 'admins' | 'census'>('passwords');
  const [devKeyInput, setDevKeyInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Passwords state
  const [passwords, setPasswords] = useState<AppPasswords>(getAppPasswords());
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newClassmatePass, setNewClassmatePass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showClassmatePass, setShowClassmatePass] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Admin roster state
  const [adminsList, setAdminsList] = useState<AuthorizedAdmin[]>(getAuthorizedAdmins());
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

  // Census override state
  const [manualCount, setManualCount] = useState<number>(census?.studentCount || 120);

  useEffect(() => {
    if (census) {
      setManualCount(census.studentCount);
    }
  }, [census]);

  useEffect(() => {
    if (isOpen) {
      const current = getAppPasswords();
      const currentAdmins = getAuthorizedAdmins();
      setPasswords(current);
      setAdminsList(currentAdmins);
      setNewAdminPass(current.adminPass);
      setNewClassmatePass(current.classmatePass);
      setIsAuthorized(Boolean(isAlreadyDev));
      setAuthError(null);
      setAdminActionError(null);
      setSuccessToast(null);
      setDevKeyInput('');
      setNewUsername('');
      setNewDisplayName('');
      setNewRoleTitle('');
    }
  }, [isOpen, isAlreadyDev]);

  if (!isOpen) return null;

  const handleAuthorizeDev = (e?: React.FormEvent, customKey?: string) => {
    if (e) e.preventDefault();
    const keyToCheck = (customKey || devKeyInput).trim();
    if (verifyDeveloperKey(keyToCheck)) {
      setIsAuthorized(true);
      setAuthError(null);
      const isHarsh = keyToCheck.toLowerCase().includes('harsh');
      const devSession: AuthSession = {
        isAuthenticated: true,
        role: 'admin',
        username: isHarsh
          ? 'Harshvardhan (Founder & Excel Commander)'
          : 'Zargham Hasan (Developer & Admin)',
        loginTime: new Date().toISOString(),
        isDeveloper: true,
        hasExcelMasterAccess: true,
      };
      if (onDevLoginSuccess) {
        onDevLoginSuccess(devSession);
      }
    } else {
      setAuthError('Unauthorized: Invalid Master Key. Enter DEV_ZARGHAM_72 or HARSHVARDHAN_FOUNDER.');
    }
  };

  const handleSavePasswords = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass.trim() || !newClassmatePass.trim()) {
      setAuthError('Both passwords must be non-empty.');
      return;
    }

    const updated = saveAppPasswords({
      adminPass: newAdminPass.trim(),
      classmatePass: newClassmatePass.trim(),
      updatedBy: session?.username || 'Zargham Hasan (Developer)',
    });

    setPasswords(updated);
    setSuccessToast('Passwords successfully updated! All new logins will use these credentials.');
    if (onPasswordsUpdated) onPasswordsUpdated(updated);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleResetDefaults = () => {
    const defaults = resetAppPasswords();
    setPasswords(defaults);
    setNewAdminPass(defaults.adminPass);
    setNewClassmatePass(defaults.classmatePass);
    setSuccessToast('Reset to default passwords: PLC_ADMIN_2026 & PLC_CLASS_2026.');
    if (onPasswordsUpdated) onPasswordsUpdated(defaults);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Admin Management Handlers
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError(null);
    if (!newUsername.trim()) {
      setAdminActionError('Username is required.');
      return;
    }

    const updated = addAuthorizedAdmin({
      username: newUsername.trim(),
      displayName: newDisplayName.trim() || `${newUsername.trim()} (Admin)`,
      roleTitle: newRoleTitle.trim() || 'Admin',
    });

    setAdminsList(updated);
    setSuccessToast(`Admin "@${newUsername.trim().toLowerCase()}" successfully authorized!`);
    setNewUsername('');
    setNewDisplayName('');
    setNewRoleTitle('');
    if (onAdminsUpdated) onAdminsUpdated(updated);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRemoveAdmin = (admin: AuthorizedAdmin) => {
    setAdminActionError(null);
    if (admin.isProtected) {
      setAdminActionError(`"${admin.displayName}" is protected and cannot be removed.`);
      return;
    }

    const result = removeAuthorizedAdmin(admin.id);
    if (!result.success) {
      setAdminActionError(result.error || 'Failed to remove administrator.');
      return;
    }

    setAdminsList(result.admins);
    setSuccessToast(`Admin "${admin.displayName}" removed from authorized roster.`);
    if (onAdminsUpdated) onAdminsUpdated(result.admins);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleResetAdmins = () => {
    const defaults = resetAuthorizedAdmins();
    setAdminsList(defaults);
    setSuccessToast('Admin roster restored to factory leadership team.');
    if (onAdminsUpdated) onAdminsUpdated(defaults);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-indigo-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative text-left my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e2640] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">Master Security & Console</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Dev & Founder
              </span>
            </div>
            <p className="text-xs text-slate-400">Master command panel · Zargham Hasan & Harshvardhan</p>
          </div>
        </div>

        {/* Step 1: Authorization gate if not already signed in as Zargham or Harshvardhan */}
        {!isAuthorized ? (
          <form onSubmit={handleAuthorizeDev} className="space-y-4">
            <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-4 text-xs">
              <p className="text-slate-300 font-medium mb-1">Master Verification Required</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Developer security access is strictly restricted to Founder (Harshvardhan) and Developer (Zargham Hasan). Enter your private Master Key to authenticate.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Master Command Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={devKeyInput}
                  onChange={(e) => setDevKeyInput(e.target.value)}
                  placeholder="Enter private master key"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-xs outline-none"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-2.5" />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md"
            >
              Verify & Unlock Developer Console
            </button>
          </form>
        ) : (
          /* Step 2: Full Developer Control Dashboard with Tabs */
          <div className="space-y-4">
            {/* Quick Website Unlock Bar */}
            <div className="p-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Developer Authorization Active
                </span>
                <p className="text-[11px] text-slate-400">Master access unlocked for Harshvardhan & Zargham.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const isHarsh = session?.username?.toLowerCase().includes('harsh') || devKeyInput.toLowerCase().includes('harsh');
                  const s: AuthSession = {
                    isAuthenticated: true,
                    role: 'admin',
                    username: isHarsh
                      ? 'Harshvardhan (Founder & Excel Commander)'
                      : 'Zargham Hasan (Developer & Admin)',
                    loginTime: new Date().toISOString(),
                    isDeveloper: true,
                    hasExcelMasterAccess: true,
                  };
                  if (onDevLoginSuccess) onDevLoginSuccess(s);
                  onClose();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition shrink-0"
              >
                Enter Portal Now →
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 p-1 bg-[#080a12] border border-[#1e2640] rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('passwords');
                  setAdminActionError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'passwords'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Passwords</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('admins');
                  setAdminActionError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'admins'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Manage Admins ({adminsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('census');
                  setAdminActionError(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'census'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel Firewall</span>
              </button>
            </div>

            {/* Notifications */}
            {successToast && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successToast}</span>
              </div>
            )}

            {adminActionError && (
              <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{adminActionError}</span>
              </div>
            )}

            {/* TAB 1: PASSWORDS */}
            {activeTab === 'passwords' && (
              <form onSubmit={handleSavePasswords} className="space-y-4">
                <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Credential Security Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live & Protected
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Last modified: <strong className="text-slate-200">{passwords.lastUpdated ? new Date(passwords.lastUpdated).toLocaleDateString() : 'Initial Setup'}</strong> by <strong className="text-indigo-300">{passwords.updatedBy || 'Zargham Hasan'}</strong>
                  </p>
                </div>

                {/* 1. Admin Password Field */}
                <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>1. Admin Master Password</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                    >
                      {showAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{showAdminPass ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="Set new admin password"
                    className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs font-mono outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Required by all administrators to enter the Admin Control Deck.
                  </p>
                </div>

                {/* 2. Classmate Password Field */}
                <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      <span>2. Classmate Access Passcode</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowClassmatePass(!showClassmatePass)}
                      className="text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
                    >
                      {showClassmatePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{showClassmatePass ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>
                  <input
                    type={showClassmatePass ? 'text' : 'password'}
                    required
                    value={newClassmatePass}
                    onChange={(e) => setNewClassmatePass(e.target.value)}
                    placeholder="Set new classmate passcode"
                    className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-red-500 rounded-lg px-3 py-2 text-xs font-mono outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Given to Patna Law College classmates to access registry and voting.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Update Both Passwords</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#1e2640] hover:bg-[#283556] transition flex items-center justify-center gap-1.5"
                    title="Reset to factory defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MANAGE ADMINS (ADD & REMOVE) */}
            {activeTab === 'admins' && (
              <div className="space-y-4">
                {/* Add Admin Sub-form */}
                <form onSubmit={handleAddAdmin} className="bg-[#080a12] border border-amber-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Administrator</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Username (Login ID)</label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. rohan"
                        className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Display Name</label>
                      <input
                        type="text"
                        required
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        placeholder="e.g. Rohan (Admin)"
                        className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Role Title</label>
                      <input
                        type="text"
                        required
                        value={newRoleTitle}
                        onChange={(e) => setNewRoleTitle(e.target.value)}
                        placeholder="e.g. Event Lead"
                        className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Authorize Administrator</span>
                  </button>
                </form>

                {/* Current Admin Roster */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Authorized Administrators ({adminsList.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleResetAdmins}
                      className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                      title="Restore original leadership admins"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore Default Admins</span>
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {adminsList.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center justify-between p-2.5 bg-[#080a12] border border-[#1e2640] hover:border-slate-700 rounded-xl text-xs gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-slate-100 truncate">{admin.displayName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                              @{admin.username}
                            </span>
                            {admin.isProtected && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold">
                                Protected
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{admin.roleTitle}</p>
                        </div>

                        {!admin.isProtected ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveAdmin(admin)}
                            className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 px-2.5 py-1 rounded-lg transition shrink-0"
                            title={`Revoke admin powers from ${admin.displayName}`}
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 px-2 py-1 bg-[#101424] rounded-lg border border-[#1e2640]">
                            Founder / Dev
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EXCEL CENSUS & PHONE DIRECTORY FIREWALL */}
            {activeTab === 'census' && (
              <div className="space-y-4">
                <div className="bg-[#080a12] border border-emerald-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Master Excel & Phone Directory Control</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Sync
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#101424] p-3 rounded-lg border border-[#1e2640]">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Verified Headcount:</span>
                      <strong className="text-lg text-emerald-400 font-bold">{census?.studentCount || 120} Students</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Phone Directory:</span>
                      <strong className="text-xs text-white">{census?.phoneDirectoryVerified || '120 Active Mobile Records'}</strong>
                    </div>
                    <div className="col-span-2 text-[11px] text-slate-400 pt-1 border-t border-[#1e2640]/50">
                      Spreadsheet: <span className="text-slate-200 font-mono truncate block">{census?.fileName || 'PLC_BBA_LLB_Master_Enrollment_2026-31.xlsx'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#0c1322] border border-amber-500/30 rounded-lg text-xs text-slate-300">
                    <span className="font-semibold text-amber-300 block mb-0.5">Master Command Authority</span>
                    <p className="text-[11px] text-slate-400">
                      Both Website Developer (Zargham Hasan) and Founder (Harshvardhan) have complete authority to manage cohort phone numbers and replace spreadsheets.
                    </p>
                  </div>

                  {onOpenExcelUpload && (
                    <button
                      type="button"
                      onClick={onOpenExcelUpload}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Launch Master Excel & Phone Directory Uploader</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2640]">
                    <span className="text-[11px] text-slate-400">Restore default census:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const def = resetCensusData();
                        if (onUpdateCensus) onUpdateCensus(def);
                        setSuccessToast('Census reset to default 120 verified students with phone directory.');
                        setTimeout(() => setSuccessToast(null), 3500);
                      }}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Census</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
