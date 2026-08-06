'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie } from 'lucide-react';

// ==============================
// UTILITAIRE GLOBAL
// ==============================
export const hasConsent = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('briefly-cookie-consent') === 'accepted';
};

// ==============================
// CHARGEMENT SCRIPTS (EX: GA)
// ==============================
const loadAnalytics = () => {
  if (window.__analyticsLoaded) return;

  // Exemple Google Analytics (remplace par ton ID)
  const script = document.createElement('script');
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');

  window.__analyticsLoaded = true;
};

// ==============================
// COMPONENT
// ==============================
export default function CookieBanner({ B24_BLUE }) {

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('briefly-cookie-consent');

    if (!consent) {
      setShowBanner(true);
    }

    if (consent === 'accepted') {
      loadAnalytics(); // active les scripts
    }

  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('briefly-cookie-consent', choice);
    setShowBanner(false);

    if (choice === 'accepted') {
      loadAnalytics();
    }

    if (choice === 'refused') {
      // Nettoyage si besoin
      localStorage.removeItem('_ga');
      localStorage.removeItem('_gid');

      window.location.reload();
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-md bg-white border border-slate-100 shadow-xl p-6 z-[9999] rounded-2xl">

      <div className="flex gap-4">
        <div
          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"
          style={{ color: B24_BLUE }}
        >
          <Cookie size={20} />
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-lg">
            Cookies & Confidentialité
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Nous utilisons des cookies pour mesurer l’audience et améliorer votre expérience.
            Aucun traceur n’est activé sans votre consentement.
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">

        <button
          onClick={() => handleConsent('refused')}
          className="flex-1 px-4 py-3 text-xs font-bold uppercase text-slate-400 hover:text-slate-600"
        >
          Refuser
        </button>

        <button
          onClick={() => handleConsent('accepted')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase text-white"
          style={{ backgroundColor: B24_BLUE }}
        >
          <ShieldCheck size={14} />
          Accepter
        </button>

      </div>

    </div>
  );
}