import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Layers,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SlideItem } from '../types';
import { processImageFile } from '../utils/imageUtils';
import { INITIAL_SLIDES } from '../data/initialData';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideItem[];
  onSaveSlides: (slides: SlideItem[]) => void;
  editingSlide?: SlideItem | null;
}

export const SlideModal: React.FC<SlideModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSaveSlides,
  editingSlide,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'list'>('edit');
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [actionText, setActionText] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingSlide) {
      setCurrentSlideId(editingSlide.id);
      setTitle(editingSlide.title);
      setSubtitle(editingSlide.subtitle);
      setDescription(editingSlide.description);
      setImageUrl(editingSlide.imageUrl);
      setCategory(editingSlide.category || '');
      setBadge(editingSlide.badge || '');
      setActionUrl(editingSlide.actionUrl || '');
      setActionText(editingSlide.actionText || '');
      setActiveTab('edit');
    } else {
      resetForm();
    }
  }, [editingSlide, isOpen]);

  const resetForm = () => {
    setCurrentSlideId(null);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80');
    setCategory('Campus Life');
    setBadge('OFFICIAL HIGHLIGHT');
    setActionUrl('');
    setActionText('');
    setUploadError(null);
  };

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const dataUrl = await processImageFile(file, 1600, 1000, 0.85);
      setImageUrl(dataUrl);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process slide image.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveCurrentSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setUploadError('Title and Image are required for a slide.');
      return;
    }

    const newSlide: SlideItem = {
      id: currentSlideId || `slide-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      category: category.trim() || 'Campus',
      badge: badge.trim(),
      actionUrl: actionUrl.trim(),
      actionText: actionText.trim(),
    };

    let updatedList: SlideItem[];
    if (currentSlideId) {
      updatedList = slides.map((s) => (s.id === currentSlideId ? newSlide : s));
      setSuccessToast(`Slide "${title}" updated!`);
    } else {
      updatedList = [newSlide, ...slides];
      setSuccessToast(`New slide "${title}" added!`);
    }

    onSaveSlides(updatedList);
    setTimeout(() => {
      setSuccessToast(null);
      resetForm();
      setActiveTab('list');
    }, 1200);
  };

  const handleDelete = (id: string) => {
    if (slides.length <= 1) {
      setUploadError('At least one slide must remain in the showcase.');
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    onSaveSlides(updated);
    if (currentSlideId === id) resetForm();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const copy = [...slides];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    onSaveSlides(copy);
  };

  const handleResetDefaults = () => {
    onSaveSlides(INITIAL_SLIDES);
    setSuccessToast('Restored original Patna Law College slides!');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleEditClick = (s: SlideItem) => {
    setCurrentSlideId(s.id);
    setTitle(s.title);
    setSubtitle(s.subtitle);
    setDescription(s.description);
    setImageUrl(s.imageUrl);
    setCategory(s.category || '');
    setBadge(s.badge || '');
    setActionUrl(s.actionUrl || '');
    setActionText(s.actionText || '');
    setActiveTab('edit');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1e2640] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Campus Slideshow Manager</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Admin
              </span>
            </h3>
            <p className="text-xs text-slate-400">Add, edit, reorder or upload images for the main homepage carousel.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-[#080a12] border border-[#1e2640] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'edit'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {currentSlideId ? '✏️ Edit Slide' : '➕ Add New Slide'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'list'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Manage All Slides ({slides.length})
          </button>
        </div>

        {/* Toast */}
        {successToast && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* TAB 1: Edit / Create Form */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSaveCurrentSlide} className="space-y-4">
            {/* Image Preview & Upload */}
            <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-4">
              <label className="text-xs font-semibold text-slate-200 block mb-2">Slide Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-[#101424] border border-[#1e2640] shrink-0">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Image from Device</span>
                  </button>

                  <div className="relative">
                    <input
                      type="text"
                      value={imageUrl.startsWith('data:') ? '(Uploaded Image file)' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or paste external image URL (https://...)"
                      className="w-full bg-[#101424] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Slide Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Moot Court Finals 2026"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Patna Law College Moot Court Society"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Description / Caption
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of this moment or event..."
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none resize-none"
              />
            </div>

            {/* Badge & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. CENTENNIAL HERITAGE or MOOT ADVOCACY"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Academic, Sports, Events"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            {/* Optional CTA Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Action Button Link (Optional)
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="#notices or https://..."
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="e.g. Read Circular"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-md shadow-amber-900/20"
              >
                {currentSlideId ? 'Save Changes' : 'Add Slide to Carousel'}
              </button>
              {currentSlideId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 bg-[#1e2640] hover:bg-[#283556] text-slate-300 rounded-lg text-xs font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}

        {/* TAB 2: Manage / Reorder / Delete List */}
        {activeTab === 'list' && (
          <div className="space-y-3">
            <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3 flex items-center gap-3 justify-between group hover:border-slate-600"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-slate-500 font-bold w-5">{idx + 1}.</span>
                    <img src={s.imageUrl} alt={s.title} className="w-14 h-11 object-cover rounded-lg shrink-0 border border-[#1e2640]" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{s.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{s.subtitle || s.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                      className="p-1.5 rounded-lg bg-[#1e2640] hover:bg-[#283556] text-slate-300 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === slides.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                      className="p-1.5 rounded-lg bg-[#1e2640] hover:bg-[#283556] text-slate-300 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditClick(s)}
                      className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 transition"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e2640]">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab('edit');
                }}
                className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition hover:bg-amber-400"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Another Slide</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1.5 bg-[#1e2640] hover:bg-[#283556] text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Slides</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
