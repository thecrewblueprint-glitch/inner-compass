import React, { useState } from 'react';
import { Compass, Sparkles, AlertCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { ExistentialRoot } from '../types';
import { EXISTENTIAL_ROOTS_INFO } from '../data/knowledgeBase';

interface ProblemInputProps {
  onSubmit: (problem: string, root?: ExistentialRoot | null) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  { text: 'I feel completely alone and disconnected, even when surrounded by friends or family.', root: 'Isolation' as ExistentialRoot },
  { text: 'I am paralyzed at a crossroads and terrified that making the wrong choice will ruin my life.', root: 'Freedom' as ExistentialRoot },
  { text: 'I made a mistake that hurt someone I love and I can not find a way to forgive myself.', root: 'Freedom' as ExistentialRoot },
  { text: 'Everything in my work feels hollow. I am going through the motions with zero sense of purpose.', root: 'Meaninglessness' as ExistentialRoot },
  { text: 'I am grieving the end of an important era in my life and I can not bear the emptiness.', root: 'Death' as ExistentialRoot },
  { text: 'I keep comparing my progress to peers on social media and feeling defective and far behind.', root: 'Meaninglessness' as ExistentialRoot },
];

export const ProblemInput: React.FC<ProblemInputProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const [selectedRoot, setSelectedRoot] = useState<ExistentialRoot | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim(), selectedRoot);
  };

  const handleSelectSample = (sample: { text: string; root: ExistentialRoot }) => {
    setInput(sample.text);
    setSelectedRoot(sample.root);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Editorial Headline */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 border border-stone-300 text-xs text-stone-700 font-medium">
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>Retrieval-Augmented Wisdom · 25 Clinical Categories · 75 Verified Sources</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-stone-900 leading-tight">
          What inner challenge are you carrying today?
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light">
          Break down your struggle to receive grounded guidance and an affirmation drawn from
          <strong className="font-semibold text-stone-800"> Eastern philosophy</strong>,
          <strong className="font-semibold text-stone-800"> Jungian shadow work</strong>, and
          <strong className="font-semibold text-stone-800"> evidence-based psychology</strong>.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="problem-text-input" className="text-sm font-semibold text-stone-800 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-700" />
              Describe your situation or felt experience
            </label>
            <span className="text-xs text-stone-400">
              {input.length} characters
            </span>
          </div>

          <textarea
            id="problem-text-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What is happening? What thoughts, feelings, or dilemmas are arising? Speak freely in your own words..."
            rows={4}
            className="w-full rounded-xl border border-stone-300 px-4 py-3.5 text-stone-800 placeholder-stone-400 text-base focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition resize-y leading-relaxed bg-stone-50/50"
            required
          />
        </div>

        {/* Existential Roots Filter Selector */}
        <div className="space-y-2.5 pt-1 border-t border-stone-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Optional Existential Lens (Yalom's 4 Givens of Existence)
            </span>
            {selectedRoot && (
              <button
                type="button"
                onClick={() => setSelectedRoot(null)}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Clear lens
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(EXISTENTIAL_ROOTS_INFO) as ExistentialRoot[]).map((rootKey) => {
              const info = EXISTENTIAL_ROOTS_INFO[rootKey];
              const isSelected = selectedRoot === rootKey;
              return (
                <button
                  type="button"
                  key={rootKey}
                  onClick={() => setSelectedRoot(isSelected ? null : rootKey)}
                  className={`px-3 py-2 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                    isSelected
                      ? `${info.bgColor} ${info.borderColor} ${info.color} ring-1 ring-offset-1 ring-stone-400 font-semibold`
                      : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span className="font-medium">{info.label}</span>
                  <span className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                    {info.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit & Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-stone-500 text-center sm:text-left flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Pure retrieval matching against human-verified research. Never fabricated.</span>
          </p>

          <button
            type="submit"
            id="submit-problem-btn"
            disabled={!input.trim() || isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-50 font-medium text-sm flex items-center justify-center gap-2 shadow transition"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Consulting Knowledge Base...</span>
              </>
            ) : (
              <>
                <span>Seek Grounded Guidance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Real Case Scenarios */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 text-center">
          Or explore common life situations
        </h3>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/80 hover:bg-white hover:border-stone-300 text-left transition group shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                <span className="px-2 py-0.5 rounded bg-stone-200/70 text-stone-700">
                  {sample.root}
                </span>
                <span className="text-stone-400 group-hover:text-amber-700 flex items-center gap-0.5 transition">
                  Use prompt <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
