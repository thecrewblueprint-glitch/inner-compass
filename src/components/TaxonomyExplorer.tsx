import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Layers, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { ALL_CATEGORIES, EXISTENTIAL_ROOTS_INFO, KB_METADATA } from '../data/knowledgeBase';
import { Category, ExistentialRoot } from '../types';

interface TaxonomyExplorerProps {
  onSelectCategory: (category: Category) => void;
}

export const TaxonomyExplorer: React.FC<TaxonomyExplorerProps> = ({ onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<ExistentialRoot | 'all'>('all');

  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((cat) => {
      // Root filter
      if (selectedRoot !== 'all' && !cat.existential_roots.includes(selectedRoot)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inName = cat.category_name.toLowerCase().includes(query);
        const inRoots = cat.existential_roots.some(r => r.toLowerCase().includes(query));
        const inSynthesis = cat.synthesis_note.toLowerCase().includes(query);
        const inEntries = cat.entries.some(e =>
          e.source_author.toLowerCase().includes(query) ||
          e.source_work.toLowerCase().includes(query) ||
          e.teaching.toLowerCase().includes(query) ||
          (e.verified_quote && e.verified_quote.toLowerCase().includes(query))
        );
        return inName || inRoots || inSynthesis || inEntries;
      }

      return true;
    });
  }, [searchQuery, selectedRoot]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 border border-stone-300 text-xs text-stone-700 font-medium">
          <BookOpen className="w-3.5 h-3.5 text-amber-700" />
          <span>Full Grounded Knowledge Base · 25 Categories · 75 Teachings</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-stone-900">
          Wisdom Taxonomy & Knowledge Base
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
          Organized around Irvin Yalom's four ultimate concerns of human existence:
          Death, Freedom, Isolation, and Meaninglessness.
        </p>
      </div>

      {/* Existential Roots Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(EXISTENTIAL_ROOTS_INFO) as ExistentialRoot[]).map((rootKey) => {
          const info = EXISTENTIAL_ROOTS_INFO[rootKey];
          const isSelected = selectedRoot === rootKey;
          const count = ALL_CATEGORIES.filter(c => c.existential_roots.includes(rootKey)).length;

          return (
            <button
              key={rootKey}
              onClick={() => setSelectedRoot(isSelected ? 'all' : rootKey)}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                isSelected
                  ? `${info.bgColor} ${info.borderColor} ring-2 ring-stone-900 shadow-xs`
                  : 'bg-white border-stone-200 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${info.color}`}>
                  {info.label}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {count} topics
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "{info.yalomFraming}"
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories, teachers (Jung, Neff, Thich Nhat Hanh...), or concepts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 bg-stone-50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRoot('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
              selectedRoot === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Roots ({ALL_CATEGORIES.length})
          </button>
          {(Object.keys(EXISTENTIAL_ROOTS_INFO) as ExistentialRoot[]).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoot(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                selectedRoot === r
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-500 px-1">
          <span>Showing {filteredCategories.length} of {ALL_CATEGORIES.length} categories</span>
          <span>Each category holds 3 researched pillars</span>
        </div>

        <div className="grid gap-3.5">
          {filteredCategories.map((cat) => {
            const isHardCeiling = KB_METADATA.hard_ceiling_categories.includes(cat.category_id);
            const isEscalation = KB_METADATA.escalation_candidate_categories.includes(cat.category_id);

            return (
              <div
                key={cat.category_id}
                onClick={() => onSelectCategory(cat)}
                className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 hover:border-stone-400 hover:shadow-sm transition cursor-pointer group space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                      #{cat.category_id}
                    </span>
                    <h3 className="font-serif-display text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition">
                      {cat.category_name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {cat.existential_roots.map((root) => {
                      const rootInfo = EXISTENTIAL_ROOTS_INFO[root];
                      return (
                        <span
                          key={root}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${rootInfo.bgColor} ${rootInfo.borderColor} ${rootInfo.color}`}
                        >
                          {root}
                        </span>
                      );
                    })}

                    {isHardCeiling && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        Hard Ceiling
                      </span>
                    )}

                    {isEscalation && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        Escalation Flag
                      </span>
                    )}
                  </div>
                </div>

                {/* Synthesis preview */}
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light line-clamp-2">
                  {cat.synthesis_note}
                </p>

                {/* Three pillars author preview */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-stone-500">
                    <span className="font-medium text-stone-700">Teachers:</span>
                    {cat.entries.map((e, idx) => (
                      <span key={idx} className="bg-stone-50 px-2 py-0.5 rounded text-stone-600 border border-stone-200/60">
                        {e.source_author}
                      </span>
                    ))}
                  </div>

                  <span className="text-stone-400 group-hover:text-amber-800 flex items-center gap-1 font-medium transition text-xs">
                    <span>View full guidance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-base font-semibold text-stone-800">No categories found</h3>
              <p className="text-xs text-stone-500">
                Try a different search term or clear the existential root filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedRoot('all'); }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
