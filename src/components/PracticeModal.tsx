import React, { useState } from 'react';
import { Activity, X, Check, Bookmark, Sparkles, Heart } from 'lucide-react';
import { Category, KBEntry } from '../types';
import { PILLAR_INFO } from '../data/knowledgeBase';

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  entry: KBEntry | null;
  onSaveReflection: (category: Category, practiceNotes: string) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  isOpen,
  onClose,
  category,
  entry,
  onSaveReflection,
}) => {
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !category || !entry) return null;

  const pillarMeta = PILLAR_INFO[entry.pillar];

  const handleSave = () => {
    if (!reflectionNotes.trim()) return;
    onSaveReflection(category, reflectionNotes.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-50/80 border-b border-emerald-200 p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${pillarMeta.badgeColor}`}>
                  {pillarMeta.title}
                </span>
                <span className="text-xs text-emerald-900 font-semibold">
                  Category #{category.category_id}
                </span>
              </div>
              <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
                Guided Practice Session
              </h2>
              <p className="text-xs text-emerald-800">
                Teachings of {entry.source_author} · <span className="italic">{entry.source_work}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-emerald-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Practice Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Practice Description */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              The Prescribed Technique
            </span>
            <p className="text-sm sm:text-base text-stone-900 leading-relaxed font-serif-display italic">
              "{entry.practice_or_technique}"
            </p>
          </div>

          {/* Guided Steps Container */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Suggested 4-Step Contemplation
            </span>
            <div className="grid gap-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                <div>
                  <strong className="text-stone-900 block">Ground in the physical body</strong>
                  <span className="text-stone-600">Take three deep breaths. Allow your shoulders and jaw to drop. Notice the contact between your body and the chair or ground.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                <div>
                  <strong className="text-stone-900 block">Acknowledge without judgment</strong>
                  <span className="text-stone-600">Bring the current inner struggle to mind. Notice where tension lives in your chest, throat, or stomach without trying to force it away.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                <div>
                  <strong className="text-stone-900 block">Apply the teaching</strong>
                  <span className="text-stone-600">Hold {entry.source_author}’s instruction in mind. Gently repeat the reframe or dialog with the split-off inner feeling.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                <div>
                  <strong className="text-stone-900 block">Integrate & Record</strong>
                  <span className="text-stone-600">What shifted or made itself known? Write down any insight or felt sensation below.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reflection Journal Textarea */}
          <div className="space-y-2">
            <label htmlFor="practice-journal-input" className="text-xs font-semibold text-stone-800 flex items-center justify-between">
              <span>My Practice Reflection Journal</span>
              <span className="text-stone-400 font-normal">Private & saved locally</span>
            </label>
            <textarea
              id="practice-journal-input"
              rows={3}
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="What came up as you sat with this practice? What did the inner voice or feeling say?"
              className="w-full rounded-xl border border-stone-300 p-3 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-stone-50/50"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Saved reflections can be reviewed anytime under Saved.</span>
              </span>

              <button
                type="button"
                onClick={handleSave}
                disabled={!reflectionNotes.trim()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Reflection Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save to Journal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium transition"
          >
            Complete Practice Session
          </button>
        </div>
      </div>
    </div>
  );
};
