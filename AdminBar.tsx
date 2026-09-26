import React from 'react';
import { Crown, LogOut, PlusCircle, Bell, Link2, ShieldCheck, FileSpreadsheet, Key, Edit3 } from 'lucide-react';
import { AuthSession } from '../types';

interface AdminBarProps {
  session: AuthSession | null;
  onLogout: () => void;
  onOpenAddCrew: () => void;
  onOpenAddNotice: () => void;
  onOpenAddLink: () => void;
  onToggleLogoModal: () => void;
  onOpenExcelCounter: () => void;
  onOpenDevSecurity?: () => void;
  onToggleVisualEdit?: () => void;
  isVisualEditMode?: boolean;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  session,
  onLogout,
  onOpenAddCrew,
  onOpenAddNotice,
  onOpenAddLink,
  onToggleLogoModal,
  onOpenExcelCounter,
  onOpenDevSecurity,
  onToggleVisualEdit,
  isVisualEditMode,
}) => {
  if (!session || session.role !== 'admin') return null;

  return (
    <div id="topAdminBar" className="bg-[#12182c] border-b border-amber-500/40 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>ADMIN CONTROL DECK</span>
        </span>
        <span className="text-slate-300 hidden sm:inline">
          Logged in as: <strong className="text-white font-semibold">{session.username}</strong>
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {onToggleVisualEdit && (
          <button
            onClick={onToggleVisualEdit}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition font-medium ${
              isVisualEditMode
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-[#1e2640] hover:bg-[#2a365b] text-amber-300 border border-amber-500/30'
            }`}
            title="Toggle inline visual text editing across the website"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isVisualEditMode ? 'Visual Edit: ON' : 'Visual Edit Words'}</span>
          </button>
        )}

        {onOpenDevSecurity && (
          <button
            onClick={onOpenDevSecurity}
            className="flex items-center gap-1.5 bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded transition font-medium"
            title="Developer Security Console: Change Admin & Classmate Passwords"
          >
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dev Passwords</span>
          </button>
        )}

        <button
          onClick={onOpenExcelCounter}
          className="flex items-center gap-1.5 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded transition font-medium"
          title="Upload Excel sheet to calculate exact student count"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Excel Student Counter</span>
        </button>

        <button
          onClick={onOpenAddCrew}
          className="flex items-center gap-1 bg-[#1e2640] hover:bg-[#2a365b] text-slate-200 border border-[#2b3960] px-2.5 py-1 rounded transition"
        >
          <PlusCircle className="w-3 h-3 text-amber-400" />
          <span>Add Crew</span>
        </button>

        <button
          onClick={onOpenAddNotice}
          className="flex items-center gap-1 bg-[#1e2640] hover:bg-[#2a365b] text-slate-200 border border-[#2b3960] px-2.5 py-1 rounded transition"
        >
          <Bell className="w-3 h-3 text-red-400" />
          <span>Post Notice</span>
        </button>

        <button
          onClick={onOpenAddLink}
          className="flex items-center gap-1 bg-[#1e2640] hover:bg-[#2a365b] text-slate-200 border border-[#2b3960] px-2.5 py-1 rounded transition"
        >
          <Link2 className="w-3 h-3 text-blue-400" />
          <span>Add Link</span>
        </button>

        <button
          onClick={onToggleLogoModal}
          className="flex items-center gap-1 bg-[#1e2640] hover:bg-[#2a365b] text-slate-200 border border-[#2b3960] px-2.5 py-1 rounded transition"
        >
          <span>Logo Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2.5 py-1 rounded transition ml-1"
        >
          <LogOut className="w-3 h-3" />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
};
