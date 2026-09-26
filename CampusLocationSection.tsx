import React from 'react';
import { MapPin, Navigation, Clock, Phone, ExternalLink, MessageCircle, Bus, Landmark, ShieldCheck } from 'lucide-react';

export const CampusLocationSection: React.FC = () => {
  const googleMapsUrl = 'https://maps.google.com/?q=Patna+Law+College+Mahendru+Patna+Bihar';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Patna+Law+College+Rani+Ghat+Mahendru+Patna';
  const whatsappUrl = 'https://wa.me/919835012001?text=Hello%20Patna%20Law%20College%20Team%2C%20I%20want%20to%20inquire%20about%20campus%20location%20and%20admissions.';

  return (
    <section id="location-section" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            Patna University Heritage Campus
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            Visit Us · Patna Law College
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Located right on the banks of River Ganga along Rani Ghat Road in historic Mahendru, Patna.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-amber-950/40"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-950/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Google Map + Info cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Google Map Embedded Iframe (7 or 8 columns) */}
        <div className="lg:col-span-8 bg-[#101424] border border-[#1e2640] rounded-2xl overflow-hidden shadow-2xl relative min-h-[380px] sm:min-h-[440px] flex flex-col">
          <div className="p-3 bg-[#080a12] border-b border-[#1e2640] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-200">Patna Law College, Mahendru</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">· Live Map View</span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <span>Enlarge Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative flex-1 w-full h-full min-h-[340px]">
            <iframe
              title="Patna Law College Mahendru Google Map Location"
              src="https://maps.google.com/maps?q=Patna+Law+College,+Rani+Ghat+Road,+Mahendru,+Patna,+Bihar+800006&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[25%] contrast-[110%] hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>

        {/* Location Details & Address Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
          {/* Card 1: Official Postal Address */}
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1">Official Postal Address</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Patna Law College</strong><br />
              Rani Ghat Road, Patna University Campus,<br />
              Post: Mahendru, Dist: Patna,<br />
              Bihar – 800006 (India)
            </p>
          </div>

          {/* Card 2: Landmarks & Commute */}
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              <Bus className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1">Landmarks & Transit</h4>
            <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <li>• <strong>Rani Ghat & River Ganga:</strong> Direct campus frontage</li>
              <li>• <strong>Ashok Rajpath:</strong> 300 meters from main gate</li>
              <li>• <strong>Patna Junction:</strong> ~5.2 km (Direct Auto/e-Rickshaw)</li>
              <li>• <strong>Gandhi Maidan:</strong> ~3.8 km via Ashok Rajpath</li>
            </ul>
          </div>

          {/* Card 3: College Hours & Student Desk */}
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-5 shadow-lg">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1">Academic & Office Hours</h4>
            <p className="text-xs text-slate-300">
              Monday to Saturday: <strong className="text-white">10:00 AM – 5:00 PM</strong><br />
              Sunday & Gazetted Holidays: <span className="text-slate-400">Closed</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
