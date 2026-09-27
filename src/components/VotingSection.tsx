import React, { useState, useEffect } from 'react';
import {
  Vote,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  Flame,
  FileText,
  Clock,
  Coffee,
  X,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Users,
} from 'lucide-react';
import { VotingPoll, PollOption, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface VotingSectionProps {
  polls: VotingPoll[];
  session: AuthSession | null;
  onVote: (pollId: string, optionId: string) => void;
  onCreatePoll: (poll: Omit<VotingPoll, 'id' | 'createdAt' | 'totalVotes'>) => void;
  onDeletePoll: (pollId: string) => void;
}

const STORAGE_VOTES_KEY = 'munna_darinda_user_votes_v1';

export const VotingSection: React.FC<VotingSectionProps> = ({
  polls,
  session,
  onVote,
  onCreatePoll,
  onDeletePoll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bunk' | 'assignment' | 'event' | 'other'>('all');
  const [filterVotedOnly, setFilterVotedOnly] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingPoll, setDeletingPoll] = useState<VotingPoll | null>(null);

  // Local user votes record: { [pollId]: optionId }
  const [userVotes, setUserVotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VOTES_KEY, JSON.stringify(userVotes));
    } catch {}
  }, [userVotes]);

  // Form state for creating a new poll
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'bunk' | 'assignment' | 'event' | 'other'>('bunk');
  const [newOptions, setNewOptions] = useState<string[]>(['Yes, absolutely!', 'No, not this time.']);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleCastVote = (pollId: string, optionId: string) => {
    // If not authenticated or visitor, encourage participation
    const previousOptionId = userVotes[pollId];
    if (previousOptionId === optionId) {
      // already voted for this option
      return;
    }

    setUserVotes((prev) => ({
      ...prev,
      [pollId]: optionId,
    }));

    onVote(pollId, optionId);
  };

  const handleAddOptionField = () => {
    if (newOptions.length < 5) {
      setNewOptions([...newOptions, '']);
    }
  };

  const handleRemoveOptionField = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...newOptions];
    updated[index] = val;
    setNewOptions(updated);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newTitle.trim()) {
      setCreateError('Poll title is required.');
      return;
    }

    const validOptions = newOptions.map((o) => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      setCreateError('Please provide at least 2 distinct voting options.');
      return;
    }

    const formattedOptions: PollOption[] = validOptions.map((text, idx) => ({
      id: `opt-${Date.now()}-${idx}`,
      text,
      votes: 0,
    }));

    onCreatePoll({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      category: newCategory,
      options: formattedOptions,
      createdBy: session?.username || 'Batch Classmate',
      authorId: session?.username || 'classmate',
      tags: [
        newCategory === 'bunk' ? 'Mass Bunk' : newCategory === 'assignment' ? 'Assignment' : 'Campus',
        'PLC BBA.LLB',
      ],
    });

    // Reset & close
    setNewTitle('');
    setNewDesc('');
    setNewCategory('bunk');
    setNewOptions(['Yes, absolutely!', 'No, not this time.']);
    setCreateModalOpen(false);
  };

  // Filter polls
  const filteredPolls = polls.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (filterVotedOnly && !userVotes[p.id]) {
      return false;
    }
    return true;
  });

  const getCategoryBadge = (cat: VotingPoll['category']) => {
    switch (cat) {
      case 'bunk':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
            <Flame className="w-3 h-3 text-red-400" />
            <span>Mass Bunk</span>
          </span>
        );
      case 'assignment':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <FileText className="w-3 h-3 text-blue-400" />
            <span>Assignment & Petition</span>
          </span>
        );
      case 'event':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Coffee className="w-3 h-3 text-emerald-400" />
            <span>Campus Hangout</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Vote className="w-3 h-3 text-purple-400" />
            <span>Referendum</span>
          </span>
        );
    }
  };

  return (
    <section id="voting" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-amber-400" />
            <span>Democracy & Batch Referendums</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            The Batch Voting Arena
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Direct democracy for the Patna Law College BBA.LLB cohort. Cast your vote on mass bunks, assignment extension petitions, batch outings, and cafeteria disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-amber-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ballot</span>
          </button>
        </div>
      </div>

      {/* Filter Category & Status Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#101424] border border-[#1e2640] rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Ballots' },
            { id: 'bunk', label: '🏃‍♂️ Mass Bunk' },
            { id: 'assignment', label: '📜 Assignments' },
            { id: 'event', label: '☕ Campus & Outings' },
            { id: 'other', label: '🏛️ General' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#1e2640] text-amber-400 border border-amber-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter by Voted */}
        <button
          onClick={() => setFilterVotedOnly(!filterVotedOnly)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
            filterVotedOnly
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-[#101424] text-slate-400 hover:text-white border-[#1e2640]'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>My Voted Ballots ({Object.keys(userVotes).length})</span>
        </button>
      </div>

      {/* Polls Grid */}
      {filteredPolls.length === 0 ? (
        <div className="p-12 text-center bg-[#101424]/60 border border-[#1e2640] rounded-2xl">
          <Vote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-200">No active polls found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            {filterVotedOnly
              ? "You haven't cast a vote on any polls in this category yet."
              : 'Be the first to launch a batch referendum for a mass bunk or assignment petition.'}
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch a Ballot</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => {
            const userVotedOptionId = userVotes[poll.id];
            const hasUserVoted = Boolean(userVotedOptionId);
            const totalVotes = Math.max(
              poll.totalVotes,
              poll.options.reduce((sum, opt) => sum + opt.votes, 0)
            );

            const canDelete =
              session?.role === 'admin' ||
              (session?.username && poll.createdBy.toLowerCase().includes(session.username.toLowerCase()));

            return (
              <div
                key={poll.id}
                className="bg-[#101424] border border-[#1e2640] hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all shadow-xl flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Bar: Category badge & delete button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {getCategoryBadge(poll.category)}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'} cast</span>
                      </span>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => setDeletingPoll(poll)}
                        className="opacity-80 group-hover:opacity-100 text-slate-400 hover:text-red-400 bg-[#080a12] p-1.5 rounded-lg border border-[#1e2640] transition"
                        title="Remove Poll"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">
                    {poll.title}
                  </h3>
                  {poll.description && (
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {poll.description}
                    </p>
                  )}

                  {/* Options List */}
                  <div className="mt-5 space-y-2.5">
                    {poll.options.map((option) => {
                      const isVoted = userVotedOptionId === option.id;
                      const percentage =
                        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleCastVote(poll.id, option.id)}
                          className={`w-full text-left relative overflow-hidden rounded-xl border p-3 transition-all ${
                            isVoted
                              ? 'border-amber-500/80 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                              : 'border-[#1e2640] hover:border-slate-600 bg-[#080a12]'
                          }`}
                        >
                          {/* Animated progress bar fill */}
                          <div
                            className={`absolute top-0 bottom-0 left-0 transition-all duration-500 rounded-xl ${
                              isVoted
                                ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/30'
                                : 'bg-slate-700/20'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />

                          {/* Content */}
                          <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                  isVoted
                                    ? 'border-amber-400 bg-amber-500 text-slate-950 font-bold'
                                    : 'border-slate-600 bg-transparent'
                                }`}
                              >
                                {isVoted && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                              </span>
                              <span
                                className={`font-medium truncate ${
                                  isVoted ? 'text-amber-200 font-semibold' : 'text-slate-200'
                                }`}
                              >
                                {option.text}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isVoted && (
                                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-1.5 py-0.5 rounded">
                                  Your Vote
                                </span>
                              )}
                              <span className="font-mono text-slate-300 font-semibold">
                                {percentage}%
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({option.votes})
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="mt-5 pt-3.5 border-t border-[#1e2640] flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Initiated by <strong className="text-slate-200 font-medium">{poll.createdBy}</strong>
                  </span>
                  <span>
                    {hasUserVoted ? (
                      <span className="text-emerald-400 font-medium">✓ Ballot Recorded</span>
                    ) : (
                      <span className="text-amber-400/80">Click option to vote</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Poll Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101424] border border-[#1e2640] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e2640]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Vote className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Launch a Batch Ballot</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              Call a cohort referendum for a mass bunk, assignment extension, or batch event.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ballot Question / Topic *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mass Bunk Tuesday 2 PM Constitutional Law lecture?"
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs outline-none"
                >
                  <option value="bunk">🏃‍♂️ Mass Bunk Call</option>
                  <option value="assignment">📜 Assignment & Extension Petition</option>
                  <option value="event">☕ Campus Hangout & Trip</option>
                  <option value="other">🏛️ General Batch Referendum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Context / Brief Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide background info, professors involved, or meeting points..."
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-xl p-3 text-xs outline-none"
                />
              </div>

              {/* Dynamic Options List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Voting Options (Minimum 2, Maximum 5)
                  </label>
                  {newOptions.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono w-4">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1} text`}
                        className="flex-1 bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-amber-500 rounded-lg px-3 py-2 text-xs outline-none"
                      />
                      {newOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Remove option"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {createError && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/40 p-2.5 rounded-lg">
                  {createError}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition shadow-md"
                >
                  Publish Ballot to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingPoll)}
        onClose={() => setDeletingPoll(null)}
        onConfirm={() => {
          if (deletingPoll) {
            onDeletePoll(deletingPoll.id);
            setDeletingPoll(null);
          }
        }}
        title="Remove Ballot"
        message="Are you sure you want to permanently remove this referendum from the Batch Voting Arena?"
        itemTitle={deletingPoll?.title}
        confirmButtonText="Delete Ballot"
      />
    </section>
  );
};
