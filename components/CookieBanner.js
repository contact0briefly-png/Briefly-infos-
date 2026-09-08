"use client";
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Shield, BarChart2, Target, Settings } from 'lucide-react';

/* ══════════════════════════════════════════════════════
   CONFIGURATION DES CATÉGORIES DE COOKIES
══════════════════════════════════════════════════════ */
const COOKIE_CATEGORIES = [
    {
        id: 'necessary',
        icon: Shield,
        name: 'Cookies essentiels',
        description: 'Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.',
        required: true,
        services: [
            { name: 'Session utilisateur',   purpose: 'Maintien de votre connexion et préférences de navigation' },
            { name: 'Sécurité CSRF',         purpose: 'Protection contre les attaques de falsification de requêtes' },
            { name: 'Consentement cookies',  purpose: 'Mémorisation de vos choix de confidentialité' },
        ],
    },
    {
        id: 'analytics',
        icon: BarChart2,
        name: 'Cookies analytiques',
        description: 'Nous aident à comprendre comment les visiteurs interagissent avec le site afin d\'améliorer l\'expérience.',
        required: false,
        services: [
            { name: 'Firebase Analytics',  purpose: 'Comptage des visites et articles les plus lus (anonymisé)' },
            { name: 'Compteur de vues',    purpose: 'Suivi du nombre de lectures par article' },
            { name: 'Performance réseau',  purpose: 'Mesure des temps de chargement pour optimiser le site' },
        ],
    },
    {
        id: 'functional',
        icon: Settings,
        name: 'Cookies fonctionnels',
        description: 'Permettent des fonctionnalités améliorées comme la mémorisation de vos préférences.',
        required: false,
        services: [
            { name: 'Préférences d\'affichage', purpose: 'Mémorisation de votre catégorie favorite et langue' },
            { name: 'Notifications push',        purpose: 'Envoi d\'alertes lors de nouvelles publications (WebPushr)' },
            { name: 'Telegram WebApp',           purpose: 'Intégration avec l\'application Telegram' },
        ],
    },
    {
        id: 'marketing',
        icon: Target,
        name: 'Cookies de personnalisation',
        description: 'Utilisés pour afficher des contenus pertinents en fonction de vos intérêts.',
        required: false,
        services: [
            { name: 'Embeds TikTok',     purpose: 'Affichage de vidéos TikTok intégrées dans les articles' },
            { name: 'Embeds YouTube',    purpose: 'Lecture de vidéos YouTube intégrées dans les articles' },
            { name: 'Embeds Instagram',  purpose: 'Affichage de publications Instagram dans les articles' },
            { name: 'Embeds Twitter/X',  purpose: 'Affichage de tweets intégrés dans les articles' },
        ],
    },
];

const CONSENT_KEY   = 'briefly_cookie_consent';
const CONSENT_VER   = '1.0';

/* ══ Helpers ══ */
const getStoredConsent = () => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.version !== CONSENT_VER) return null;
        return parsed;
    } catch { return null; }
};

