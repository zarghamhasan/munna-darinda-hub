import React, { useState } from 'react';
import { BookOpen, FileText, Download, Search, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { StudyResource, AuthSession } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface StudyVaultSectionProps {
  resources: StudyResource[];
  session: AuthSession | null;
  onAddResource: (resource: StudyResource) => void;
  onDeleteResource: (id: string) => void;
}

export const StudyVaultSection: React.FC<StudyVaultSectionProps> = ({
  resources,
  session,
  onAddResource,
  onDeleteResource,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingResource, setDeletingResource] = useState<StudyResource | null>(null);

  // New resource form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('Semester I');
  const [type, setType] = useState<StudyResource['type']>('Notes');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [pages, setPages] = useState('');

  const types = ['All', 'Notes', 'PYQ', 'Bare Act / Summary', 'Landmark Cases'];

  const filteredResources = resources.filter((item) => {
    if (selectedType !== 'All' && item.type !== selectedType) return false;
    if (!searchTerm) return true;
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    onAddResource({
      id: `res-${Date.now()}`,
      title: title.trim(),
      subject: subject.trim(),
      semester,
      type,
      author: author.trim() || 'Patna Law Vault',
      url: url.trim() || '#',
      pages: pages.trim() || 'PDF Resource',
    });

    setTitle('');
    setSubject('');
    setUrl('');
    setPages('');
    setModalOpen(false);
  };

  return (
    <section id="vault" className="py-16 px-4 sm:px-6 max-w-[1200px] mx-auto border-t border-[#1e2640]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">
            Curated Academic Arsenal
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mt-1">
            BBA.LLB Study Vault & PYQs
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Verified study notes, past year questions, bare act cheatsheets, and landmark case briefs tailored for Patna University semester evaluations.
          </p>
        </div>

        {session?.role === 'admin' && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#1e2640] hover:bg-[#283556] text-amber-400 font-semibold px-4 py-2 rounded-lg text-xs transition border border-amber-500/30 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Resource Link</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Constitutional Law, Torts, PYQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#101424] text-slate-200 border border-[#1e2640] rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedType === t
                  ? 'bg-[#1e2640] text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-[#101424]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of study resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-[#101424] border border-[#1e2640] hover:border-slate-600 rounded-xl p-5 flex flex-col justify-between transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                <span className="font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                  {res.subject}
                </span>
                <span className="text-slate-500 text-[11px]">{res.semester}</span>
              </div>

              <h3 className="text-base font-bold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors">
                {res.title}
              </h3>

              <div className="text-xs text-slate-400 space-y-1 mb-4">
                <p>Curated by: <span className="text-slate-300">{res.author}</span></p>
                {res.pages && <p className="text-slate-500">{res.pages}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#1e2640] text-xs">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#1e2640] text-slate-300">
                {res.type}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={res.url}
                  onClick={(e) => {
                    if (res.url === '#') {
                      e.preventDefault();
                      alert(`Accessing "${res.title}". Opening syllabus document.`);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Access Notes</span>
                </a>

                {(session?.role === 'admin' || session?.role === 'classmate') && (
                  <button
                    onClick={() => setDeletingResource(res)}
                    className="inline-flex items-center gap-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-1 rounded text-xs transition"
                    title={session?.role === 'admin' ? "Admin: Remove Resource" : "Remove Resource"}
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

      {/* Delete Confirmation Modal for Resources */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingResource)}
        onClose={() => setDeletingResource(null)}
        onConfirm={() => {
          if (deletingResource) {
            onDeleteResource(deletingResource.id);
            setDeletingResource(null);
          }
        }}
        title="Remove Study Resource"
        message="Are you sure you want to remove this academic resource from the Study Vault?"
        itemTitle={deletingResource ? `"${deletingResource.title}"` : undefined}
        confirmButtonText="Delete Resource"
      />

      {/* Upload Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#080a12]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101424] border border-[#1e2640] rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded bg-[#1e2640]"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Add Study Resource</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add Google Drive, PDF, or GitHub resource link for batchmates.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Constitutional Law Landmark Judgments"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Law of Torts"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-2.5 py-2 text-xs outline-none focus:border-amber-500"
                  >
                    <option value="Notes">Notes</option>
                    <option value="PYQ">PYQ</option>
                    <option value="Bare Act / Summary">Bare Act / Summary</option>
                    <option value="Landmark Cases">Landmark Cases</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Author / Contributor</label>
                  <input
                    type="text"
                    placeholder="e.g. Zargham Hasan"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pages / Format</label>
                  <input
                    type="text"
                    placeholder="e.g. 45 pages / PDF"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resource URL (Drive/PDF)</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#080a12] text-slate-100 border border-[#1e2640] rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition shadow-md"
                >
                  Publish Resource to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
