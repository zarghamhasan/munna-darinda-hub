import React, { useState } from 'react';
import { CrewMember } from '../types';
import { Trash2, AlertTriangle, X, Shield, Search } from 'lucide-react';

interface RemoveCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  crew: CrewMember[];
  onDeleteMember: (id: string) => void;
}

export const RemoveCrewModal: React.FC<RemoveCrewModalProps> = ({
  isOpen,
  onClose,
  crew,
  onDeleteMember,
}) => {
  const [search, setSearch] = useState('');
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const filtered = crew.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.alias && m.alias.toLowerCase().includes(search.toLowerCase())) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRemove = (member: CrewMember) => {
    onDeleteMember(member.id);
    setRemovedIds((prev) => [...prev, member.id]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101424] border border-[#1e2640] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e2640] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Remove Crewmate</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                Admin Power
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any crewmate to remove them from the Patna Law College roster.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, alias, or role..."
            className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 rounded-xl pl-9 pr-4 py-2 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Member List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No matching crewmates found in the registry.
            </div>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080a12] border border-[#1e2640] hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.name}
                    className="w-9 h-9 rounded-lg object-cover border border-[#1e2640] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-200 truncate">{member.name}</span>
                      {member.alias && (
                        <span className="text-[11px] text-amber-400/90 font-medium">"{member.alias}"</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{member.role} · {member.batch}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(member)}
                  className="inline-flex items-center gap-1.5 bg-red-950/50 hover:bg-red-900/80 text-red-300 border border-red-700/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ml-2"
                  title="Remove this crewmate"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Remove</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 pt-3 border-t border-[#1e2640] flex items-center justify-between text-xs text-slate-400">
          <span>Total active in roster: <strong className="text-slate-200">{crew.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1e2640] hover:bg-[#283556] text-slate-200 transition font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