const saveConsent = (prefs) => {
    const data = {
        version:   CONSENT_VER,
        date:      new Date().toISOString(),
        prefs,
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    // Dispatche un événement global pour que les autres composants réagissent
    window.dispatchEvent(new CustomEvent('briefly:consent', { detail: prefs }));
    applyConsent(prefs);
};

/* ══ Application réelle du consentement ══ */
const applyConsent = (prefs) => {
    // Analytics
    if (prefs.analytics) {
        window['ga-disable-GA_MEASUREMENT_ID'] = false;
    } else {
        window['ga-disable-GA_MEASUREMENT_ID'] = true;
        // Supprimer les cookies analytics existants
        ['_ga', '_gid', '_gat'].forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
        });
    }

    // Fonctionnel — notifications push
    if (!prefs.functional) {
        // Désactiver les notifications si refusées
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
                reg.pushManager.getSubscription().then(sub => sub?.unsubscribe());
            }).catch(() => {});
        }
    }

    // Marketing — embeds tiers
    if (!prefs.marketing) {
        // Bloquer les iframes tierces déjà chargées
        document.querySelectorAll('iframe[src*="tiktok"], iframe[src*="youtube"], iframe[src*="instagram"], iframe[src*="twitter"]').forEach(f => {
            f.dataset.blockedSrc = f.src;
            f.src = 'about:blank';
        });
    } else {
        // Restaurer les iframes bloquées
        document.querySelectorAll('iframe[data-blocked-src]').forEach(f => {
            f.src = f.dataset.blockedSrc;
            delete f.dataset.blockedSrc;
        });
    }
};

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════ */
const CookieConsent = () => {
    const [visible,      setVisible]      = useState(false);
    const [panel,        setPanel]        = useState(false); // panneau détaillé
    const [expanded,     setExpanded]     = useState({});
    const [prefs,        setPrefs]        = useState({
        necessary:  true,
        analytics:  false,
        functional: false,
        marketing:  false,
    });

    useEffect(() => {
        const stored = getStoredConsent();
        if (!stored) {
            // Afficher la bannière après un court délai
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
        // Appliquer les préférences stockées sans afficher la bannière
        setPrefs(stored.prefs);
        applyConsent(stored.prefs);
    }, []);

    const acceptAll = () => {
        const all = { necessary: true, analytics: true, functional: true, marketing: true };
        setPrefs(all);
        saveConsent(all);
        setVisible(false);
        setPanel(false);
    };

    const rejectAll = () => {
        const minimal = { necessary: true, analytics: false, functional: false, marketing: false };
        setPrefs(minimal);
        saveConsent(minimal);
        setVisible(false);
        setPanel(false);
    };

    const saveCustom = () => {
        saveConsent(prefs);
        setVisible(false);
        setPanel(false);
    };

    const togglePref = (id) => {
        if (id === 'necessary') return;
        setPrefs(p => ({ ...p, [id]: !p[id] }));
    };

    const toggleExpand = (id) => {
        setExpanded(e => ({ ...e, [id]: !e[id] }));
    };

    if (!visible) return null;

    return (
        <>
            {/* Overlay sombre si panneau ouvert */}
            {panel && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                    onClick={() => setPanel(false)}
                />
            )}

            {/* ══ BANNIÈRE PRINCIPALE ══ */}
            {!panel && (
                <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
                    <div className="max-w-[900px] mx-auto bg-white border border-slate-200 shadow-2xl shadow-slate-900/20">
                        {/* Barre de titre */}
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Shield size={16} className="text-white opacity-70" />
                                <span className="text-[11px] font-black uppercase tracking-[.2em] text-white">
                                    Confidentialité & Cookies
                                </span>
                            </div>
                            <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
                                Briefly Digital Media
                            </span>
                        </div>

                        <div className="px-6 py-5">
                            <p className="text-[13px] text-slate-600 leading-relaxed mb-5">
                                Briefly utilise des cookies pour améliorer votre expérience, analyser notre audience et afficher des contenus multimédias.
                                Vous pouvez choisir librement ce que vous acceptez. Les cookies essentiels sont toujours actifs car ils garantissent le bon fonctionnement du site.
                            </p>

                            {/* Aperçu rapide des catégories */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
                                {COOKIE_CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    const active = prefs[cat.id];
                                    return (
                                        <div key={cat.id}
                                            className={`flex items-center gap-2 px-3 py-2 border text-[10px] font-bold uppercase tracking-[.08em] transition-colors ${
                                                active
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}>
                                            <Icon size={11} />
                                            <span className="truncate">{cat.name.split(' ')[1] || cat.name.split(' ')[0]}</span>
                                            {cat.required && <span className="ml-auto text-[8px] opacity-60">Requis</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <button onClick={acceptAll}
                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-widest transition-colors">
                                    Tout accepter
                                </button>
                                <button onClick={rejectAll}
                                    className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-300 hover:border-slate-900 text-slate-600 hover:text-slate-900 text-[11px] font-bold uppercase tracking-widest transition-all">
                                    Tout refuser
                                </button>
                                <button onClick={() => setPanel(true)}
                                    className="flex-1 sm:flex-none px-6 py-2.5 border border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-700 text-[11px] font-bold uppercase tracking-widest transition-all">
                                    Personnaliser
                                </button>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-4">
                                En continuant à naviguer sans faire de choix, seuls les cookies essentiels seront utilisés.
                                Consultez notre{' '}
                                <a href="/confidentialite" className="underline hover:text-slate-700 transition-colors">politique de confidentialité</a>.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ PANNEAU DÉTAILLÉ ══ */}
            {panel && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 shadow-2xl w-full max-w-[680px] max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <Shield size={16} className="text-white opacity-70" />
                                <span className="text-[11px] font-black uppercase tracking-[.2em] text-white">
                                    Gérer mes préférences
                                </span>
                            </div>
                            <button onClick={() => setPanel(false)}
                                className="text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Intro */}
                        <div className="px-6 py-4 border-b border-slate-100 flex-shrink-0">
                            <p className="text-[12px] text-slate-500 leading-relaxed">
                                Sélectionnez les types de cookies que vous souhaitez autoriser. Vous pouvez modifier ces préférences à tout moment.
                                Les cookies essentiels sont toujours actifs et ne peuvent pas être désactivés.
                            </p>
                        </div>

                        {/* Catégories — scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {COOKIE_CATEGORIES.map(cat => {
                                const Icon    = cat.icon;
                                const isOn    = prefs[cat.id];
                                const isOpen  = expanded[cat.id];
                                return (
                                    <div key={cat.id} className={`border transition-colors ${isOn ? 'border-slate-300' : 'border-slate-100'}`}>
                                        {/* Ligne principale */}
                                        <div className="flex items-start gap-4 p-4">
                                            {/* Icône */}
                                            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 ${isOn ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <Icon size={15} />
                                            </div>

                                            {/* Infos */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[12px] font-bold text-slate-900">{cat.name}</span>
                                                    {cat.required && (
                                                        <span className="text-[8px] font-black uppercase tracking-[.1em] px-1.5 py-0.5 bg-slate-100 text-slate-500">
                                                            Toujours actif
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-relaxed">{cat.description}</p>

                                                {/* Détails services */}
                                                {isOpen && (
                                                    <div className="mt-3 space-y-2">
                                                        {cat.services.map((svc, i) => (
                                                            <div key={i} className="flex gap-3 py-2 border-t border-slate-100 first:border-0">
                                                                <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5 flex-shrink-0" />
                                                                <div>
                                                                    <div className="text-[10px] font-bold text-slate-700">{svc.name}</div>
                                                                    <div className="text-[10px] text-slate-400 mt-0.5">{svc.purpose}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Bouton voir les services */}
                                                <button onClick={() => toggleExpand(cat.id)}
                                                    className="mt-2 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-[.08em]">
                                                    {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                                    {isOpen ? 'Masquer' : `Voir ${cat.services.length} service${cat.services.length > 1 ? 's' : ''}`}
                                                </button>
                                            </div>

                                            {/* Toggle */}
                                            <div className="flex-shrink-0 mt-0.5">
                                                {cat.required ? (
                                                    <div className="w-10 h-5 bg-slate-900 rounded-full flex items-center justify-end pr-0.5 cursor-not-allowed opacity-60">
                                                        <div className="w-4 h-4 bg-white rounded-full" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => togglePref(cat.id)}
                                                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isOn ? 'bg-slate-900' : 'bg-slate-200'}`}
                                                        role="switch"
                                                        aria-checked={isOn}
                                                        aria-label={`${isOn ? 'Désactiver' : 'Activer'} ${cat.name}`}>
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer actions */}
                        <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button onClick={saveCustom}
                                    className="flex-1 px-6 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-[11px] font-black uppercase tracking-widest transition-colors">
                                    Enregistrer mes choix
                                </button>
                                <button onClick={acceptAll}
                                    className="flex-1 px-6 py-2.5 border border-slate-300 hover:border-slate-900 text-slate-700 hover:text-slate-900 text-[11px] font-bold uppercase tracking-widest transition-all">
                                    Tout accepter
                                </button>
                                <button onClick={rejectAll}
                                    className="flex-1 px-6 py-2.5 border border-slate-200 text-slate-400 hover:text-slate-600 text-[11px] font-bold uppercase tracking-widest transition-all">
                                    Tout refuser
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-3 text-center">
                                Vos choix s'appliquent immédiatement et sont mémorisés pour vos prochaines visites.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ══════════════════════════════════════════════════════
   BOUTON FLOTTANT — rouvrir les préférences
   À placer dans le footer ou en bas de page
══════════════════════════════════════════════════════ */
export const CookieSettingsButton = ({ className = '' }) => {
    const reopen = () => {
        localStorage.removeItem(CONSENT_KEY);
        window.location.reload();
    };
    return (
        <button onClick={reopen}
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-slate-400 hover:text-slate-700 transition-colors ${className}`}>
            <Shield size={11} />
            Gérer les cookies
        </button>
    );
};

/* ══════════════════════════════════════════════════════
   HOOK — lire les préférences depuis n'importe où
══════════════════════════════════════════════════════ */
export const useCookieConsent = () => {
    const [prefs, setPrefs] = useState({
        necessary:  true,
        analytics:  false,
        functional: false,
        marketing:  false,
    });

    useEffect(() => {
        const stored = getStoredConsent();
        if (stored) setPrefs(stored.prefs);

        const handler = (e) => setPrefs(e.detail);
        window.addEventListener('briefly:consent', handler);
        return () => window.removeEventListener('briefly:consent', handler);
    }, []);

    return prefs;
};

export default CookieConsent;
