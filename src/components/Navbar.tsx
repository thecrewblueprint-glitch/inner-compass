import React from 'react';
import { Compass, BookOpen, Bookmark, ShieldAlert, Sparkles, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  currentTab: 'ask' | 'taxonomy' | 'saved' | 'crisis';
  onSelectTab: (tab: 'ask' | 'taxonomy' | 'saved' | 'crisis') => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, savedCount }) => {
  return (
    <header className="border-b border-stone-200 bg-stone-50/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          id="nav-brand-button"
          onClick={() => onSelectTab('ask')}
          className="flex items-center gap-3 group text-left transition"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-stone-800 text-stone-50 flex items-center justify-center shadow-sm group-hover:shadow transition-all">
            <Compass className="w-6 h-6 transform group-hover:rotate-45 transition-transform duration-500 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-xl font-semibold tracking-wide text-stone-900">
                Inner Compass
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                v1.0 Sourced
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Eastern Philosophy · Shadow Work · Psychology
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-ask"
            onClick={() => onSelectTab('ask')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === 'ask'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">Seek Guidance</span>
            <span className="sm:hidden">Seek</span>
          </button>

          <button
            id="nav-tab-taxonomy"
            onClick={() => onSelectTab('taxonomy')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
              currentTab === 'taxonomy'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Wisdom Library</span>
            <span className="sm:hidden">Library</span>
          </button>

          <button
            id="nav-tab-saved"
            onClick={() => onSelectTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition relative ${
              currentTab === 'saved'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-amber-500 text-white">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-crisis"
            onClick={() => onSelectTab('crisis')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition border ${
              currentTab === 'crisis'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'border-stone-200 text-stone-600 hover:text-rose-700 hover:bg-rose-50/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">24/7 Lifelines</span>
            <span className="sm:hidden">Help</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
