import React, { useState } from 'react';
import { Crown, Code2, Scale, Trash2, Edit3, Plus, User, Instagram, Mail, Quote, CheckCircle, Camera } from 'lucide-react';
import { CrewMember, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface CrewSectionProps {
  crew: CrewMember[];
  session: AuthSession | null;
  onOpenAddModal: () => void;
  onOpenRemoveModal?: () => void;
  onOpenEditModal: (member: CrewMember) => void;
  onDeleteMember: (id: string) => void;
}

export const CrewSection: React.FC<CrewSectionProps> = ({
  crew,
  session,
  onOpenAddModal,
  onOpenRemoveModal,
  onOpenEditModal,
  onDeleteMember,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'leadership' | 'moot' | 'core' | 'backbenchers'>('all');
  const [activeModalMember, setActiveModalMember] = useState<CrewMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<CrewMember | null>(null);

  const categories = [
    { id: 'all', label: 'All Crew' },
    { id: 'leadership', label: 'Founders & Leadership' },
    { id: 'moot', label: 'Moot Court Society' },
    { id: 'core', label: 'Core Cohort' },
    { id: 'backbenchers', label: 'Backbench Strategic Unit' },
  ];

  const filteredCrew = crew.filter((member) => {
    if (selectedCategory === 'all') return true;
    return member.category === selectedCategory;
  });

  return (
    <section id="crew" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Patna Law College BBA.LLB Registry
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            The Munna Darinda Crew
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            The legal eagles, debate champions, front-row scholars, and legendary backbenchers defining the batch of Patna Law College.
          </p>
        </div>

        {session?.role === 'admin' && (
          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            {onOpenRemoveModal && (
              <button
                onClick={onOpenRemoveModal}
                className="inline-flex items-center gap-1.5 bg-red-950/50 hover:bg-red-900/70 text-red-300 border border-red-800/50 font-bold px-3.5 py-2 rounded-lg text-xs transition shadow-sm"
                title="Open remove crewmate modal"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Remove Crewmate</span>
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Crew Member</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#101424] border border-[#1e2640] rounded-xl overflow-x-auto mb-10 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#1e2640] text-amber-400 shadow-sm border border-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrew.map((member) => {
          const isFounder = member.isFounder;
          const isDev = member.isDeveloper;

          return (
            <div
              key={member.id}
              className={`bg-[#101424] rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 ${
                isFounder
                  ? 'border-amber-500/60 shadow-lg shadow-amber-950/20'
                  : isDev
                  ? 'border-blue-500/50 shadow-lg shadow-blue-950/20'
                  : 'border-[#1e2640] hover:border-slate-600'
              }`}
            >
              <div className="p-6">
                {/* Header with avatar & badges */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative shrink-0">
                    <img
                      src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#1e2640] group-hover:border-amber-400/50 transition-colors"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {isFounder && (
                      <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md" title="Founder">
                        <Crown className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isDev && (
                      <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white p-1 rounded-full shadow-md" title="Lead Developer">
                        <Code2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-100 truncate">{member.name}</h3>
                      {member.isSpecialBadge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                          {member.isSpecialBadge}
                        </span>
                      )}
                    </div>
                    {member.alias && (
                      <p className="text-xs font-medium text-amber-400/90 truncate">"{member.alias}"</p>
                    )}
                    <p className="text-xs text-slate-400 truncate mt-0.5">{member.role}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span>{member.batch}</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="mb-4 bg-[#080a12]/60 rounded-lg p-3 border border-[#1e2640]/80 text-xs text-slate-300 italic relative">
                  <Quote className="w-3 h-3 text-slate-600 inline mr-1 mb-1" />
                  {member.quote}
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Bottom Card Bar: View full details + Socials + Admin Actions */}
              <div className="px-6 py-3 bg-[#0c0f1c] border-t border-[#1e2640] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveModalMember(member)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-medium transition"
                  >
                    View Dossier →
                  </button>
                  <button
                    onClick={() => onOpenEditModal(member)}
                    className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#1e2640] transition"
                    title="Upload or change profile photo from device files"
                  >
                    <Camera className="w-3 h-3 text-amber-400" />
                    <span>Photo</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {member.instagram && (
                    <a
                      href={`https://instagram.com/${member.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-pink-400 transition"
                      title={`@${member.instagram}`}
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {member.contact && (
                    <a
                      href={`mailto:${member.contact}`}
                      className="text-slate-500 hover:text-amber-400 transition"
                      title={member.contact}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Crew Actions: Strictly Admin Only */}
                  {session?.role === 'admin' && (
                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-700">
                      <button
                        onClick={() => onOpenEditModal(member)}
                        className="text-slate-400 hover:text-amber-400 p-1.5 rounded hover:bg-[#1e2640] transition"
                        title="Admin: Edit Crew Member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingMember(member)}
                        className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-1 rounded text-xs transition"
                        title="Admin: Remove Crewmate"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                        <span className="text-[11px] font-medium">Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reusable Delete Confirm Modal for Crewmate */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => {
          if (deletingMember) {
            onDeleteMember(deletingMember.id);
            setDeletingMember(null);
          }
        }}
        title="Remove Crewmate"
        message="Are you sure you want to permanently remove this student from the Patna Law College roster?"
        itemTitle={deletingMember ? `${deletingMember.name} (${deletingMember.role})` : undefined}
        confirmButtonText="Delete Member"
      />

      {/* Member Details Modal */}
      {activeModalMember && (
        <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101424] border border-[#1e2640] rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModalMember(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]"
            >
              ✕
            </button>

            <div className="flex items-start gap-4 mb-4">
              <img
                src={activeModalMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                alt={activeModalMember.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border border-amber-500/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{activeModalMember.name}</h3>
                  {activeModalMember.isSpecialBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {activeModalMember.isSpecialBadge}
                    </span>
                  )}
                </div>
                {activeModalMember.alias && (
                  <p className="text-sm font-semibold text-amber-400">"{activeModalMember.alias}"</p>
                )}
                <p className="text-xs text-slate-400 mt-1">{activeModalMember.role}</p>
                <p className="text-xs text-slate-500">{activeModalMember.batch}</p>
              </div>
            </div>

            <div className="bg-[#080a12] border border-[#1e2640] rounded-lg p-3.5 mb-4 text-sm italic text-amber-200/90">
              "{activeModalMember.quote}"
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">Official Profile & Role</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{activeModalMember.bio}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e2640] text-xs">
              <div className="text-slate-400">
                Official Munna Darinda Registry
              </div>
              <div className="flex items-center gap-2.5">
                {session?.role === 'admin' ? (
                  <button
                    onClick={() => {
                      const target = activeModalMember;
                      setActiveModalMember(null);
                      onOpenEditModal(target);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Photo</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const target = activeModalMember;
                      setActiveModalMember(null);
                      onOpenEditModal(target);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1e2640] hover:bg-[#283556] text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
                    title="Upload or change profile photo from device files"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Photo</span>
                  </button>
                )}
                {activeModalMember.contact && (
                  <a
                    href={`mailto:${activeModalMember.contact}`}
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Member</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
