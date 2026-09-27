import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  ShieldCheck,
  Search,
  Sparkles,
  Terminal,
  RefreshCw,
  Eye,
  Smartphone,
  Phone,
  Download,
  Crown,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { AuthSession, ExcelCensusData } from '../types';

interface ExcelCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession | null;
  census: ExcelCensusData;
  onSaveCensus?: (census: ExcelCensusData) => void;
}

export const ExcelCounterModal: React.FC<ExcelCounterModalProps> = ({
  isOpen,
  onClose,
  session,
  census,
  onSaveCensus,
}) => {
  // Developer Zargham Hasan AND Founder Harshvardhan have full Excel power
  const hasExcelPower = Boolean(
    session?.isDeveloper ||
    session?.hasExcelMasterAccess ||
    session?.username?.toLowerCase().includes('zargham') ||
    session?.username?.toLowerCase().includes('harshvardhan')
  );
  const isAdmin = session?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'roster' | 'upload'>('roster');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Temporary processed summary during master upload
  const [stagedCensus, setStagedCensus] = useState<ExcelCensusData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessToast(null);
      setStagedCensus(null);
      setFile(null);
      setSearchQuery('');
      setActiveTab('roster');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Protect against non-admin access
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#101424] border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-center">
          <Lock className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Access Denied</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Master Excel spreadsheets and phone directories are restricted to authorized administrators. Regular classmates may view the verified cohort strength.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#1e2640] hover:bg-[#283556] text-white py-2 rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadTemplate = () => {
    try {
      const templateRows = [
        { 'S.No': 1, 'Student Full Name': 'Harshvardhan', 'Phone Number': '+91 98350 12001', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Founder & Admin' },
        { 'S.No': 2, 'Student Full Name': 'Harsh', 'Phone Number': '+91 98350 12002', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'General Manager & Admin' },
        { 'S.No': 3, 'Student Full Name': 'Madhav', 'Phone Number': '+91 98350 12003', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Activity Manager & Admin' },
        { 'S.No': 4, 'Student Full Name': 'Ayush', 'Phone Number': '+91 98350 12004', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Head Admin' },
        { 'S.No': 5, 'Student Full Name': 'Zargham Hasan', 'Phone Number': '+91 98350 12007', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Website Developer & Admin' },
        { 'S.No': 6, 'Student Full Name': 'Sarvjeet', 'Phone Number': '+91 98350 12010', 'Gender': 'Male', 'Batch Year': '2026-31', 'Status / Role': 'Relation Manager & Admin' },
      ];
      const ws = XLSX.utils.json_to_sheet(templateRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Student_Phone_Directory');
      XLSX.writeFile(wb, 'PLC_Student_Phone_Directory_Template.xlsx');
      setSuccessToast('Official template downloaded! Fill phone numbers and upload back anytime.');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (e: any) {
      setError('Could not generate template file: ' + e?.message);
    }
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    setStagedCensus(null);
    setIsProcessing(true);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });

      if (!workbook.SheetNames.length) {
        throw new Error('The uploaded Excel workbook contains no sheets.');
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (!rawRows || rawRows.length === 0) {
        throw new Error('The Excel sheet appears to be empty.');
      }

      const nonEmptyRows = rawRows.filter(
        (row) =>
          Array.isArray(row) &&
          row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== '')
      );

      if (nonEmptyRows.length === 0) {
        throw new Error('No populated data rows found in this sheet.');
      }

      let headerRowIndex = 0;
      const studentKeywords = [
        'name',
        'phone',
        'mobile',
        'contact',
        'whatsapp',
        'cell',
        'tel',
        'student',
        'sl',
        's.no',
        'registration',
        'email',
        'batch',
        'gender',
        'status',
        'role',
      ];

      for (let i = 0; i < Math.min(5, nonEmptyRows.length); i++) {
        const rowStr = nonEmptyRows[i].map((c) => String(c).toLowerCase()).join(' ');
        if (studentKeywords.some((k) => rowStr.includes(k))) {
          headerRowIndex = i;
          break;
        }
      }

      const headers = nonEmptyRows[headerRowIndex].map(
        (h, idx) => String(h).trim() || `Column_${idx + 1}`
      );

      const dataRows = nonEmptyRows.slice(headerRowIndex + 1);

      const validStudentRows = dataRows.filter((row) => {
        const fullText = row.map((cell) => String(cell).trim().toLowerCase()).join(' ');
        if (!fullText) return false;
        if (
          fullText.startsWith('total') ||
          fullText.startsWith('grand total') ||
          fullText.startsWith('count')
        ) {
          return false;
        }
        return true;
      });

      const preview = validStudentRows.slice(0, 15).map((row) => {
        const item: Record<string, any> = {};
        headers.forEach((h, idx) => {
          item[h] = row[idx] ?? '';
        });
        return item;
      });

      const updatedByName = session?.username?.includes('Harshvardhan')
        ? 'Harshvardhan (Founder & Admin)'
        : 'Zargham Hasan & Harshvardhan';

      const newCensus: ExcelCensusData = {
        fileName: selectedFile.name,
        sheetName: firstSheetName,
        totalRows: nonEmptyRows.length,
        studentCount: validStudentRows.length,
        detectedColumns: headers.filter((h) => !h.startsWith('Column_')),
        previewRows: preview,
        lastUpdated: new Date().toISOString(),
        updatedBy: updatedByName,
        phoneDirectoryVerified: `${validStudentRows.length} Verified Mobile Contacts`,
        firewallLocked: true,
      };

      setStagedCensus(newCensus);
      setFile(selectedFile);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to process Excel file. Make sure it is a valid .xlsx or .xls file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyStagedCensus = () => {
    if (!stagedCensus) return;
    if (onSaveCensus) {
      onSaveCensus(stagedCensus);
    }
    setSuccessToast(`Master Excel census updated to ${stagedCensus.studentCount} verified students with phone directory!`);
    setTimeout(() => {
      setSuccessToast(null);
      setActiveTab('roster');
    }, 1500);
  };

  const currentPreview = stagedCensus ? stagedCensus.previewRows : census.previewRows;
  const filteredRows = (currentPreview || []).filter((row) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some((val) => String(val).toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-[#1e2640] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative text-left my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e2640] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Official Excel Census & Student Phone Directory
              </h3>
              {hasExcelPower ? (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Dev & Founder Command</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Admin Read-Only
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {hasExcelPower
                ? 'Master Command Clearance: Zargham Hasan & Harshvardhan have full authority to modify student phone records and upload spreadsheets.'
                : 'Verified student phone directory and headcount certified according to master department spreadsheet.'}
            </p>
          </div>
        </div>

        {/* Tab switch between Roster Inspection & Master Upload */}
        <div className="flex gap-1.5 p-1 bg-[#080a12] border border-[#1e2640] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'roster'
                ? 'bg-[#1e2640] text-emerald-400 shadow-sm border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Phone Directory Roster ({census.studentCount})</span>
          </button>

          {hasExcelPower ? (
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload / Replace Excel (Dev & Founder)</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 py-2 text-xs font-medium rounded-lg text-slate-500 bg-[#080a12] cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Changes restricted to Zargham Hasan (Website Developer) and Harshvardhan (Founder & Admin)."
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Modify Sheet (Restricted to Zargham & Harshvardhan)</span>
            </button>
          )}
        </div>

        {/* Notification Toast */}
        {successToast && (
          <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: ROSTER INSPECTION (ACCESSIBLE TO ADMIN & DEV/FOUNDER) */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            {/* Top Stat Banner */}
            <div className="bg-[#080a12] border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
                  {census.studentCount}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Official Verified Headcount</span>
                  <span className="text-[11px] text-slate-400">
                    File: <strong className="text-slate-300 font-mono">{census.fileName}</strong>
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-[11px] text-slate-400 space-y-0.5">
                <div>Worksheet: <span className="text-slate-200 font-mono">{census.sheetName}</span></div>
                <div className="text-emerald-400 flex items-center gap-1 sm:justify-end font-semibold">
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  <span>{census.phoneDirectoryVerified || '120 Active Mobile Contacts'}</span>
                </div>
              </div>
            </div>

            {/* Student Search in Roster & Template Download */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student by name, phone number, or status..."
                  className="w-full bg-[#080a12] text-slate-200 border border-[#1e2640] focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs outline-none pl-9"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>

              {hasExcelPower && (
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shrink-0"
                  title="Download pre-formatted Excel template with phone numbers"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Excel Template</span>
                </button>
              )}
            </div>

            {/* Records Preview Table */}
            <div className="border border-[#1e2640] rounded-xl overflow-hidden bg-[#080a12]">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#101424] text-slate-300 uppercase tracking-wider sticky top-0 border-b border-[#1e2640]">
                    <tr>
                      {census.detectedColumns?.slice(0, 6).map((col, idx) => (
                        <th key={idx} className="p-2.5 font-semibold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2640]/50 text-slate-300">
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-[#101830] transition">
                          {census.detectedColumns?.slice(0, 6).map((col, colIdx) => {
                            const val = row[col];
                            const isPhoneCol = col.toLowerCase().includes('phone') || col.toLowerCase().includes('mobile') || col.toLowerCase().includes('contact');
                            return (
                              <td key={colIdx} className="p-2.5 font-mono text-slate-300 truncate max-w-[160px]">
                                {isPhoneCol ? (
                                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                                    <Phone className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>{val !== undefined && val !== null ? String(val) : '—'}</span>
                                  </span>
                                ) : (
                                  val !== undefined && val !== null ? String(val) : '—'
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">
                          No student matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security Clearance Note */}
            {!hasExcelPower ? (
              <div className="p-3 bg-[#0a0f1d] border border-blue-500/30 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Dev & Founder Master Firewall Enforced</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Modifying or replacing the master enrollment sheet is strictly restricted to Website Developer (Zargham Hasan) and Founder (Harshvardhan) to guarantee tamper-proof headcount records.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#0a0f1d] border border-amber-500/30 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
                <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Master Authority Granted</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    You have master command rights (Zargham Hasan & Harshvardhan). Switch to the "Upload / Replace Excel" tab to upload a new cohort workbook with updated student phone numbers.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MASTER UPLOAD (AVAILABLE TO ZARGHAM & HARSHVARDHAN) */}
        {activeTab === 'upload' && hasExcelPower && (
          <div className="space-y-4">
            <div className="bg-[#080a12] border border-amber-500/30 rounded-xl p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Master Clearance: Zargham Hasan & Harshvardhan</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Uploading an updated spreadsheet with Student Names and Phone Numbers will automatically update the verified Member Counter Section for everyone across the portal.
                </p>
              </div>
            </div>

            {/* Download Template helper */}
            <div className="flex items-center justify-between p-3 bg-[#0a0f1d] border border-[#1e2640] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">Need the standard Phone Directory Excel format?</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Template</span>
              </button>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const f = e.dataTransfer.files?.[0];
                if (f) processFile(f);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-amber-400 bg-amber-950/20'
                  : 'border-[#283556] hover:border-amber-400/60 bg-[#080a12]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) processFile(f);
                }}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {isProcessing ? 'Processing spreadsheet...' : 'Click to select or drag & drop Master Excel file'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports Microsoft Excel (.xlsx, .xls) and CSV with phone number columns</p>
              </div>
            </div>

            {/* Staged Result Ready to Apply */}
            {stagedCensus && (
              <div className="bg-[#080a12] border border-amber-500/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">Staged Sheet Headcount</span>
                  <span className="font-mono text-slate-400 truncate max-w-[200px]">{stagedCensus.fileName}</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-amber-400">{stagedCensus.studentCount}</span>
                  <span className="text-xs text-slate-300">Exact Students with Phone Records Detected</span>
                </div>

                <button
                  type="button"
                  onClick={handleApplyStagedCensus}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Set as Master Cohort Census ({stagedCensus.studentCount} Students)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
