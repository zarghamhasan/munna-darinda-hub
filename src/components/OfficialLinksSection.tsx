import React, { useState } from 'react';
import { ExternalLink, MessageCircle, FileSpreadsheet, Globe, Copy, Check, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { OfficialLink, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface OfficialLinksSectionProps {
  links: OfficialLink[];
  session: AuthSession | null;
  onOpenAddModal: () => void;
  onDeleteLink: (id: string) => void;
}

export const OfficialLinksSection: React.FC<OfficialLinksSectionProps> = ({
  links,
  session,
  onOpenAddModal,
  onDeleteLink,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingLink, setDeletingLink] = useState<OfficialLink | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getIcon = (category: OfficialLink['category']) => {
    switch (category) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-400" />;
      case 'forms':
        return <FileSpreadsheet className="w-5 h-5 text-amber-400" />;
      case 'university':
        return <Globe className="w-5 h-5 text-blue-400" />;
      default:
        return <ExternalLink className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <section id="links-section" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Direct Access Gateways
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            Official Links & Google Forms
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Official batch WhatsApp community, BBA.LLB student registration Google Forms, syllabus downloads, and University exam portals.
          </p>
        </div>

        {session?.role === 'admin' && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#1e2640] hover:bg-[#283556] text-amber-400 font-semibold px-4 py-2 rounded-lg text-xs transition border border-amber-500/30 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Link</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {links.map((item) => (
          <div
            key={item.id}
            className={`bg-[#101424] border rounded-xl p-5 sm:p-6 transition-all flex flex-col justify-between group ${
              item.isPrimary
                ? 'border-amber-500/40 bg-gradient-to-br from-[#101424] via-[#121930] to-[#101424]'
                : 'border-[#1e2640] hover:border-slate-600'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#080a12] border border-[#1e2640] flex items-center justify-center shrink-0">
                    {getIcon(item.category)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                      {item.category} Gateway
                    </span>
                  </div>
                </div>

                {item.isPrimary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    VERIFIED
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1e2640] text-xs">
              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {(session?.role === 'admin' || session?.role === 'classmate') && (
                  <button
                    onClick={() => setDeletingLink(item)}
                    className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-1.5 rounded-lg text-xs transition"
                    title={session?.role === 'admin' ? "Admin: Remove Link" : "Remove Link"}
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                    <span className="text-[11px] font-medium">Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal for Links */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingLink)}
        onClose={() => setDeletingLink(null)}
        onConfirm={() => {
          if (deletingLink) {
            onDeleteLink(deletingLink.id);
            setDeletingLink(null);
          }
        }}
        title="Remove Official Link"
        message="Are you sure you want to remove this gateway from the directory?"
        itemTitle={deletingLink ? `"${deletingLink.title}"` : undefined}
        confirmButtonText="Delete Link"
      />
    </section>
  );
};
