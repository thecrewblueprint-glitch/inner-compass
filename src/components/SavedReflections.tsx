import React from 'react';
import { Bookmark, Trash2, ArrowRight, Download, Calendar, Feather, BookOpen } from 'lucide-react';
import { SavedReflection, Category } from '../types';
import { ALL_CATEGORIES } from '../data/knowledgeBase';

interface SavedReflectionsProps {
  reflections: SavedReflection[];
  onSelectCategory: (category: Category) => void;
  onDeleteReflection: (id: string) => void;
  onClearAll: () => void;
}

export const SavedReflections: React.FC<SavedReflectionsProps> = ({
  reflections,
  onSelectCategory,
  onDeleteReflection,
  onClearAll,
}) => {
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reflections, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `inner-compass-reflections-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (reflections.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center mx-auto">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="font-serif-display text-2xl font-semibold text-stone-900">
          No Saved Reflections Yet
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          When you receive guidance or complete a practice session, you can bookmark the affirmation and save personal reflections here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-stone-900">
            Saved Reflections & Affirmations
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {reflections.length} {reflections.length === 1 ? 'entry' : 'entries'} stored in your local journal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Journal</span>
          </button>

          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 text-rose-700 hover:border-rose-300 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Reflections list */}
      <div className="space-y-4">
        {reflections.map((ref) => {
          const category = ALL_CATEGORIES.find(c => c.category_id === ref.categoryId);
          const formattedDate = new Date(ref.timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={ref.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm space-y-4 transition hover:border-stone-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    Category #{ref.categoryId}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {ref.categoryName}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formattedDate}
                  </span>
                  <button
                    onClick={() => onDeleteReflection(ref.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Problem Prompt */}
              {ref.problemInput && (
                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-150">
                  <strong className="text-stone-800">Your situation: </strong>
                  "{ref.problemInput}"
                </div>
              )}

              {/* Affirmation */}
              {ref.affirmation && (
                <div className="bg-stone-900 text-stone-100 p-4 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-amber-400">
                    <Feather className="w-3.5 h-3.5" />
                    <span>Grounded Affirmation</span>
                  </div>
                  <blockquote className="font-serif-display text-sm sm:text-base italic font-light leading-relaxed">
                    "{ref.affirmation}"
                  </blockquote>
                </div>
              )}

              {/* Practice Notes */}
              {ref.practiceNotes && (
                <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl space-y-1 text-xs">
                  <strong className="text-emerald-950 font-bold block uppercase tracking-wider text-[10px]">
                    Personal Practice Notes
                  </strong>
                  <p className="text-emerald-950 whitespace-pre-wrap leading-relaxed">
                    {ref.practiceNotes}
                  </p>
                </div>
              )}

              {/* Synthesis Note */}
              <div className="text-xs text-stone-600 leading-relaxed font-serif-display italic border-t border-stone-100 pt-3">
                "{ref.synthesisNote}"
              </div>

              {/* View Category Link */}
              {category && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onSelectCategory(category)}
                    className="text-xs font-semibold text-stone-700 hover:text-amber-800 inline-flex items-center gap-1 group transition"
                  >
                    <span>Review full 3-pillar guidance</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
