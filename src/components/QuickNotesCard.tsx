import React, { useState } from 'react';
import { QuickNote } from '../types';
import { StorageService } from '../services/storage';
import { StickyNote, Plus, Pin, Trash2, Copy, Check, X } from 'lucide-react';

interface QuickNotesCardProps {
  notes: QuickNote[];
  onShowToast: (msg: string) => void;
}

export const QuickNotesCard: React.FC<QuickNotesCardProps> = ({
  notes,
  onShowToast,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    StorageService.saveQuickNote({
      title: newTitle.trim() || 'Class Remark',
      content: newContent.trim(),
      pinned: false,
    });

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
    onShowToast('Quick note saved!');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast('Note copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    StorageService.deleteQuickNote(id);
    onShowToast('Note deleted.');
  };

  const handleTogglePin = (id: string) => {
    StorageService.togglePinQuickNote(id);
  };

  // Sort pinned first
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
          <StickyNote className="w-4 h-4 text-amber-500" />
          <span>Quick Campus Notes & Scratchpad</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
            {notes.length}
          </span>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3 h-3" />
            <span>New Note</span>
          </button>
        )}
      </div>

      {/* Inline Add Note Form */}
      {isAdding && (
        <form onSubmit={handleSaveNote} className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
              Add Scratchpad Note
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title (e.g., Prof. Office Room or Lab Code)"
            className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none"
          />

          <textarea
            rows={2}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Enter quick notes, formulas, Zoom links, contact numbers..."
            className="w-full px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
          />

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shadow-xs cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-2">
        {sortedNotes.length === 0 ? (
          <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs">
            No quick notes yet. Use this scratchpad for faculty office hours and submission tips.
          </div>
        ) : (
          sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-2xl border transition ${
                note.pinned
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                  : 'bg-slate-50/50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  {note.pinned && (
                    <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {note.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition ${
                      note.pinned ? 'text-amber-500' : 'text-slate-400'
                    }`}
                    title={note.pinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleCopy(note.id, `${note.title}\n${note.content}`)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Copy note"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    title="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center justify-between">
                <span>
                  Updated {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
