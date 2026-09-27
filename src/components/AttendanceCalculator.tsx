import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Bot,
  Copy,
  Check,
  ChevronRight,
  Shield,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Sun,
  Flame,
  Award,
  ArrowRight
} from 'lucide-react';
import { PATNA_LAW_COLLEGE_HOLIDAYS_2026, SEMESTER_DATA, COLLEGE_TIMETABLE_RULES, CollegeHoliday, SemesterInfo } from '../data/collegeCalendar';

interface AttendanceCalculatorProps {
  onOpenExcelCounter?: () => void;
}

interface AiWeeklyDay {
  day: string;
  action: 'MUST_ATTEND' | 'SAFE_BUNK' | 'COLLEGE_HOLIDAY' | 'OPTIONAL';
  subjectOrEvent?: string;
  notes?: string;
}

interface AiWeekPlan {
  weekNumber: number;
  focus: string;
  daysToAttend: number;
  daysToBunk: number;
  daysSchedule: AiWeeklyDay[];
  proTip?: string;
}

interface AiSubjectBalance {
  subject: string;
  priority: 'HIGH' | 'MEDIUM' | 'FLEXIBLE';
  recommendation: string;
}

interface AiAttendancePlan {
  summary: {
    currentPercentage: number;
    status: 'SAFE' | 'CAUTION' | 'DETENTION_RISK';
    projectedFinalPercentage: number;
    totalLecturesEnd: number;
    minClassesMustAttend: number;
    maxSafeBunksAllowed: number;
    minDaysMustAttend: number;
    safeDaysCanBunk: number;
  };
  strategyHeadline: string;
  weeklyPlan: AiWeekPlan[];
  subjectWiseBalance: AiSubjectBalance[];
  patnaCollegeRulesAdvice: string[];
  darindaMotivationalNote: string;
}

