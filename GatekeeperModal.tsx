import React, { useState } from 'react';
import { Shield, Key, User, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AuthSession } from '../types';
import {
  verifyClassmatePasscode,
  verifyAdminPassword,
  checkIsAuthorizedAdmin,
  verifyDeveloperKey,
} from '../utils/security';

interface GatekeeperModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (session: AuthSession) => void;
  currentSession: AuthSession | null;
  onOpenDevSecurity?: () => void;
}

export const GatekeeperModal: React.FC<GatekeeperModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentSession,
  onOpenDevSecurity,
}) => {
  const [activeTab, setActiveTab] = useState<'classmate' | 'admin'>('classmate');
  const [classmatePass, setClassmatePass] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showClassmatePass, setShowClassmatePass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClassmateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const pass = classmatePass.trim();

    if (!pass) {
      setErrorMessage('Please enter the Classmate access passcode.');
      return;
    }

    if (verifyClassmatePasscode(pass)) {
      const session: AuthSession = {
        isAuthenticated: true,
        role: 'classmate',
        username: 'PLC Classmate',
        loginTime: new Date().toISOString(),
        isDeveloper: false,
        hasExcelMasterAccess: false,
      };
      setSuccessMessage('Access Granted! Welcome to the Munna Darinda Portal.');
      setTimeout(() => {
        onLoginSuccess(session);
        if (onClose) onClose();
      }, 400);
      return;
    }

    setErrorMessage('Invalid Passcode. Please check with your batch representative for the valid entry code.');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const userClean = adminUser.trim();
    const passClean = adminPass.trim();

    if (!userClean) {
      setErrorMessage('Please enter your authorized administrator username.');
      return;
    }

    if (!passClean) {
      setErrorMessage('Please enter your administrator password or master key.');
      return;
    }

    const isDevPass = verifyDeveloperKey(passClean);
    const isAdminPassValid = verifyAdminPassword(passClean);

    if (!isAdminPassValid && !isDevPass) {
      setErrorMessage('Authentication Failed: Invalid admin password or master key.');
      return;
    }

    const { isAuthorized, admin } = checkIsAuthorizedAdmin(userClean);

    // Only authorized usernames can log in, unless they hold a valid Developer Master Key
    if (!isAuthorized && !isDevPass) {
      setErrorMessage(`Authentication Failed: "@${userClean}" is not an authorized administrator username.`);
      return;
    }

    // STRICT ROLE CONTROL:
    // Developer powers (isDeveloper & hasExcelMasterAccess) are ONLY granted if the user
    // enters a genuine Developer Master Key. Normal admin login gets standard admin powers only!
    const isDev = isDevPass;

    let displayName = admin ? admin.displayName : `${userClean} (Admin)`;

    const session: AuthSession = {
      isAuthenticated: true,
      role: 'admin',
      username: displayName,
      loginTime: new Date().toISOString(),
      isDeveloper: isDev,
      hasExcelMasterAccess: isDev,
    };

    const welcomeMsg = isDev
      ? `Master Authorization Verified! Welcome ${displayName}.`
      : `Admin Access Granted! Welcome ${displayName}.`;

    setSuccessMessage(welcomeMsg);
    setTimeout(() => {
      onLoginSuccess(session);
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div id="gatekeeper" className="fixed inset-0 z-50 bg-[#080a12]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-6">
        {onClose && currentSession?.isAuthenticated && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm px-2.5 py-1 rounded-lg bg-[#1e2640]/70 hover:bg-[#1e2640] transition"
          >
            ✕
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/5">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Munna Darinda Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Patna Law College · BBA.LLB Official Gateway</p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-1.5 p-1 bg-[#080a12] border border-[#1e2640] rounded-xl mb-6">
          <button
            type="button"
            id="tabClassmate"
            onClick={() => {
              setActiveTab('classmate');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'classmate'
                ? 'bg-[#1e2640] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Classmate Portal
          </button>
          <button
            type="button"
            id="tabAdmin"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Admin Dashboard
          </button>
        </div>

        {/* Classmate Form */}
        {activeTab === 'classmate' && (
          <form id="classmateForm" onSubmit={handleClassmateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Classmate Access Passcode
              </label>
              <div className="relative">
                <input
                  type={showClassmatePass ? 'text' : 'password'}
                  id="classmatePassword"
                  value={classmatePass}
                  onChange={(e) => setClassmatePass(e.target.value)}
                  placeholder="Enter batch access passcode"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 rounded-xl px-3.5 py-2.5 text-sm outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowClassmatePass(!showClassmatePass)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showClassmatePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
            >
              <span>Unlock Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    isAuthenticated: true,
                    role: 'guest',
                    username: 'Law College Visitor',
                    loginTime: new Date().toISOString(),
                  });
                  if (onClose) onClose();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 transition underline underline-offset-2"
              >
                Continue as Guest Explorer
              </button>
            </div>
          </form>
        )}

        {/* Admin Form */}
        {activeTab === 'admin' && (
          <form id="adminForm" onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Restricted Admin Access</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Enter your registered administrator username and password. Master developer powers require a verified Master Key.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Administrator Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="adminUserField"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm outline-none transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Administrator Password / Master Key
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? 'text' : 'password'}
                  id="adminPassField"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="Enter password or developer master key"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 rounded-xl px-3.5 py-2.5 text-sm outline-none transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
            >
              <span>Verify & Unlock Admin Gate</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Error or Success notification */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Creator tribute footer & Developer Security Trigger */}
        <div className="mt-6 pt-4 border-t border-[#1e2640] text-center text-[11px] text-slate-400 flex flex-col items-center gap-1.5">
          <div>
            Founded by <span className="text-amber-400 font-semibold">Harshvardhan</span> · Developed by <span className="text-slate-200 font-semibold">Zargham Hasan</span>
          </div>
          {onOpenDevSecurity && (
            <button
              type="button"
              onClick={onOpenDevSecurity}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition underline underline-offset-2 flex items-center gap-1 font-medium mt-1"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Developer Security Console (Master Authorization)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
