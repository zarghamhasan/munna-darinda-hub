import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemTitle?: string;
  confirmButtonText?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemTitle,
  confirmButtonText = 'Yes, Delete',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#080a12]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101424] border border-[#1e2640] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-left">
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
            <h3 className="text-base font-bold text-slate-100">{title}</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="mb-5 bg-[#080a12] border border-[#1e2640] rounded-xl p-3.5 text-xs">
          <p className="text-slate-300 leading-relaxed mb-2">{message}</p>
          {itemTitle && (
            <p className="font-semibold text-amber-300 truncate">
              "{itemTitle}"
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#1e2640] hover:bg-[#283556] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition shadow-md shadow-red-900/30 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
