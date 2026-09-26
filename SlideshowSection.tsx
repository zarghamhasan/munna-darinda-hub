import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Maximize2,
  X,
  Camera,
  Layers,
} from 'lucide-react';
import { SlideItem, AuthSession } from '../types';

interface SlideshowSectionProps {
  slides: SlideItem[];
  session: AuthSession | null;
  onOpenManageModal: () => void;
  onOpenEditSlide: (slide: SlideItem) => void;
  onDeleteSlide: (id: string) => void;
}

export const SlideshowSection: React.FC<SlideshowSectionProps> = ({
  slides,
  session,
  onOpenManageModal,
  onOpenEditSlide,
  onDeleteSlide,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides === 0) return;
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  useEffect(() => {
    if (!isPlaying || totalSlides <= 1 || lightboxOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSlides, lightboxOpen, currentIndex]);

  const goToNext = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const goToPrev = () => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (totalSlides === 0) {
    return (
      <section id="slideshow" className="py-12 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
        <div className="bg-[#101424] border border-[#1e2640] rounded-2xl p-8 text-center">
          <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-200">No Slides Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Admins can upload campus highlights and event memories.</p>
          {session?.role === 'admin' && (
            <button
              onClick={onOpenManageModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Slide</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section id="slideshow" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Campus Highlights & Cohort Gallery
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            Patna Law College Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl">
            Centennial heritage at Mahendru, fierce moot court advocacy, riverside gatherings, and batch life.
          </p>
        </div>

        {/* Admin Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {session?.role === 'admin' && (
            <button
              onClick={onOpenManageModal}
              className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              title="Admin: Add, edit, or reorder slides"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Manage Slides ({totalSlides})</span>
            </button>
          )}

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-[#101424] border border-[#1e2640] hover:bg-[#1a2138] text-slate-300 transition"
            title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Slideshow Frame */}
      <div
        className="relative rounded-2xl overflow-hidden bg-[#080a12] border border-[#1e2640] shadow-2xl group min-h-[380px] sm:min-h-[460px] md:min-h-[520px] flex items-end"
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        {/* Background Image with smooth transition */}
        <div className="absolute inset-0">
          <img
            key={currentSlide.id}
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-100 group-hover:scale-105"
          />
          {/* Multi-layered Vignette gradient overlay for cinematic readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a12] via-[#080a12]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080a12]/80 via-transparent to-[#080a12]/40" />
        </div>

        {/* Admin Quick Edit Tools overlay on slide */}
        {session?.role === 'admin' && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#080a12]/85 backdrop-blur-md border border-[#1e2640] p-1.5 rounded-xl shadow-lg">
            <span className="text-[10px] font-bold text-amber-400 px-2 uppercase">Slide #{currentIndex + 1}</span>
            <button
              onClick={() => onOpenEditSlide(currentSlide)}
              className="p-1.5 rounded-lg bg-[#1e2640] hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition"
              title="Edit current slide"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {totalSlides > 1 && (
              <button
                onClick={() => onDeleteSlide(currentSlide.id)}
                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white transition"
                title="Delete current slide"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Lightbox Trigger */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-[#080a12]/70 hover:bg-[#080a12] border border-[#1e2640] text-slate-300 hover:text-white transition backdrop-blur-md opacity-80 hover:opacity-100"
          title="Fullscreen view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Content Box */}
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-left">
          {currentSlide.badge && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {currentSlide.badge}
            </span>
          )}

          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md">
            {currentSlide.title}
          </h3>

          <p className="text-xs sm:text-sm font-medium text-amber-300/90 mb-2">
            {currentSlide.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3 sm:line-clamp-none max-w-xl">
            {currentSlide.description}
          </p>

          {currentSlide.actionUrl && (
            <a
              href={currentSlide.actionUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition shadow-md shadow-amber-950/50"
            >
              <span>{currentSlide.actionText || 'Explore More'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Prev / Next Arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#080a12]/75 hover:bg-[#080a12] border border-[#1e2640] text-slate-300 hover:text-white flex items-center justify-center transition backdrop-blur-md shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#080a12]/75 hover:bg-[#080a12] border border-[#1e2640] text-slate-300 hover:text-white flex items-center justify-center transition backdrop-blur-md shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Slide Indicators & Progress */}
        <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/50'
                  : 'w-2 bg-slate-600/70 hover:bg-slate-400'
              }`}
              aria-label={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Bar */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className={`flex items-center gap-3 p-2 rounded-xl text-left transition border ${
              idx === currentIndex
                ? 'bg-[#101424] border-amber-500/50 ring-1 ring-amber-500/30 shadow-md'
                : 'bg-[#080a12]/60 border-[#1e2640] hover:border-slate-700 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase block truncate">
                {slide.category || `Slide 0${idx + 1}`}
              </span>
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {slide.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full text-center">
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="max-h-[75vh] mx-auto rounded-2xl shadow-2xl object-contain"
            />
            <h4 className="text-xl font-bold text-white mt-4">{currentSlide.title}</h4>
            <p className="text-xs text-amber-300">{currentSlide.subtitle}</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">{currentSlide.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};
