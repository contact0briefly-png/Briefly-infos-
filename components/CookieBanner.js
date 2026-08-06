'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

const CONSENT_KEY = 'briefly-cookie-consent-v1';

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: false,
  notifications: true, // Webpushr / Notifications
};

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

// ============================== //
// CHARGEMENT DES SCRIPTS EXTERNES//
// ============================== //

/**
 * Charge le script Webpushr pour afficher la cloche et demander l'autorisation push
 */
const loadWebpushr = () => {
  if (typeof window === 'undefined' || window.__webpushrLoaded) return;

  // Configuration Webpushr (À remplacer avec ta clé réelle si besoin)
  window._webpushr = window._webpushr || [];
  window._webpushr.push(['setup', { key: 'TA_CLE_WEBPUSHR' }]); // <-- Remplace par ta clé Webpushr

  const script = document.createElement('script');
  script.src = 'https://cdn.webpushr.com/app.min.js';
  script.async = true;
  document.head.appendChild(script);

  window.__webpushrLoaded = true;
};

/**
 * Charge Google Analytics
 */
const loadAnalytics = () => {
  if (typeof window === 'undefined' || window.__analyticsLoaded) return;

  const script = document.createElement('script');
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"; // <-- Ton ID GA
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');

  window.__analyticsLoaded = true;
};

/**
 * Déclenche les scripts selon les préférences enregistrées
 */
const applyConsentSettings = (preferences) => {
  if (typeof window === 'undefined') return;

  // 1. Webpushr (Notifications Push)
  if (preferences.notifications) {
    loadWebpushr();
  }

  // 2. Google Analytics
  if (preferences.analytics) {
    loadAnalytics();
  }
};

// ============================== //
// COMPOSANT BANNIÈRE             //
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
    saveConsent({ necessary: true, analytics: true, notifications: true });
  };

  const handleRefuseAll = () => {
    // Si tu considères Webpushr comme un service essentiel ou désirable,
    // tu peux ajuster si le refus des cookies désactive aussi les notifications.
    saveConsent({ necessary: true, analytics: false, notifications: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      <div 
        role="dialog"
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-lg bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-6 z-[9999] rounded-2xl"
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
              Nous utilisons des cookies pour mesurer notre audience et vous envoyer des notifications d'actualité en direct.
            </p>
          </div>
        </div>

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

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings size={18} style={{ color: B24_BLUE }} />
                <h4 className="font-bold text-slate-900 text-sm">
                  Préférences
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
              <div className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Nécessaires</span>
                  <p className="text-slate-500 mt-0.5">Fonctionnement de base du site.</p>
                </div>
                <input type="checkbox" disabled checked className="mt-1 h-4 w-4 rounded" />
              </div>

              {/* Option Webpushr */}
              <div className="flex items-start justify-between gap-3 p-3 border border-slate-100 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Notifications Push</span>
                  <p className="text-slate-500 mt-0.5">Autoriser la cloche et l'envoi d'alertes d'information.</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: B24_BLUE }}
                />
              </div>

              {/* Option Analytics */}
              <div className="flex items-start justify-between gap-3 p-3 border border-slate-100 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">Analytiques</span>
                  <p className="text-slate-500 mt-0.5">Mesure d'audience (Google Analytics).</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: B24_BLUE }}
                />
              </div>
            </div>

            <div className="flex gap-2 p-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={handleSavePreferences}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
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
