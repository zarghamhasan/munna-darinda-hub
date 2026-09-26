import React from 'react';
import { Mail, Shield, Scale, Heart, MapPin, MessageCircle, Navigation, Landmark } from 'lucide-react';
import { VisualContent } from '../utils/visualContent';
import { DualLogos } from '../types';

interface FooterProps {
  visualContent?: VisualContent;
  logos?: DualLogos;
}

export const Footer: React.FC<FooterProps> = ({ visualContent, logos }) => {
  const plcLogo = logos?.plcLogoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&q=80';
  const teamLogo = logos?.teamLogoUrl || '/images/munna_darinda_crest_1790312929421.jpg';

  const whatsappUrl = 'https://wa.me/919835012001?text=Hello%20Patna%20Law%20College%20Munna%20Darinda%20Team%2C%20I%20want%20to%20get%20in%20touch.';
  const mapsUrl = 'https://maps.google.com/?q=Patna+Law+College+Mahendru+Patna+Bihar';

  return (
    <footer className="bg-[#04060b] border-t border-[#1e2640] py-14 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand, Dual Logos & Purpose */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#101424] border border-amber-500/50 p-0.5 shrink-0 shadow-md">
                <img src={plcLogo} alt="Patna Law College Emblem" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#101424] border border-red-500/50 p-0.5 shrink-0 shadow-md">
                <img src={teamLogo} alt="Munna Darinda Team Crest" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  {visualContent?.wordmarkTitle || 'Munna Darinda Team'}
                </span>
                <span className="text-[11px] text-amber-400/90 font-medium block">
                  Patna Law College · Mahendru Campus
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-sm">
              {visualContent?.footerSlogan ||
                'The official fraternal hub, student directory, and academic resource center for Patna Law College (BBA.LLB). Built for solidarity, excellence, and memories.'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get in Touch (WhatsApp)</span>
              </a>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101424] border border-[#1e2640] text-slate-300 hover:text-amber-300 text-xs font-medium transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Map</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Batch Quick Nav
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#slideshow" className="hover:text-amber-400 transition">Campus Highlights & Slideshow</a></li>
              <li><a href="#location-section" className="hover:text-amber-400 transition">Visit Us & Google Maps</a></li>
              <li><a href="#crew" className="hover:text-amber-400 transition">The Crew & Leadership</a></li>
              <li><a href="#notices" className="hover:text-amber-400 transition">Official Notices & Circulars</a></li>
              <li><a href="#vault" className="hover:text-amber-400 transition">BBA.LLB Study Vault & PYQs</a></li>
              <li><a href="#calculator" className="hover:text-amber-400 transition">75% Attendance Calculator</a></li>
              <li><a href="#confessions" className="hover:text-amber-400 transition">Anonymous Batch Wall</a></li>
              <li><a href="#links-section" className="hover:text-amber-400 transition">Google Forms & WhatsApp</a></li>
            </ul>
          </div>

          {/* Col 3: Leadership & Credits */}
          <div className="md:col-span-4 bg-[#0a0d18] border border-[#1e2640] rounded-xl p-5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Founders & Developer Credits</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Admin & Founder</span>
                <span className="text-white font-bold text-sm">HARSHVARDHAN</span>
                <p className="text-slate-400 text-[11px]">Patna Law College BBA.LLB Pillar & Organizer</p>
              </div>

              <div className="pt-2 border-t border-[#1e2640]">
                <span className="text-slate-500 block text-[10px] uppercase">Website Developer & Co-Founder</span>
                <span className="text-white font-bold text-sm">ZARGHAM HASAN</span>
                <a
                  href="mailto:zarghamhasan72@gmail.com"
                  className="text-amber-400/90 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  <span>zarghamhasan72@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#1e2640]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Munna Darinda Team · Patna Law College (BBA.LLB). All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Crafted with pride by <strong className="text-slate-200">Zargham Hasan</strong> and <strong className="text-slate-200">Harshvardhan</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
