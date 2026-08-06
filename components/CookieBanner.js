'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings } from 'lucide-react';

export default function CookieBanner({ B24_BLUE }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('briefly-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('briefly-cookie-consent', choice);
    setShowBanner(false);

    // Reload si refus pour désactiver scripts éventuels
    if (choice === 'refused') {
      window.location.reload();
    }
  };

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-lg bg-white border border-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.12)] p-8 z-[9999] rounded-[2rem] animate-in fade-in slide-in-from-bottom-10 duration-500"
    >
      <div className="flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0"
            style={{ color: B24_BLUE }}
          >
            <Cookie size={24} />
          </div>

          <div>
            <h3 className="font-serif italic font-black text-xl text-slate-900">
              Confidentialité & Cookies
            </h3>

            <p className="text-[13px] leading-relaxed text-slate-500 mt-2 font-medium">
              Nous utilisons des cookies pour améliorer votre expérience,
              mesurer l’audience et proposer des contenus pertinents.
              <br />
              <span className="text-slate-700">
                Vous pouvez accepter, refuser ou personnaliser vos préférences à tout moment.
              </span>
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          <div className="flex flex-col sm:flex-row gap-3 w-full">

            <button
              onClick={() => handleConsent('refused')}
              className="w-full sm:w-auto px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Refuser
            </button>

            <button
              onClick={() => handleConsent('custom')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <Settings size={14} />
              Personnaliser
            </button>

            <button
              onClick={() => handleConsent('accepted')}
              className="w-full flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: B24_BLUE }}
            >
              <ShieldCheck size={16} />
              Accepter
            </button>
          </div>

        </div>

        {/* FOOTER */}
        <p className="text-[10px] text-center text-slate-400 leading-relaxed">
          En poursuivant votre navigation, vous acceptez l’utilisation de cookies
          conformément à notre politique de confidentialité.
        </p>

      </div>
    </div>
  );
}