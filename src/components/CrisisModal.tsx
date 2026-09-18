import React from 'react';
import { ShieldAlert, Phone, MessageSquare, ExternalLink, Heart, X, LifeBuoy } from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/knowledgeBase';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50 border-b border-rose-200 p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif-display text-xl sm:text-2xl font-bold text-rose-950">
                24/7 Immediate Crisis & Safety Support
              </h2>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                Free, confidential, and staffed by compassionate human crisis counselors at all times.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-rose-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {reason && (
            <div className="bg-rose-100/70 border border-rose-300 rounded-xl p-3.5 text-xs text-rose-900 leading-relaxed font-medium">
              Notice: {reason}
            </div>
          )}

          <p className="text-sm text-stone-600 leading-relaxed font-light">
            Philosophical contemplation and self-reflection are valuable companions for living, but when acute crisis, self-harm, intimate partner abuse, or severe substance withdrawal occurs, immediate human support and medical care come first.
          </p>

          {/* Resources Directory */}
          <div className="grid gap-3.5">
            {CRISIS_RESOURCES.map((res, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-200 p-4 bg-stone-50/70 hover:bg-stone-50 transition space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                    <span>{res.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      {res.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {res.tel && (
                      <a
                        href={res.tel}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{res.contact}</span>
                      </a>
                    )}
                    {res.sms && (
                      <a
                        href={res.sms}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-900 text-white transition shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{res.contact}</span>
                      </a>
                    )}
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-stone-500 hover:text-stone-800 p-1.5 rounded hover:bg-stone-200 transition"
                      title="Visit website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {res.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-stone-100 rounded-xl p-4 text-xs text-stone-600 flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>You do not have to navigate unbearable moments in silence. Reaching out is an act of deep courage.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium transition"
          >
            Close Lifelines Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
