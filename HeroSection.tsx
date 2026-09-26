import React, { useRef } from 'react';
import { Users, ExternalLink, Shield, Upload, Image as ImageIcon, Flame, Edit3, MessageCircle, Landmark, Sparkles } from 'lucide-react';
import { AuthSession, DualLogos } from '../types';
import { VisualContent } from '../utils/visualContent';

interface HeroSectionProps {
  session: AuthSession | null;
  logos?: DualLogos;
  onOpenLogoModal?: () => void;
  // legacy fallbacks
  customLogoUrl?: string;
  onUpdateLogoUrl?: (url: string) => void;
  visualContent: VisualContent;
  isEditMode: boolean;
  onUpdateText: (key: keyof VisualContent, val: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  session,
  logos,
  onOpenLogoModal,
  customLogoUrl,
  visualContent,
  isEditMode,
  onUpdateText,
}) => {
  const plcLogo = logos?.plcLogoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80';
  const teamLogo = logos?.teamLogoUrl || customLogoUrl || '/images/munna_darinda_crest_1790312929421.jpg';

  const whatsappUrl = 'https://wa.me/919835012001?text=Hello%20Harshvardhan%20%26%20Munna%20Darinda%20Team%2C%20I%20am%20a%20Patna%20Law%20College%20student%20and%20want%20to%20connect.';

  const editableClass = isEditMode
    ? 'outline-dashed outline-2 outline-amber-400/80 bg-amber-500/10 cursor-text rounded px-1 transition-all'
    : '';

  return (
    <section id="sec-hero-darinda" className="py-14 md:py-20 px-4 sm:px-6 max-w-[1240px] mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Messaging & CTAs */}
        <div className="flex-1 max-w-2xl text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateText('heroBadge', e.currentTarget.textContent || '')}
              className={editableClass}
              title={isEditMode ? 'Click to edit badge text' : undefined}
            >
              {visualContent.heroBadge}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15] mb-5">
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateText('heroTitlePrefix', e.currentTarget.textContent || '')}
              className={editableClass}
              title={isEditMode ? 'Click to edit prefix' : undefined}
            >
              {visualContent.heroTitlePrefix}
            </span>{' '}
            <br />
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateText('heroTitleHighlight', e.currentTarget.textContent || '')}
              className={`text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200 ${editableClass}`}
              title={isEditMode ? 'Click to edit highlight title' : undefined}
            >
              {visualContent.heroTitleHighlight}
            </span>{' '}
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateText('heroTitleSuffix', e.currentTarget.textContent || '')}
              className={editableClass}
              title={isEditMode ? 'Click to edit suffix' : undefined}
            >
              {visualContent.heroTitleSuffix}
            </span>
          </h1>

          <p
            contentEditable={isEditMode}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateText('heroSubtitle', e.currentTarget.textContent || '')}
            className={`text-base sm:text-lg text-slate-300 mb-8 leading-relaxed ${editableClass}`}
            title={isEditMode ? 'Click to edit subtitle' : undefined}
          >
            {visualContent.heroSubtitle}
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <a
              href="#crew"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-900/25 hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              <span>Meet The Crew</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-900/25 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Get in Touch (WhatsApp)</span>
            </a>

            <a
              href="#slideshow"
              className="inline-flex items-center justify-center gap-2 bg-[#101424] hover:bg-[#1a213b] text-slate-200 border border-[#1e2640] hover:border-amber-500/40 px-4 py-3 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Campus Showcase</span>
            </a>

            <a
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 text-amber-300 border border-amber-500/40 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Attendance & Calendar</span>
            </a>

            <a
              href="#location-section"
              className="inline-flex items-center justify-center gap-2 bg-[#101424] hover:bg-[#1a213b] text-slate-200 border border-[#1e2640] hover:border-amber-500/40 px-4 py-3 rounded-xl font-medium text-sm transition-all hover:-translate-y-0.5"
            >
              <Landmark className="w-4 h-4 text-blue-400" />
              <span>Visit Us (Map)</span>
            </a>
          </div>

          {/* Founders strip */}
          <div className="pt-6 border-t border-[#1e2640] flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Admin & Founder</span>
              <strong className="text-slate-200 font-semibold">Harshvardhan</strong>
            </div>
            <div className="h-6 w-px bg-[#1e2640] hidden sm:block"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Website Developer</span>
              <strong className="text-slate-200 font-semibold">Zargham Hasan</strong>
            </div>
            <div className="h-6 w-px bg-[#1e2640] hidden sm:block"></div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase tracking-wider">Institution</span>
              <span className="text-amber-400 font-medium">Patna Law College (Mahendru)</span>
            </div>
          </div>
        </div>

        {/* Right Column: DUAL LOGOS DISPLAY */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
          <div className="w-full bg-[#101424] border border-[#1e2640] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Header tag */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1e2640] text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Official Dual Crests
              </span>
              <span className="text-[10px] text-slate-500">Patna Law College & Munna Darinda</span>
            </div>

            {/* The Two Logo Frames Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Logo 1: Patna Law College Official Logo */}
              <div className="bg-[#080a12] border border-[#1e2640] hover:border-amber-500/50 rounded-xl p-3 flex flex-col items-center text-center transition group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#101424] border-2 border-amber-500/40 p-1 mb-2.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                  <img
                    src={plcLogo}
                    alt="Patna Law College Official Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-full">
                  Patna Law College
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium block">
                  Estd. 1909 · Emblem
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  College Logo
                </span>
              </div>

              {/* Logo 2: Munna Darinda Team Crest */}
              <div className="bg-[#080a12] border border-[#1e2640] hover:border-red-500/50 rounded-xl p-3 flex flex-col items-center text-center transition group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#101424] border-2 border-red-500/40 p-1 mb-2.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                  <img
                    src={teamLogo}
                    alt="Munna Darinda Team Crest"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-200 block truncate max-w-full">
                  Munna Darinda
                </span>
                <span className="text-[10px] text-red-400/90 font-medium block">
                  BBA.LLB Batch Crest
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/30">
                  Team Logo
                </span>
              </div>
            </div>

            {/* Admin Edit Trigger */}
            {session?.role === 'admin' && onOpenLogoModal && (
              <button
                type="button"
                onClick={onOpenLogoModal}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#1e2640] hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Configure / Change Both Logos (Admin)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
