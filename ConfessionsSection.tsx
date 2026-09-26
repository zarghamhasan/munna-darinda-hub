import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Sparkles, Trash2, Filter } from 'lucide-react';
import { Confession, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ConfessionsSectionProps {
  confessions: Confession[];
  session: AuthSession | null;
  onAddConfession: (newConfession: Omit<Confession, 'id' | 'likes' | 'timestamp' | 'isApproved'>) => void;
  onLikeConfession: (id: string) => void;
  onDeleteConfession: (id: string) => void;
}

export const ConfessionsSection: React.FC<ConfessionsSectionProps> = ({
  confessions,
  session,
  onAddConfession,
  onLikeConfession,
  onDeleteConfession,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confessionText, setConfessionText] = useState('');
  const [alias, setAlias] = useState('');
  const [category, setCategory] = useState<Confession['category']>('funny');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'funny' | 'academic' | 'campus' | 'shoutout'>('all');
  const [deletingConfession, setDeletingConfession] = useState<Confession | null>(null);

  // Track locally created confessions so student authors can delete their own posts
  const [myCreatedConfessionIds, setMyCreatedConfessionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('my_created_confessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confessionText.trim()) return;

    const myIdentifier = session?.username || `student-${Date.now().toString(36)}`;
    const tempId = `conf-${Date.now()}`;

    // Record author ownership
    const updatedIds = [...myCreatedConfessionIds, tempId];
    setMyCreatedConfessionIds(updatedIds);
    try {
      localStorage.setItem('my_created_confessions', JSON.stringify(updatedIds));
    } catch {}

    onAddConfession({
      text: confessionText.trim(),
      authorAlias: alias.trim() || (session?.username ? session.username.split(' ')[0] : 'Anonymous Jurist'),
      authorId: myIdentifier,
      category,
    });

    setConfessionText('');
    setAlias('');
    setModalOpen(false);
  };

  const handleLike = (id: string) => {
    if (!likedMap[id]) {
      setLikedMap((prev) => ({ ...prev, [id]: true }));
      onLikeConfession(id);
    }
  };

  const canDelete = (item: Confession) => {
    // Admin can delete any confession
    if (session?.role === 'admin') return true;
    // Logged in student matches author
    if (session?.username && item.authorId === session.username) return true;
    if (session?.username && item.authorAlias && item.authorAlias.toLowerCase() === session.username.toLowerCase()) return true;
    // Student created this confession on their device/browser
    if (myCreatedConfessionIds.includes(item.id)) return true;
    // In classmate mode, students can moderate student-authored posts if necessary
    if (session?.role === 'classmate') return true;
    return false;
  };

  const filteredConfessions = confessions.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.category === activeFilter;
  });

  return (
    <section id="confessions" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Campus Pulse & Law Memes
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            Anonymous Batch Confessions
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Unfiltered stories, hilarious lecture moments, cafeteria crimes, and tribute shoutouts across Patna Law College corridors.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition shadow-lg shadow-red-950/30 self-start md:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Drop a Confession</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101424] border border-[#1e2640] rounded-xl overflow-x-auto mb-8">
        {(['all', 'funny', 'academic', 'campus', 'shoutout'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition ${
              activeFilter === cat
                ? 'bg-[#1e2640] text-amber-400 border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Pulse' : cat}
          </button>
        ))}
      </div>

      {/* Confession Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredConfessions.map((item) => {
          const isLiked = likedMap[item.id];
          return (
            <div
              key={item.id}
              className="bg-[#101424] border border-[#1e2640] hover:border-slate-600 rounded-xl p-5 flex flex-col justify-between transition-all group"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                  <span className="font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                    #{item.category}
                  </span>
                  <span>{item.timestamp}</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1e2640]/60 text-xs">
                <span className="text-slate-400 font-medium italic">
                  — {item.authorAlias || 'Anonymous'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition text-xs ${
                      isLiked
                        ? 'text-red-400 bg-red-950/40 font-bold'
                        : 'text-slate-400 hover:text-red-400 bg-[#080a12]'
                    }`}
                    title="Upvote confession"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{item.likes}</span>
                  </button>

                  {/* Remove power: Admin or Individual Author */}
                  {canDelete(item) && (
                    <button
                      onClick={() => setDeletingConfession(item)}
                      className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-1 rounded text-xs transition"
                      title={session?.role === 'admin' ? "Admin: Remove Confession" : "Delete your confession"}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span className="text-[11px] font-medium">Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingConfession)}
        onClose={() => setDeletingConfession(null)}
        onConfirm={() => {
          if (deletingConfession) {
            onDeleteConfession(deletingConfession.id);
            setDeletingConfession(null);
          }
        }}
        title="Remove Confession"
        message="Are you sure you want to permanently delete this confession from the batch wall?"
        itemTitle={deletingConfession ? `"${deletingConfession.text.slice(0, 65)}..."` : undefined}
        confirmButtonText="Delete Confession"
      />

      {/* Confession Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101424] border border-[#1e2640] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Submit Batch Confession</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              100% anonymous. Post your fun thought, attendance dilemma, or shoutout for the batch.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Confession / Meme</label>
                <textarea
                  rows={4}
                  required
                  value={confessionText}
                  onChange={(e) => setConfessionText(e.target.value)}
                  placeholder="Tell us what really happened in the Moot Hall or during Torts lecture..."
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg p-3 text-xs outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Anonymous Alias</label>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g. Backbench Legend"
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-2.5 py-2 text-xs outline-none"
                  >
                    <option value="funny">Funny</option>
                    <option value="academic">Academic</option>
                    <option value="campus">Campus Life</option>
                    <option value="shoutout">Shoutout</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md"
                >
                  Publish to Batch Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
