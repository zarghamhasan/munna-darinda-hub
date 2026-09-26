import React, { useState } from 'react';
import {
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  X,
  Type,
  Eye,
  Info,
} from 'lucide-react';
import { VisualContent } from '../utils/visualContent';
import { AuthSession } from '../types';

interface VisualEditDockProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  content: VisualContent;
  onUpdateContent: (updated: Partial<VisualContent>) => void;
  onResetContent: () => void;
  session: AuthSession | null;
}

export const VisualEditDock: React.FC<VisualEditDockProps> = ({
  isEditMode,
  onToggleEditMode,
  content,
  onUpdateContent,
  onResetContent,
  session,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<VisualContent>(content);
  const [savedToast, setSavedToast] = useState(false);

  const handleOpenModal = () => {
    setFormData(content);
    setModalOpen(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContent(formData);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      setModalOpen(false);
    }, 800);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website text back to original factory wording?')) {
      onResetContent();
      setModalOpen(false);
    }
  };

  return (
    <>
      {/* Floating Visual Edit Dock */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#101424]/95 backdrop-blur-md border border-amber-500/40 p-2 rounded-2xl shadow-2xl shadow-black/80">
        <button
          type="button"
          onClick={onToggleEditMode}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            isEditMode
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30'
          }`}
          title="Toggle inline visual text editing (Click any text on the page to edit words directly)"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditMode ? 'Visual Edit: ACTIVE' : 'Visual Edit Words'}</span>
        </button>

        <button
          type="button"
          onClick={handleOpenModal}
          className="p-2 rounded-xl bg-[#1e2640] hover:bg-[#283556] text-slate-300 hover:text-white border border-[#2b3960] transition"
          title="Open Text & Slogans Customizer Dialog"
        >
          <Sliders className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Floating Active Edit Banner when mode is ON */}
      {isEditMode && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Edit3 className="w-3.5 h-3.5 text-slate-950" />
          <span>Live Visual Edit ON: Click directly on highlighted text to type & change words</span>
          <button
            type="button"
            onClick={onToggleEditMode}
            className="ml-2 bg-slate-950 text-white rounded-full px-2 py-0.5 text-[10px] hover:bg-slate-800"
          >
            Done Editing
          </button>
        </div>
      )}

      {/* Visual Text Customizer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101424] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8 text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e2640]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Website Visual Text Editor</h3>
                <p className="text-xs text-slate-400">Customize titles, slogans, badges, and catchphrases.</p>
              </div>
            </div>

            <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3 mb-4 text-xs text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                You can also type words directly on the page by toggling <strong>Visual Edit: ACTIVE</strong>!
              </span>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Hero Badge */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  1. Hero Pill Badge
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => setFormData({ ...formData, heroBadge: e.target.value })}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* Hero Title Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title Prefix
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitlePrefix}
                    onChange={(e) => setFormData({ ...formData, heroTitlePrefix: e.target.value })}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-300 mb-1">
                    Gradient Highlight
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleHighlight}
                    onChange={(e) => setFormData({ ...formData, heroTitleHighlight: e.target.value })}
                    className="w-full bg-[#080a12] text-amber-300 font-bold border border-amber-500/40 focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title Suffix
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleSuffix}
                    onChange={(e) => setFormData({ ...formData, heroTitleSuffix: e.target.value })}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Hero Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  2. Hero Subtitle & Motto
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              {/* Wordmark Navigation Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Header Wordmark Name
                  </label>
                  <input
                    type="text"
                    value={formData.wordmarkTitle}
                    onChange={(e) => setFormData({ ...formData, wordmarkTitle: e.target.value })}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Header Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.wordmarkSubtitle}
                    onChange={(e) => setFormData({ ...formData, wordmarkSubtitle: e.target.value })}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Voting Section Title & Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  3. Batch Voting Arena Title
                </label>
                <input
                  type="text"
                  value={formData.votingSectionTitle}
                  onChange={(e) => setFormData({ ...formData, votingSectionTitle: e.target.value })}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* The Crew Section Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  4. Crew Section Title
                </label>
                <input
                  type="text"
                  value={formData.crewSectionTitle}
                  onChange={(e) => setFormData({ ...formData, crewSectionTitle: e.target.value })}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* Footer Slogan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  5. Footer Slogan
                </label>
                <input
                  type="text"
                  value={formData.footerSlogan}
                  onChange={(e) => setFormData({ ...formData, footerSlogan: e.target.value })}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              {savedToast && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Website text updated and saved!</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-[#1e2640]">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes to Website</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2.5 bg-[#1e2640] hover:bg-[#283556] text-slate-400 hover:text-white rounded-xl text-xs flex items-center gap-1"
                  title="Reset to factory wording"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
