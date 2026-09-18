import React, { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Bookmark,
  Check,
  Share2,
  ExternalLink,
  ShieldAlert,
  Feather,
  BookOpen,
  Eye,
  Activity,
  Copy,
} from 'lucide-react';
import { Category, MatchResult, PillarType, KBEntry, ExistentialRoot } from '../types';
import { EXISTENTIAL_ROOTS_INFO, PILLAR_INFO } from '../data/knowledgeBase';

interface GuidanceViewProps {
  result: MatchResult;
  userProblem: string;
  onBack: () => void;
  onOpenPractice: (category: Category, entry: KBEntry) => void;
  onSave: (problem: string, category: Category, affirmation: string) => void;
  isSaved: boolean;
  onOpenCrisis: () => void;
}

export const GuidanceView: React.FC<GuidanceViewProps> = ({
  result,
  userProblem,
  onBack,
  onOpenPractice,
  onSave,
  isSaved,
  onOpenCrisis,
}) => {
  const { matchedCategory, personalizedAffirmation, groundedSynthesis, isCrisisDetected, crisisType, crisisDetails, aiSynthesis } = result;
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);
  const [activePillarTab, setActivePillarTab] = useState<PillarType | 'all'>('all');

  const handleCopyAffirmation = () => {
    if (personalizedAffirmation) {
      navigator.clipboard.writeText(personalizedAffirmation);
      setCopiedAffirmation(true);
      setTimeout(() => setCopiedAffirmation(false), 2000);
    }
  };

  const visibleEntries = activePillarTab === 'all'
    ? matchedCategory.entries
    : matchedCategory.entries.filter((e: KBEntry) => e.pillar === activePillarTab);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 transition px-3 py-1.5 rounded-lg hover:bg-stone-200/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change problem or search again</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSave(userProblem, matchedCategory, personalizedAffirmation || '')}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
              isSaved
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-700" />
                <span>Saved to Reflections</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Reflection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety / Crisis Alert if applicable */}
      {isCrisisDetected && (
        <div className="rounded-2xl border-2 border-rose-300 bg-rose-50/90 p-5 sm:p-6 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
                <span>Care & Safety Grounding</span>
                {crisisType && (
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-200 text-rose-800">
                    {crisisType.replace('_', ' ')}
                  </span>
                )}
              </h3>
              <p className="text-sm text-rose-800 leading-relaxed">
                {crisisDetails || 'Wisdom teachings and philosophy are meant as personal contemplation, never as a substitute for acute emergency support or medical care.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenCrisis}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-xs transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Access Immediate 24/7 Crisis Lifelines (988 & Text Line)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
              Category #{matchedCategory.category_id}
            </span>
            <div className="flex items-center gap-1.5">
              {matchedCategory.existential_roots.map((root: ExistentialRoot) => {
                const info = EXISTENTIAL_ROOTS_INFO[root];
                if (!info) return null;
                return (
                  <span
                    key={root}
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${info.bgColor} ${info.borderColor} ${info.color}`}
                  >
                    {info.label}
                  </span>
                );
              })}
            </div>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Match score: {result.confidenceScore}%
          </span>
        </div>

        <div>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 leading-tight">
            {matchedCategory.category_name}
          </h2>
          {userProblem && (
            <div className="mt-3 text-xs text-stone-500 bg-stone-50 rounded-xl p-3 border border-stone-200/80">
              <strong className="text-stone-700">Your query:</strong> "{userProblem}"
            </div>
          )}
        </div>

        {/* Safety note for this specific category */}
        {matchedCategory.safety_notes && matchedCategory.safety_notes.length > 0 && (
          <div className="text-xs text-stone-600 bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
            <span className="font-semibold text-amber-900 uppercase tracking-wider text-[10px] block">
              Clinical Context Note
            </span>
            <p className="leading-relaxed">
              {matchedCategory.safety_notes[0]}
            </p>
          </div>
        )}
      </div>

      {/* Grounded Affirmation Card */}
      {personalizedAffirmation && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-50 p-6 sm:p-8 shadow-md border border-stone-800 space-y-4">
          <div className="flex items-center justify-between text-stone-400">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-amber-400/90">
              <Feather className="w-4 h-4" />
              <span>Grounded Daily Affirmation</span>
            </div>
            <button
              onClick={handleCopyAffirmation}
              className="text-xs text-stone-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 transition"
              title="Copy affirmation"
            >
              {copiedAffirmation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <blockquote className="font-serif-display text-xl sm:text-2xl text-stone-100 font-normal italic leading-relaxed">
            "{personalizedAffirmation}"
          </blockquote>

          <p className="text-xs text-stone-400 font-light">
            Anchored directly in the teachings of {matchedCategory.entries.map((e: KBEntry) => e.source_author).join(', ')}.
          </p>
        </div>
      )}

      {/* Synthesis Note (How the 3 pillars dissolve this suffering) */}
      <div className="bg-stone-100/80 rounded-2xl border border-stone-200/80 p-5 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-stone-700">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>The Threefold Wisdom Synthesis</span>
        </div>
        <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif-display italic">
          "{groundedSynthesis || matchedCategory.synthesis_note}"
        </p>

        {aiSynthesis && (
          <div className="mt-4 pt-4 border-t border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
            <span className="font-semibold text-stone-900 block text-xs uppercase tracking-wider">
              Reflective Grounded Guidance
            </span>
            <div className="whitespace-pre-line text-stone-800 font-light">
              {aiSynthesis}
            </div>
          </div>
        )}
      </div>

      {/* Pillars View Header & Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <h3 className="font-serif-display text-xl sm:text-2xl font-semibold text-stone-900">
              The Three Grounded Pillars
            </h3>
            <p className="text-xs text-stone-500">
              Verified sources, citations, and practices for this category.
            </p>
          </div>

          {/* Pillar selector tabs */}
          <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setActivePillarTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activePillarTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Three Pillars
            </button>
            <button
              onClick={() => setActivePillarTab('eastern_philosophy')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activePillarTab === 'eastern_philosophy'
                  ? 'bg-white text-amber-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Eastern
            </button>
            <button
              onClick={() => setActivePillarTab('shadow_work')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activePillarTab === 'shadow_work'
                  ? 'bg-white text-indigo-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Shadow Work
            </button>
            <button
              onClick={() => setActivePillarTab('psychology_methodology')}
              className={`px-2.5 py-1.5 rounded-lg transition ${
                activePillarTab === 'psychology_methodology'
                  ? 'bg-white text-emerald-950 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Psychology
            </button>
          </div>
        </div>

        {/* Pillar Cards Grid */}
        <div className="grid gap-6">
          {visibleEntries.map((entry: KBEntry) => {
            const pillarMeta = PILLAR_INFO[entry.pillar];
            return (
              <div
                key={entry.entry_id}
                className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-5 transition hover:border-stone-300"
              >
                {/* Pillar Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pillarMeta.badgeColor}`}>
                      {pillarMeta.title}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      Entry {entry.entry_id}
                    </span>
                  </div>

                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    {entry.confidence}
                  </span>
                </div>

                {/* Author & Source Work */}
                <div>
                  <div className="text-lg sm:text-xl font-serif-display font-semibold text-stone-900">
                    {entry.source_author}
                  </div>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    {entry.tradition_or_school} · <span className="italic text-stone-700">{entry.source_work}</span>
                  </div>
                </div>

                {/* Verified Quote if exists */}
                {entry.verified_quote && (
                  <div className="bg-stone-50 border-l-3 border-amber-600/70 p-3.5 rounded-r-xl space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900">
                      Verified Sourced Quote
                    </span>
                    <p className="font-serif-display text-sm sm:text-base italic text-stone-800 leading-relaxed">
                      "{entry.verified_quote}"
                    </p>
                  </div>
                )}

                {/* Core Teaching */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Core Teaching
                  </span>
                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
                    {entry.teaching}
                  </p>
                </div>

                {/* Practice or Technique if exists */}
                {entry.practice_or_technique && (
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-700" />
                        Practice / Technique
                      </span>
                      <button
                        onClick={() => onOpenPractice(matchedCategory, entry)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                      >
                        Start practice session →
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                      {entry.practice_or_technique}
                    </p>
                  </div>
                )}

                {/* Citations and external links */}
                {entry.citation_urls && entry.citation_urls.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-stone-400 font-medium">
                      Primary Verification Sources:
                    </span>
                    {entry.citation_urls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-stone-600 hover:text-amber-800 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1 rounded inline-flex items-center gap-1 transition truncate max-w-xs"
                      >
                        <span>{new URL(url).hostname.replace('www.', '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 text-stone-400" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
