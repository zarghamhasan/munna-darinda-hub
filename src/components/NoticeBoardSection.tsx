import React, { useState } from 'react';
import { Bell, Pin, Search, Plus, Calendar, User, ExternalLink, Trash2 } from 'lucide-react';
import { Notice, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface NoticeBoardSectionProps {
  notices: Notice[];
  session: AuthSession | null;
  onOpenAddModal: () => void;
  onTogglePin: (id: string) => void;
  onDeleteNotice: (id: string) => void;
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({
  notices,
  session,
  onOpenAddModal,
  onTogglePin,
  onDeleteNotice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'urgent' | 'academic' | 'moot' | 'event'>('all');
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);

  // Track locally posted notices
  const [myCreatedNoticeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('my_created_notices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const canDeleteNotice = (notice: Notice) => {
    // Admin can delete any notice
    if (session?.role === 'admin') return true;
    // Notice author matches logged in user
    if (session?.username && (notice.authorId === session.username || notice.author.toLowerCase().includes(session.username.toLowerCase()))) {
      return true;
    }
    // Posted in this browser session
    if (myCreatedNoticeIds.includes(notice.id)) return true;
    return false;
  };

  const filteredNotices = notices
    .filter((n) => {
      if (filterCategory !== 'all' && n.category !== filterCategory) return false;
      if (!searchTerm) return true;
      return (
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const getCategoryStyles = (category: Notice['category']) => {
    switch (category) {
      case 'urgent':
        return 'text-red-400 bg-red-950/40 border-red-900/60';
      case 'moot':
        return 'text-amber-400 bg-amber-950/40 border-amber-900/60';
      case 'academic':
        return 'text-blue-400 bg-blue-950/40 border-blue-900/60';
      case 'event':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-900/60';
    }
  };

  return (
    <section id="notices" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Official & Batch Gazettes
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            Notice & Bulletin Board
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Important circulars, assessment timetables, moot court briefs, and official announcements from Patna Law College and the Munna Darinda Command.
          </p>
        </div>

        {session?.role === 'admin' && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Notice</span>
          </button>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search circulars, exams, moot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#101424] text-slate-200 border border-[#1e2640] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['all', 'urgent', 'academic', 'moot', 'event'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-[#1e2640] text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-[#101424]'
              }`}
            >
              {cat === 'all' ? 'All Notices' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="text-center py-12 bg-[#101424] border border-[#1e2640] rounded-xl text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No notices found matching your criteria.</p>
          </div>
        ) : (
          filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-[#101424] border rounded-xl p-5 sm:p-6 transition-all relative ${
                notice.isPinned
                  ? 'border-amber-500/40 bg-gradient-to-r from-[#101424] to-[#151c34]'
                  : 'border-[#1e2640] hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {notice.isPinned && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>PINNED CIRCULAR</span>
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded border ${getCategoryStyles(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mb-2">{notice.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{notice.content}</p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-[#1e2640]/60">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Issued by: <strong className="text-slate-300">{notice.author}</strong></span>
                    </span>

                    {notice.actionUrl && (
                      <a
                        href={notice.actionUrl}
                        target={notice.actionUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        <span>{notice.actionText || 'Read Details'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Notice Controls & Removal */}
                {(session?.role === 'admin' || canDeleteNotice(notice)) && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {session?.role === 'admin' && (
                      <button
                        onClick={() => onTogglePin(notice.id)}
                        className={`p-1.5 rounded transition ${
                          notice.isPinned
                            ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                            : 'text-slate-500 hover:text-slate-300 bg-[#1e2640]'
                        }`}
                        title={notice.isPinned ? 'Unpin Notice' : 'Pin to Top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeletingNotice(notice)}
                      className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-1 rounded text-xs transition"
                      title={session?.role === 'admin' ? "Admin: Remove Notice" : "Remove your notice"}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span className="hidden sm:inline text-[11px] font-medium">Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal for Notices */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingNotice)}
        onClose={() => setDeletingNotice(null)}
        onConfirm={() => {
          if (deletingNotice) {
            onDeleteNotice(deletingNotice.id);
            setDeletingNotice(null);
          }
        }}
        title="Remove Notice"
        message="Are you sure you want to remove this circular from the bulletin board?"
        itemTitle={deletingNotice ? `"${deletingNotice.title}"` : undefined}
        confirmButtonText="Delete Notice"
      />
    </section>
  );
};
