import React from 'react';
import { ShieldAlert, Phone, MessageSquare, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/knowledgeBase';

export const CrisisView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-200/80 text-rose-900 text-xs font-semibold">
              <span>Always Free · 100% Confidential · Available 24/7</span>
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-950">
              Immediate Crisis & Safety Lifelines
            </h1>
            <p className="text-sm sm:text-base text-rose-900 leading-relaxed max-w-2xl font-light">
              Inner Compass is designed for contemplative, grounded wisdom. If you are experiencing thoughts of suicide, severe distress, acute substance withdrawal, or relationship abuse, immediate human support is right here.
            </p>
          </div>
        </div>
      </div>

      {/* Resources Cards */}
      <div className="grid gap-4">
        {CRISIS_RESOURCES.map((res, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm hover:border-stone-300 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-display text-lg sm:text-xl font-bold text-stone-900">
                    {res.name}
                  </h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    {res.badge}
                  </span>
                </div>
                <div className="text-xs font-semibold text-rose-700 mt-0.5">
                  {res.contact}
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex items-center gap-2">
                {res.tel && (
                  <a
                    href={res.tel}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                )}
                {res.sms && (
                  <a
                    href={res.sms}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Text Support</span>
                  </a>
                )}
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
              {res.description}
            </p>
          </div>
        ))}
      </div>

      {/* Clinical Grounding Note from Roadmap */}
      <div className="bg-stone-100 rounded-2xl border border-stone-200 p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>About Inner Compass Safety Architecture</span>
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          In alignment with our clinical research guidelines (<code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">docs/CLINICAL_KB_V1.0.md</code>), high-acuity categories such as Substance Use (#10) operate under a hard safety ceiling: philosophical reflection is only a companion for recovery, never a substitute for medical detoxification or emergency intervention.
        </p>
      </div>
    </div>
  );
};
