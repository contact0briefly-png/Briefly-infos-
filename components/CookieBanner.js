'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

// ============================== //
// CONSTANTES & CONFIGURATION     //
// ============================== //
const CONSENT_KEY = 'briefly-cookie-consent-v1';

// Catégories par défaut
const DEFAULT_PREFERENCES = {
  necessary: true, // Toujours vrai et non modifiable
  analytics: false,
  marketing: false,
};

// ============================== //
// UTILITAIRES EXPÉDIÉS / GLOBALS  //
// ============================== //

/**
 * Vérifie si une catégorie spécifique a reçu le consentement
 * @param {'necessary'|'analytics'|'marketing'} category 
 */
export const hasConsent = (category = 'necessary') => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed[category]);
  } catch {
    return false;
  }
};

/**
 * Supprime les cookies déposés par les traceurs lors d'un refus
 */
const purgeAnalyticsCookies = () => {
  if (typeof document === 'undefined') return;
  const cookiesToPurge = ['_ga', '_gid', '_gat'];
  const domains = [window.location.hostname, `.${window.location.hostname}`];
  
  cookiesToPurge.forEach((name) => {
    domains.forEach((domain) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
    });
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

/**
 * Charge les scripts externes en fonction des préférences accordées
 */
const applyConsentSettings = (preferences) => {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics / Performance
  if (preferences.analytics && !window.__analyticsLoaded) {
    const script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"; // Remplace par ton ID
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXX');

    window.__analyticsLoaded = true;
  } else if (!preferences.analytics) {
    purgeAnalyticsCookies();
  }

  // 2. Pixels marketing (si applicable à l'avenir)
  if (preferences.marketing) {
    // Insère tes scripts marketing ici
  }
};

// ============================== //
// COMPOSANT PRINCIPAL            //
// ============================== //
export default function CookieBanner({ B24_BLUE = '#2563eb' }) {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    const rawConsent = localStorage.getItem(CONSENT_KEY);
    if (!rawConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(rawConsent);
        setPreferences(parsed);
        applyConsentSettings(parsed);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (newPreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    applyConsentSettings(newPreferences);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRefuseAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      /* BANNIÈRE COMPACTE (Vue initiale)                                   */
      {/* ------------------------------------------------------------------ */}
      <div 
        role="dialog"
        aria-label="Gestion des cookies"
        aria-live="polite"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-6 z-[9999] rounded-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0" 
            style={{ color: B24_BLUE }} 
          >
            <Cookie size={22} />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-base">
              Respect de votre vie privée
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Nous utilisons des cookies pour assurer le bon fonctionnement du site et analyser notre trafic. Vous pouvez personnaliser vos choix à tout moment.
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings size={14} />
            Personnaliser
          </button>
          
          <button
            onClick={handleRefuseAll}
            className="flex-1 px-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tout refuser
          </button>

          <button
            onClick={handleAcceptAll}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            style={{ backgroundColor: B24_BLUE }}
          >
            <ShieldCheck size={14} />
            Tout accepter
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      /* MODAL DE PERSONNALISATION GRANULAIRE                               */
      {/* ------------------------------------------------------------------ */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings size={18} style={{ color: B24_BLUE }} />
                <h4 className="font-bold text-slate-900 text-sm">
                  Préférences des cookies
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corps Modal / Liste des catégories */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              {/* Option 1: NÉCESSAIRES */}
              <div className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Nécessaires (Obligatoires)
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Indispensables au fonctionnement de base et à la sécurité du site.
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled
                  checked={true}
                  className="mt-1 h-4 w-4 rounded accent-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Option 2: ANALYTIQUES */}
              <div className="flex items-start justify-between gap-3 p-3 border border-slate-100 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Analytiques & Mesure d'audience
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Permettent de comprendre comment les visiteurs interagissent avec le site.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="analytics-cookie"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: B24_BLUE }}
                />
              </div>

              {/* Option 3: MARKETING */}
              <div className="flex items-start justify-between gap-3 p-3 border border-slate-100 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Marketing & Retargeting
                  </span>
                  <p className="text-slate-500 mt-0.5">
                    Utilisés pour afficher du contenu ou des publicités personnalisés.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="marketing-cookie"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: B24_BLUE }}
                />
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex gap-2 p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleSavePreferences}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: B24_BLUE }}
              >
                <Check size={14} />
                Enregistrer mes choix
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