export const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({ onOpenExcelCounter }) => {
  // Navigation Tabs: 'calculator' | 'ai-planner' | 'calendar' | 'ai-chat'
  const [activeTab, setActiveTab] = useState<'calculator' | 'ai-planner' | 'calendar' | 'ai-chat'>('calculator');

  // Core Attendance State
  const [totalHeld, setTotalHeld] = useState<number>(60);
  const [totalAttended, setTotalAttended] = useState<number>(45);

  // AI Planner Inputs
  const [selectedSemester, setSelectedSemester] = useState<SemesterInfo>(SEMESTER_DATA[0]);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [dailyLectures, setDailyLectures] = useState<number>(5);
  const [remainingWorkingDays, setRemainingWorkingDays] = useState<number>(28);
  const [plannedLeaves, setPlannedLeaves] = useState<string>('Chhath Puja home visit (5 days)');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiPlan, setAiPlan] = useState<AiAttendancePlan | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [planError, setPlanError] = useState<string | null>(null);

  // Calendar filter state
  const [holidayCategory, setHolidayCategory] = useState<string>('all');

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      role: 'assistant',
      text: 'Namaste advocate! I am the Patna Law College AI Attendance & Academic Advisor. How can I assist you with your attendance, college calendar, or condonation today?',
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const percentage = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;
  const isEligible = percentage >= 75;

  let safeBunks = 0;
  let requiredToRecover = 0;

  if (isEligible) {
    safeBunks = Math.max(0, Math.floor((totalAttended - 0.75 * totalHeld) / 0.75));
  } else {
    requiredToRecover = Math.max(0, Math.ceil((0.75 * totalHeld - totalAttended) / 0.25));
  }

  const getVerdict = () => {
    if (percentage >= 85) {
      return {
        title: 'Dean’s Honor List & Ganga Ghat Freedom',
        desc: 'You are completely safe from detention. You can comfortably relax along Rani Ghat or prepare for Moot Court finals.',
        color: 'text-emerald-400',
        badge: 'bg-emerald-950/40 border-emerald-800/60',
      };
    } else if (percentage >= 75) {
      return {
        title: 'Safe Territory (Exam Form Clearance Assured)',
        desc: `You meet the mandatory 75% BCI requirement. You have ${safeBunks} safe lecture bunks remaining before entering danger.`,
        color: 'text-amber-400',
        badge: 'bg-amber-950/40 border-amber-800/60',
      };
    } else if (percentage >= 66) {
      return {
        title: 'Caution: Medical Condonation Zone (66%–74%)',
        desc: `You need to attend the next ${requiredToRecover} consecutive classes without fail, or arrange an approved medical application to Principal.`,
        color: 'text-amber-500',
        badge: 'bg-amber-950/60 border-amber-700/60',
      };
    } else {
      return {
        title: 'Detention Alert: Below 66% Debar Bar',
        desc: `Under Bar Council of India Section 420 & PU rules, you must attend ${requiredToRecover} non-stop lectures immediately to avoid exam hall detention.`,
        color: 'text-red-400',
        badge: 'bg-red-950/60 border-red-800/60',
      };
    }
  };

  const verdict = getVerdict();

  // Call Server-Side Gemini API to Arrange Attendance Schedule
  const handleGenerateAiPlan = async () => {
    setIsAiLoading(true);
    setPlanError(null);

    try {
      const response = await fetch('/api/attendance-ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalHeld,
          totalAttended,
          semester: selectedSemester.name,
          targetPercentage,
          dailyLectures,
          remainingWorkingDays,
          plannedLeaves,
          subjects: selectedSemester.subjects,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setAiPlan(data.plan);
        setIsAiGenerated(Boolean(data.isAiGenerated));
      } else {
        throw new Error(data.error || 'Unable to generate plan');
      }
    } catch (err: any) {
      console.error('Error generating AI plan:', err);
      setPlanError('Network error or server unavailable. Try again in a moment.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auto-generate AI plan on first switch to planner if not already loaded
  useEffect(() => {
    if (activeTab === 'ai-planner' && !aiPlan && !isAiLoading) {
      handleGenerateAiPlan();
    }
  }, [activeTab]);

  // Handle AI Chat Message
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim() || isChatSending) return;

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setIsChatSending(true);

    try {
      const response = await fetch('/api/attendance-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          attendanceContext: {
            totalHeld,
            totalAttended,
            semester: selectedSemester.name,
          },
        }),
      });

      const data = await response.json();
      const botReply = data.reply || 'Apologies, I encountered an issue. Please try again.';

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network error communicating with the AI Advisor. Please try again in a few moments.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filtered holidays
  const filteredHolidays = PATNA_LAW_COLLEGE_HOLIDAYS_2026.filter((h) => {
    if (holidayCategory === 'all') return true;
    return h.category === holidayCategory;
  });

  return (
    <section id="calculator" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Patna Law College · AI Academic Hub
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Gemini 3.8 Flash Connected
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Attendance & College Calendar AI Strategist
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Arranges your lectures according to Patna University’s official holiday calendar & Bar Council of India 75% rule. Plan your leaves, optimize safe bunks, and never get debarred.
          </p>
        </div>

        {onOpenExcelCounter && (
          <button
            onClick={onOpenExcelCounter}
            className="inline-flex items-center gap-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/40 font-semibold px-4 py-2.5 rounded-lg text-xs transition shadow-sm self-start md:self-auto"
            title="Inspect student Excel roster (Admin Clearance)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Inspect Master Excel (Admin)</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#101424] border border-[#1e2640] rounded-xl mb-8">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'calculator'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2238]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>75% Rule Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-planner')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'ai-planner'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2238]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Calendar Attendance Scheduler</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">AI</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'calendar'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2238]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Patna College Calendar 2026</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'ai-chat'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2238]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Academic Counselor & Condonation Drafter</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 75% BCI Mandatory Calculator */}
      {/* ========================================================================= */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input controls */}
          <div className="lg:col-span-6 bg-[#101424] border border-[#1e2640] rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">Live Lecture Count</h3>
              </div>
              <span className="text-[11px] text-slate-400 bg-[#080a12] px-2.5 py-1 rounded-md border border-[#1e2640]">
                BCI 75% Ordinance
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Total Classes Held So Far</span>
                  <span className="text-amber-400 font-mono text-sm">{totalHeld}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={totalHeld}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTotalHeld(val);
                    if (totalAttended > val) setTotalAttended(val);
                  }}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-[#080a12] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>5 Lectures</span>
                  <span>150 Lectures</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Classes You Personally Attended</span>
                  <span className="text-amber-400 font-mono text-sm">{totalAttended}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalHeld}
                  value={totalAttended}
                  onChange={(e) => setTotalAttended(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer h-2 bg-[#080a12] rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>0</span>
                  <span>Max: {totalHeld}</span>
                </div>
              </div>

              {/* Quick manual number inputs */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Total Held (Input)</label>
                  <input
                    type="number"
                    min="1"
                    value={totalHeld}
                    onChange={(e) => {
                      const val = Math.max(1, Number(e.target.value));
                      setTotalHeld(val);
                      if (totalAttended > val) setTotalAttended(val);
                    }}
                    className="w-full bg-[#080a12] text-slate-200 border border-[#1e2640] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Attended (Input)</label>
                  <input
                    type="number"
                    min="0"
                    max={totalHeld}
                    value={totalAttended}
                    onChange={(e) => {
                      const val = Math.min(totalHeld, Math.max(0, Number(e.target.value)));
                      setTotalAttended(val);
                    }}
                    className="w-full bg-[#080a12] text-slate-200 border border-[#1e2640] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Switch to AI Planner Prompt */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-purple-950/40 border border-indigo-800/40 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-300">Want AI to arrange your remaining classes?</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Let Gemini arrange day-by-day attendance with Chhath & college holidays.</p>
                </div>
                <button
                  onClick={() => setActiveTab('ai-planner')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <span>AI Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-6 bg-[#101424] border border-[#1e2640] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400">Current Standing</span>
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-5xl font-extrabold font-mono tracking-tight text-white">
                  {percentage.toFixed(1)}%
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${verdict.badge} ${verdict.color}`}>
                  {isEligible ? 'ELIGIBLE' : 'DEBAR RISK'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#080a12] rounded-full h-3 mb-6 relative overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    percentage >= 75
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                      : 'bg-gradient-to-r from-red-600 to-amber-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                ></div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                  style={{ left: '75%' }}
                  title="75% Mandatory BCI Line"
                ></div>
              </div>

              {/* Metric Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#080a12] p-4 rounded-xl border border-[#1e2640]">
                  <span className="text-[11px] text-slate-400 block mb-1">Safe Bunks Remaining</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    {safeBunks} {safeBunks === 1 ? 'Class' : 'Classes'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Can miss without falling below 75%</p>
                </div>

                <div className="bg-[#080a12] p-4 rounded-xl border border-[#1e2640]">
                  <span className="text-[11px] text-slate-400 block mb-1">Must Attend to Reach 75%</span>
                  <span className="text-2xl font-bold font-mono text-amber-400">
                    {requiredToRecover} {requiredToRecover === 1 ? 'Class' : 'Classes'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Consecutive attendance required</p>
                </div>
              </div>

              {/* Verdict Box */}
              <div className={`p-4 rounded-xl border ${verdict.badge}`}>
                <h4 className={`text-sm font-bold ${verdict.color} mb-1 flex items-center gap-1.5`}>
                  {isEligible ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{verdict.title}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">{verdict.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AI Calendar Attendance Scheduler */}
      {/* ========================================================================= */}
      {activeTab === 'ai-planner' && (
        <div className="space-y-8">
          {/* Controls Bar for AI Optimization */}
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1e2640]">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>College Calendar Attendance Arranger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gemini analyzes semester holidays, working days (Mon-Sat), and your planned leaves to calculate the optimum attendance roadmap.
                </p>
              </div>

              <button
                onClick={handleGenerateAiPlan}
                disabled={isAiLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 transition shadow-lg shadow-amber-950/40 disabled:opacity-60 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'AI Calculating Schedule...' : 'Regenerate AI Schedule ✨'}</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Academic Semester</label>
                <select
                  value={selectedSemester.id}
                  onChange={(e) => {
                    const found = SEMESTER_DATA.find((s) => s.id === e.target.value);
                    if (found) setSelectedSemester(found);
                  }}
                  className="w-full bg-[#080a12] border border-[#1e2640] rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  {SEMESTER_DATA.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {selectedSemester.months} · Approx {selectedSemester.totalWorkingDaysApprox} working days
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Target Percentage</label>
                <select
                  value={targetPercentage}
                  onChange={(e) => setTargetPercentage(Number(e.target.value))}
                  className="w-full bg-[#080a12] border border-[#1e2640] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                >
                  <option value={75}>75% (Mandatory BCI Minimum)</option>
                  <option value={80}>80% (Comfortable Safe Zone)</option>
                  <option value={85}>85% (Dean’s Honor Pass)</option>
                  <option value={90}>90% (Distinction Roster)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">Current: {percentage.toFixed(1)}%</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Remaining Working Days</label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={remainingWorkingDays}
                  onChange={(e) => setRemainingWorkingDays(Number(e.target.value))}
                  className="w-full bg-[#080a12] border border-[#1e2640] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Excluding Sundays & declared holidays</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Planned Leaves / Personal Trips</label>
                <input
                  type="text"
                  placeholder="e.g. Chhath Puja (5 days), Sister wedding (3 days)"
                  value={plannedLeaves}
                  onChange={(e) => setPlannedLeaves(e.target.value)}
                  className="w-full bg-[#080a12] border border-[#1e2640] rounded-xl px-3 py-2 text-xs text-slate-200"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">AI factors this into safe bunk allocation</span>
              </div>
            </div>

            {planError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{planError}</span>
              </div>
            )}
          </div>

            {/* AI Generated Plan Output */}
          {aiPlan && (
            <div className="space-y-6">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Projected Final %</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
                    {aiPlan.summary.projectedFinalPercentage}%
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">Clear of BCI 75% limit</span>
                </div>

                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Min Classes to Attend</span>
                  <div className="text-3xl font-extrabold text-white font-mono mt-1">
                    {aiPlan.summary.minClassesMustAttend} <span className="text-xs text-slate-400 font-normal">lectures</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">≈ {aiPlan.summary.minDaysMustAttend} full college days</span>
                </div>

                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Safe Bunks Allowed</span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                    {aiPlan.summary.maxSafeBunksAllowed} <span className="text-xs text-slate-400 font-normal">lectures</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-1 block">≈ {aiPlan.summary.safeDaysCanBunk} safe off days</span>
                </div>

                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Academic Status</span>
                  <div className="text-xl font-bold text-white mt-2 flex items-center gap-1.5">
                    {aiPlan.summary.status === 'SAFE' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {aiPlan.summary.status === 'CAUTION' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {aiPlan.summary.status === 'DETENTION_RISK' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <span>{aiPlan.summary.status}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Patna Law College 2026</span>
                </div>
              </div>

              {/* Strategy Headline */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/30 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">AI Strategy Directive</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">{aiPlan.strategyHeadline}</p>
                </div>
              </div>

              {/* Weekly Day-by-Day Roadmap */}
              <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>Optimized Day-by-Day Attendance Roadmap</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Arranged specifically to accommodate your planned leaves and festival dates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Must Attend
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-500" /> Safe Bunk
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" /> Holiday
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  {aiPlan.weeklyPlan.map((week) => (
                    <div key={week.weekNumber} className="bg-[#080a12] border border-[#1e2640] rounded-xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1e2640]">
                        <div>
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            Week {week.weekNumber} · {week.focus}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-emerald-400 font-semibold">{week.daysToAttend} Days Attend</span>
                          <span className="text-slate-500">|</span>
                          <span className="text-amber-400 font-semibold">{week.daysToBunk} Days Rest/Bunk</span>
                        </div>
                      </div>

                      {/* Day schedule grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {week.daysSchedule.map((dayItem, idx) => {
                          const isMust = dayItem.action === 'MUST_ATTEND';
                          const isBunk = dayItem.action === 'SAFE_BUNK';
                          const isHoliday = dayItem.action === 'COLLEGE_HOLIDAY';

                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border text-xs flex flex-col justify-between min-h-[110px] ${
                                isMust
                                  ? 'bg-emerald-950/20 border-emerald-800/40'
                                  : isBunk
                                  ? 'bg-amber-950/20 border-amber-800/40'
                                  : isHoliday
                                  ? 'bg-indigo-950/20 border-indigo-800/40'
                                  : 'bg-[#101424] border-[#1e2640]'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-slate-200">{dayItem.day}</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                                      isMust
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : isBunk
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : isHoliday
                                        ? 'bg-indigo-500/20 text-indigo-400'
                                        : 'bg-slate-800 text-slate-300'
                                    }`}
                                  >
                                    {isMust ? 'ATTEND' : isBunk ? 'SAFE BUNK' : isHoliday ? 'HOLIDAY' : 'OPTIONAL'}
                                  </span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-300 leading-tight">
                                  {dayItem.subjectOrEvent || 'Lectures'}
                                </p>
                              </div>
                              {dayItem.notes && (
                                <p className="text-[10px] text-slate-400 mt-2 italic line-clamp-2">
                                  {dayItem.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {week.proTip && (
                        <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>Dean’s Pro Tip:</strong> {week.proTip}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject-Wise Balancing & Condonation Rules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subjects Priority */}
                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>Subject-Wise Attendance Distribution</span>
                  </h4>
                  <div className="space-y-3">
                    {aiPlan.subjectWiseBalance.map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200">{item.subject}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                              item.priority === 'HIGH'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : item.priority === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {item.priority} PRIORITY
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{item.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patna Law College & BCI Legal Guidelines */}
                <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Official Patna University & BCI Condonation Ordinances</span>
                    </h4>
                    <ul className="space-y-3 text-xs text-slate-300">
                      {aiPlan.patnaCollegeRulesAdvice.map((advice, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Motivational Note */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30">
                    <p className="text-xs text-amber-300 font-semibold mb-1 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Munna Darinda Fraternal Brotherhood</span>
                    </p>
                    <p className="text-xs text-slate-300 italic">"{aiPlan.darindaMotivationalNote}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: Official College Calendar 2026 */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1e2640]">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>Patna Law College Official Academic Calendar (2026)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Constituent College of Patna University · Rani Ghat Road, Mahendru, Patna
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Dates' },
                  { id: 'festival', label: 'Festivals & Chhath' },
                  { id: 'gazetted', label: 'Gazetted' },
                  { id: 'vacation', label: 'Vacations' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setHolidayCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      holidayCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-[#080a12] text-slate-400 hover:text-slate-200 border border-[#1e2640]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable rules summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs">
                <span className="text-slate-400 block mb-1">Weekly Schedule</span>
                <span className="text-sm font-bold text-slate-100">Monday to Saturday</span>
                <p className="text-[10px] text-slate-500 mt-1">Sundays are strictly Weekly Off</p>
              </div>

              <div className="p-4 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs">
                <span className="text-slate-400 block mb-1">Daily Lecture Periods</span>
                <span className="text-sm font-bold text-slate-100">5 Periods / Day</span>
                <p className="text-[10px] text-slate-500 mt-1">10:00 AM to 5:00 PM</p>
              </div>

              <div className="p-4 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs">
                <span className="text-slate-400 block mb-1">BCI Minimum Attendance</span>
                <span className="text-sm font-bold text-emerald-400">75% Mandatory</span>
                <p className="text-[10px] text-slate-500 mt-1">Both overall & per subject</p>
              </div>

              <div className="p-4 bg-[#080a12] border border-[#1e2640] rounded-xl text-xs">
                <span className="text-slate-400 block mb-1">Condonation Allowance</span>
                <span className="text-sm font-bold text-amber-400">66% to 74% with Medical</span>
                <p className="text-[10px] text-slate-500 mt-1">Below 66% = Debarred</p>
              </div>
            </div>

            {/* Holidays List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="bg-[#080a12] border border-[#1e2640] rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-bold text-slate-100 text-xs sm:text-sm">{holiday.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          holiday.category === 'festival'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : holiday.category === 'vacation'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {holiday.days} {holiday.days === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {holiday.startDate}
                        {holiday.startDate !== holiday.endDate ? ` to ${holiday.endDate}` : ''}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{holiday.description}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1e2640] flex items-center justify-between text-[11px] text-slate-500">
                    <span className="capitalize">{holiday.category} Holiday</span>
                    <span className="text-emerald-400 font-medium">Campus Closed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AI Academic Counselor & Application Drafter Chat */}
      {/* ========================================================================= */}
      {activeTab === 'ai-chat' && (
        <div className="bg-[#101424] border border-[#1e2640] rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[580px]">
          {/* Chat Header */}
          <div className="p-4 bg-[#080a12] border-b border-[#1e2640] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Patna Law College AI Academic Advisor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  Powered by Gemini 3.8 Flash · Current Record: {percentage.toFixed(1)}% ({totalAttended}/{totalHeld} lectures)
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-[#101424] border border-[#1e2640]">
                Rani Ghat, Mahendru
              </span>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-[#0d1120] border-b border-[#1e2640] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-slate-500 text-[11px] shrink-0 font-medium">Ask AI:</span>
            {[
              'Draft formal medical leave application for Principal',
              'How to recover attendance from 62% to 75%?',
              'What are the upcoming holidays in Patna Law College calendar?',
              'Explain BCI 75% rule & condonation exceptions',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(prompt)}
                disabled={isChatSending}
                className="px-2.5 py-1 rounded-lg bg-[#101424] hover:bg-[#1a2238] text-slate-300 hover:text-amber-300 border border-[#1e2640] text-[11px] shrink-0 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[460px]">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-indigo-600 text-white shadow-md'
                  }`}
                >
                  {msg.role === 'user' ? 'You' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-[#080a12] border border-[#1e2640] text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(msg.text, idx)}
                        className="hover:text-amber-400 flex items-center gap-1 transition"
                        title="Copy text"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Text / Application</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isChatSending && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-[#080a12] border border-[#1e2640] rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Gemini AI is analyzing calendar & drafting response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-[#080a12] border-t border-[#1e2640]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask anything about college calendar, 75% attendance recovery, leaves, or condonation..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isChatSending}
                className="flex-1 bg-[#101424] border border-[#1e2640] focus:border-amber-500 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatSending}
                className="p-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
