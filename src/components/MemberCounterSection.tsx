import React from 'react';
import {
  Users,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Calendar,
  Layers,
  GraduationCap,
  ExternalLink,
  Smartphone,
  PhoneCall,
  Terminal,
} from 'lucide-react';
import { AuthSession, ExcelCensusData } from '../types';

interface MemberCounterSectionProps {
  census: ExcelCensusData;
  session: AuthSession | null;
  onOpenExcelModal: () => void;
}

export const MemberCounterSection: React.FC<MemberCounterSectionProps> = ({
  census,
  session,
  onOpenExcelModal,
}) => {
  const hasExcelPower = Boolean(
    session?.isDeveloper ||
    session?.hasExcelMasterAccess ||
    session?.username?.toLowerCase().includes('zargham') ||
    session?.username?.toLowerCase().includes('harshvardhan')
  );
  const isAdmin = session?.role === 'admin';

  return (
    <section id="census-counter" className="py-12 px-4 sm:px-6 max-w-[1200px] mx-auto">
      <div className="bg-gradient-to-br from-[#0c1224] via-[#101833] to-[#0c1224] border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Pill & Admin/Dev Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Master Excel Registry · Verified Census & Contacts</span>
            </div>

            {/* ONLY Admins and Developer / Founder can see the Excel inspection button */}
            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenExcelModal}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    hasExcelPower
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-amber-900/20'
                      : 'bg-[#1e2640] hover:bg-[#283556] text-emerald-300 border border-emerald-500/40'
                  }`}
                  title={
                    hasExcelPower
                      ? 'Master Clearance: Upload, verify and replace official Excel census (Zargham & Harshvardhan)'
                      : 'Admin View: Inspect verified student Excel roster and contact records'
                  }
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>
                    {hasExcelPower ? 'Manage Master Excel (Dev & Founder Authority)' : 'Inspect Excel Roster (Admin)'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Main Grid: Hero Number & Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Giant verified counter */}
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Patna Law College · BBA.LLB 2026-31 Cohort Strength
              </span>
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400">
                  {census.studentCount}
                </span>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-100 uppercase tracking-wide block">
                    Verified Students
                  </span>
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Certified according to Master Excel</span>
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                The authentic batch headcount certified against the official department register. All student phone numbers, mobile contact registers, and cohort rosters are synchronized with the master spreadsheet.
              </p>
            </div>

            {/* Right Col: Verified Batch Breakdown Cards */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Card 1: Batch Details */}
              <div className="bg-[#080a12]/80 border border-[#1e2640] rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Degree & Section</span>
                </div>
                <div className="text-base font-bold text-white">BBA.LLB (Hons.)</div>
                <div className="text-xs text-slate-400 mt-0.5">5-Year Integrated Law Course</div>
              </div>

              {/* Card 2: Phone Directory Index (Replaces Roll Call Range) */}
              <div className="bg-[#080a12]/80 border border-[#1e2640] rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Phone Directory Synced</span>
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {census.phoneDirectoryVerified || `${census.studentCount} Mobile Contacts`}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Batch Phone Numbers Verified</div>
              </div>

              {/* Card 3: Spreadsheet Verification Stamp */}
              <div className="bg-[#080a12]/80 border border-[#1e2640] rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Master Spreadsheet</span>
                </div>
                <div className="text-xs font-bold font-mono text-slate-200 truncate" title={census.fileName}>
                  {census.fileName}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Sheet: <span className="text-slate-300 font-mono">{census.sheetName}</span>
                </div>
              </div>

              {/* Card 4: Cryptographic Firewall Status */}
              <div className="bg-[#080a12]/80 border border-[#1e2640] rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Master Firewall</span>
                </div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Protected Access Mode</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Restricted to Zargham & Harshvardhan
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance Note */}
          <div className="mt-6 pt-4 border-t border-[#1e2640]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Master Authority:</span>
              <strong className="text-slate-300">{census.updatedBy || 'Zargham Hasan & Harshvardhan'}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Last Census Update:</span>
              <span className="text-slate-300 font-mono">
                {census.lastUpdated ? new Date(census.lastUpdated).toLocaleDateString() : 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
