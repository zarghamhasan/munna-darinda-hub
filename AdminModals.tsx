import React, { useState, useEffect, useRef } from 'react';
import { CrewMember, Notice, OfficialLink, DualLogos } from '../types';
import { User, Bell, Link2, Image as ImageIcon, X, Upload, Camera, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { processImageFile } from '../utils/imageUtils';

interface CrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: CrewMember) => void;
  initialData?: CrewMember | null;
}

export const CrewModal: React.FC<CrewModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [alias, setAlias] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState<CrewMember['category']>('core');
  const [bio, setBio] = useState('');
  const [quote, setQuote] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [batch, setBatch] = useState('BBA.LLB 2024-29');
  const [contact, setContact] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSpecialBadge, setIsSpecialBadge] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotoError(null);
    if (initialData) {
      setName(initialData.name);
      setAlias(initialData.alias || '');
      setRole(initialData.role);
      setCategory(initialData.category);
      setBio(initialData.bio);
      setQuote(initialData.quote);
      setAvatarUrl(initialData.avatarUrl || '');
      setBatch(initialData.batch || 'BBA.LLB 2026-31');
      setContact(initialData.contact || '');
      setInstagram(initialData.instagram || '');
      setIsSpecialBadge(initialData.isSpecialBadge || '');
    } else {
      setName('');
      setAlias('');
      setRole('');
      setCategory('core');
      setBio('');
      setQuote('');
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
      setBatch('BBA.LLB 2026-31');
      setContact('');
      setInstagram('');
      setIsSpecialBadge('');
    }
  }, [initialData, isOpen]);

  const handlePhotoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setPhotoError(null);
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setAvatarUrl(dataUrl);
    } catch (err: any) {
      setPhotoError(err.message || 'Failed to process image file.');
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    onSave({
      id: initialData?.id || `crew-${Date.now()}`,
      name: name.trim(),
      alias: alias.trim() || undefined,
      role: role.trim(),
      category,
      bio: bio.trim(),
      quote: quote.trim() || '"Munna Darinda brotherhood."',
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      batch: batch.trim(),
      contact: contact.trim() || undefined,
      instagram: instagram.trim() || undefined,
      isSpecialBadge: isSpecialBadge.trim() || undefined,
      isFounder: initialData?.isFounder,
      isDeveloper: initialData?.isDeveloper,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-[#1e2640] rounded-xl p-6 max-w-lg w-full shadow-2xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          <span>{initialData ? 'Edit Crew Member' : 'Add New Crew Member'}</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Enroll a classmate into the Munna Darinda official registry.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Harshvardhan"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Alias / Moniker</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="e.g. The Judge"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role / Position</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Chief Moot Strategist"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-2.5 py-2 text-xs outline-none focus:border-amber-500"
              >
                <option value="leadership">Leadership & Founders</option>
                <option value="moot">Moot Court Society</option>
                <option value="core">Core Cohort</option>
                <option value="backbenchers">Backbench Strategic Unit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Special Badge (Optional)</label>
            <input
              type="text"
              value={isSpecialBadge}
              onChange={(e) => setIsSpecialBadge(e.target.value)}
              placeholder="e.g. MOOT CHAMPION, SENIOR COUNSEL"
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Famous Quote / Catchphrase</label>
            <input
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder='"Attendance low, swag high."'
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Profile Description</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Key contributions to the cohort, legal skills, or cafeteria antics..."
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg p-2.5 text-xs outline-none focus:border-amber-500"
            />
          </div>

          {/* Profile Photo Upload / URL Section */}
          <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Profile Photo</span>
              </label>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="text-[11px] text-slate-400 hover:text-red-400 transition"
                >
                  Clear Photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-3.5">
              {/* Image Preview */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#101424] border border-[#1e2640] shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                ) : (
                  <User className="w-7 h-7 text-slate-600" />
                )}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Action */}
              <div className="flex-1 space-y-1">
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{avatarUrl.startsWith('data:') ? 'Change Uploaded Photo' : 'Upload Photo from Files'}</span>
                </button>
                <p className="text-[10px] text-slate-400">Upload any photo from your phone or PC (JPG, PNG, WEBP).</p>
              </div>
            </div>

            {/* External URL Fallback */}
            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Or paste web photo URL:</span>
              <input
                type="text"
                value={avatarUrl.startsWith('data:') ? '(Uploaded photo from device)' : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#101424] text-slate-200 border border-[#1e2640] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-500 truncate"
              />
            </div>

            {photoError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{photoError}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="username"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email</label>
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="name@email.com"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-md"
            >
              {initialData ? 'Save Changes' : 'Enroll Into Roster'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (notice: Notice) => void;
  currentUsername?: string;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, onSave, currentUsername }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('urgent');
  const [author, setAuthor] = useState(currentUsername || 'Admin Team');
  const [isPinned, setIsPinned] = useState(false);
  const [actionUrl, setActionUrl] = useState('');
  const [actionText, setActionText] = useState('');

  useEffect(() => {
    if (currentUsername) {
      setAuthor(currentUsername);
    }
  }, [currentUsername, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      id: `notice-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: author.trim() || currentUsername || 'Admin Team',
      authorId: currentUsername,
      isPinned,
      actionUrl: actionUrl.trim() || undefined,
      actionText: actionText.trim() || undefined,
    });

    setTitle('');
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101424] border border-[#1e2640] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-500" />
          <span>Post New Circular or Notice</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Official circular visible to all Patna Law College batchmates.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Constitutional Law Test Rescheduled"
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-2.5 py-2 text-xs outline-none focus:border-red-500"
              >
                <option value="urgent">Urgent</option>
                <option value="academic">Academic</option>
                <option value="moot">Moot Court</option>
                <option value="event">Campus Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Issued By</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Harshvardhan (Admin)"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notice Content</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full details of the announcement..."
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg p-2.5 text-xs outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Action URL (Optional)</label>
              <input
                type="text"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Action Button Text</label>
              <input
                type="text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="View Details"
                className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pinNoticeCheck"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <label htmlFor="pinNoticeCheck" className="text-xs text-slate-300 cursor-pointer">
              Pin to top of bulletin board
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md"
            >
              Publish Notice to Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: OfficialLink) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<OfficialLink['category']>('forms');
  const [isPrimary, setIsPrimary] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onSave({
      id: `link-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category,
      isPrimary,
    });

    setTitle('');
    setDescription('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#101424] border border-[#1e2640] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-blue-400" />
          <span>Add Official Link</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Add a new WhatsApp, Google Form, or College Gateway.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Semester 2 Registration Form"
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-2.5 py-2 text-xs outline-none"
            >
              <option value="whatsapp">WhatsApp Group</option>
              <option value="forms">Google Forms</option>
              <option value="university">University / College Portal</option>
              <option value="resource">External Legal Resource</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL Target</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of what this link is for..."
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg p-2.5 text-xs outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="primaryLinkCheck"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <label htmlFor="primaryLinkCheck" className="text-xs text-slate-300 cursor-pointer">
              Mark as Verified / Featured Link
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md"
            >
              Add Link to Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  logos?: DualLogos;
  onSaveLogos?: (logos: DualLogos) => void;
  currentLogoUrl?: string;
  onSave?: (url: string) => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({
  isOpen,
  onClose,
  logos,
  onSaveLogos,
  currentLogoUrl,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'plc' | 'team'>('plc');
  const [plcUrl, setPlcUrl] = useState(logos?.plcLogoUrl || '');
  const [teamUrl, setTeamUrl] = useState(logos?.teamLogoUrl || currentLogoUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logos) {
      setPlcUrl(logos.plcLogoUrl || '');
      setTeamUrl(logos.teamLogoUrl || currentLogoUrl || '');
    } else if (currentLogoUrl) {
      setTeamUrl(currentLogoUrl);
    }
    setUploadError(null);
  }, [logos, currentLogoUrl, isOpen]);

  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const dataUrl = await processImageFile(file, 600, 600, 0.9);
      if (activeTab === 'plc') {
        setPlcUrl(dataUrl);
      } else {
        setTeamUrl(dataUrl);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process image file.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (!isOpen) return null;

  const currentDisplayUrl = activeTab === 'plc' ? plcUrl : teamUrl;

  const handleSaveBoth = () => {
    const updated: DualLogos = {
      plcLogoUrl: plcUrl,
      teamLogoUrl: teamUrl,
    };
    if (onSaveLogos) onSaveLogos(updated);
    if (onSave) onSave(teamUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101424] border border-amber-500/30 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative text-left">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-[#1e2640] transition">
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span>Dual Logo Configuration</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">Configure two distinct official crests: Patna Law College & Munna Darinda Team.</p>

        {/* Tab switch between the two logos */}
        <div className="flex gap-2 p-1 bg-[#080a12] border border-[#1e2640] rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('plc');
              setUploadError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'plc'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏛️ Logo 1: Patna Law College</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('team');
              setUploadError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚡ Logo 2: Munna Darinda</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Logo File Upload & Preview */}
          <div className="bg-[#080a12] border border-[#1e2640] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeTab === 'plc' ? 'Patna Law College Official Emblem' : 'Munna Darinda Batch Crest'}</span>
              </label>
              <span className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                {activeTab === 'plc' ? 'SLOT 1' : 'SLOT 2'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#101424] border-2 border-amber-500/30 shrink-0 flex items-center justify-center shadow-md">
                {currentDisplayUrl ? (
                  <img
                    src={currentDisplayUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">⚖️</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg text-xs font-semibold transition"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Logo from Files</span>
                </button>
                <p className="text-[10px] text-slate-400">Choose PNG, JPG, SVG or WEBP from device.</p>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Or paste Direct Image URL</label>
            <input
              type="text"
              value={currentDisplayUrl.startsWith('data:') ? '(Uploaded image from device)' : currentDisplayUrl}
              onChange={(e) => {
                if (activeTab === 'plc') setPlcUrl(e.target.value);
                else setTeamUrl(e.target.value);
              }}
              placeholder="https://..."
              className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none truncate"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveBoth}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-md shadow-amber-900/20"
            >
              Save Both Logos
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'plc') setPlcUrl('');
                else setTeamUrl('');
              }}
              className="px-3 bg-[#1e2640] hover:bg-[#283556] text-slate-300 rounded-lg text-xs"
            >
              Clear Current
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
