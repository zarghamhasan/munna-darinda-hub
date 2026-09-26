import React, { useState } from 'react';
import { Shield, Menu, X, LogIn, Crown, Landmark, MessageCircle } from 'lucide-react';
import { AuthSession, DualLogos } from '../types';
import { VisualContent } from '../utils/visualContent';

interface HeaderProps {
  session: AuthSession | null;
  onOpenGatekeeper: () => void;
  visualContent?: VisualContent;
  logos?: DualLogos;
  onOpenLogoModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onOpenGatekeeper,
  visualContent,
  logos,
  onOpenLogoModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Showcase', href: '#slideshow' },
    { label: 'The Crew', href: '#crew' },
    { label: 'Batch Census', href: '#census-counter' },
    { label: 'Batch Voting', href: '#voting' },
    { label: 'Official Links', href: '#links-section' },
    { label: 'Notice Board', href: '#notices' },
    { label: 'Study Vault', href: '#vault' },
    { label: 'AI Attendance', href: '#calculator' },
    { label: 'Visit Us', href: '#location-section' },
  ];

  const plcLogo = logos?.plcLogoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80';
  const teamLogo = logos?.teamLogoUrl || '/images/munna_darinda_crest_1790312929421.jpg';

  const whatsappUrl = 'https://wa.me/919835012001?text=Hello%20Patna%20Law%20College%20Munna%20Darinda%20Portal%2C%20I%20want%20to%20get%20in%20touch.';

  return (
    <header className="sticky top-0 z-40 bg-[#080a12]/92 backdrop-blur-md border-b border-[#1e2640]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Dual Logos + Wordmark branding */}
        <div className="flex items-center gap-2.5">
          {/* Logo 1: Patna Law College Official Emblem */}
          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={session?.role === 'admin' ? onOpenLogoModal : undefined}
            title={session?.role === 'admin' ? 'Click to change logos (Admin)' : 'Patna Law College (Estd. 1909)'}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#101424] border border-amber-500/50 p-0.5 shrink-0 shadow-sm flex items-center justify-center">
              <img
                src={plcLogo}
                alt="Patna Law College Official Crest"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Logo 2: Munna Darinda Batch Crest */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#101424] border border-red-500/50 p-0.5 shrink-0 shadow-sm flex items-center justify-center">
              <img
                src={teamLogo}
                alt="Munna Darinda Team Crest"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <a href="#" className="flex flex-col group min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors truncate">
              {visualContent?.wordmarkTitle || 'Munna Darinda Hub'}
            </span>
            <span className="text-[10px] font-normal text-slate-400 truncate">
              {visualContent?.wordmarkSubtitle || 'Patna Law College · BBA.LLB'}
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions + Get In Touch WhatsApp Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick WhatsApp "Get in Touch" Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-emerald-950/40"
            title="Chat directly on WhatsApp with Batch Representatives"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Get in Touch</span>
          </a>

          {session?.role === 'admin' ? (
            <button
              onClick={onOpenGatekeeper}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/20"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin Deck</span>
            </button>
          ) : session?.role === 'classmate' ? (
            <button
              onClick={onOpenGatekeeper}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#1e2640] hover:bg-[#293457] rounded-lg transition-colors whitespace-nowrap border border-[#2e3b62]"
            >
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>Classmate Active</span>
            </button>
          ) : (
            <button
              onClick={onOpenGatekeeper}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-red-900/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portal Unlock</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101424] border-b border-[#1e2640] px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2640]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 rounded-lg"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Get in Touch (WhatsApp)</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-2 rounded text-xs text-slate-300 hover:text-white hover:bg-[#1e2640] font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1e2640]">
            <p className="text-[11px] text-slate-500">
              Munna Darinda Team · Patna Law College BBA.LLB
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
