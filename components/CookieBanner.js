"use client";
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Shield, BarChart2, Target, Settings } from 'lucide-react';

/* ══════════════════════════════════════════════════════
   CONFIGURATION DES CATÉGORIES
══════════════════════════════════════════════════════ */
const COOKIE_CATEGORIES = [
    {
        id: 'necessary',
        icon: Shield,
        name: 'Cookies essentiels',
        description: 'Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.',
        required: true,
        services: [
            { name: 'Session utilisateur',  purpose: 'Maintien de votre connexion et préférences de navigation' },
            { name: 'Sécurité CSRF',        purpose: 'Protection contre les attaques de falsification de requêtes' },
            { name: 'Consentement cookies', purpose: 'Mémorisation de vos choix de confidentialité' },
        ],
    },
    {
        id: 'analytics',
        icon: BarChart2,
        name: 'Cookies analytiques',
        description: 'Nous aident à comprendre comment les visiteurs utilisent le site pour l\'améliorer.',
        required: false,
        services: [
            { name: 'Vercel Analytics', purpose: 'Comptage des visites et performances du site (anonymisé)' },
            { name: 'Compteur de vues',   purpose: 'Suivi du nombre de lectures par article' },
        ],
    },
    {
        id: 'functional',
        icon: Settings,
        name: 'Cookies fonctionnels',
        description: 'Permettent des fonctionnalités améliorées comme les notifications et vos préférences.',
        required: false,
        services: [
            { name: 'Notifications push (WebPushr)', purpose: 'Envoi d\'alertes lors de nouvelles publications sur le site' },
            { name: 'Notifications push (WebPushr 2)', purpose: 'Canal de notification secondaire pour une meilleure portée' },
            { name: 'Préférences d\'affichage',       purpose: 'Mémorisation de votre catégorie favorite' },
            { name: 'Telegram WebApp',                purpose: 'Intégration avec l\'application Telegram' },
        ],
    },
    {
        id: 'marketing',
        icon: Target,
        name: 'Publicités & contenus tiers',
        description: 'Permettent l\'affichage des publicités ainsi que des vidéos et publications provenant de plateformes externes.',
        required: false,
        services: [
            { name: 'Google AdSense', purpose: 'Affichage de publicités (peut utiliser des cookies publicitaires)' },
            { name: 'YouTube',    purpose: 'Lecture de vidéos intégrées dans les articles' },
            { name: 'TikTok',    purpose: 'Affichage de vidéos TikTok intégrées dans les articles' },
            { name: 'Instagram', purpose: 'Affichage de publications Instagram dans les articles' },
            { name: 'Twitter/X', purpose: 'Affichage de tweets intégrés dans les articles' },
        ],
    },
];

const CONSENT_KEY = 'briefly_cookie_consent';
const CONSENT_VER = '1.2';

/* ── Lire le consentement stocké ── */
const getStoredConsent = () => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.version !== CONSENT_VER) return null;
        return parsed;
    } catch { return null; }
};

/* ── Sauvegarder et appliquer ── */
const saveConsent = (prefs) => {
    if (typeof window === 'undefined') return;
    const data = { version: CONSENT_VER, date: new Date().toISOString(), prefs };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('briefly:consent', { detail: prefs }));
    applyConsent(prefs);
};

/* ══════════════════════════════════════════════════════
   APPLICATION DU CONSENTEMENT
   IMPORTANT : on ne bloque JAMAIS ce qui est déjà chargé
   On agit seulement sur ce qui peut l'être
══════════════════════════════════════════════════════ */
const applyConsent = (prefs) => {

    /* ── Analytics ──
       On désactive seulement si explicitement refusé.
       Les mesures sont rendues par ConsentScripts (Vercel).              */
    if (typeof window !== 'undefined') {
        window['ga-disable'] = !prefs.analytics;
    }

    /* ── Fonctionnel : WebPushr ──
       WebPushr est chargé dans _document.jsx ou layout.jsx côté serveur.
       Le cookie consent ne le bloque PAS — il est nécessaire pour les
       notifications et se charge de manière indépendante.
       On stocke simplement la préférence pour référence.                 */
    if (typeof window !== 'undefined') {
        window.__briefly_push_allowed = prefs.functional;
    }

    /* ── Marketing : embeds tiers ──
       On agit UNIQUEMENT sur les éléments déjà présents dans le DOM.
       Les futurs embeds sont gérés par le hook useCookieConsent.         */
    if (typeof document !== 'undefined') {
        if (!prefs.marketing) {
            // Bloquer les embeds tiers déjà chargés
            document.querySelectorAll(
                'iframe[src*="youtube"], iframe[src*="youtube-nocookie"], iframe[src*="tiktok"], iframe[src*="instagram"], iframe[src*="twitter"], blockquote.tiktok-embed, blockquote.twitter-tweet, blockquote.instagram-media'
            ).forEach(el => {
                if (el.tagName === 'IFRAME') {
                    if (!el.dataset.consentBlocked) {
                        el.dataset.consentBlocked = el.src;
                        el.src = 'about:blank';
                    }
                } else {
                    el.style.display = 'none';
                    el.dataset.consentBlocked = 'true';
                }
            });
        } else {
            // Restaurer les embeds bloqués
            document.querySelectorAll('[data-consent-blocked]').forEach(el => {
                if (el.tagName === 'IFRAME' && el.dataset.consentBlocked !== 'true') {
                    el.src = el.dataset.consentBlocked;
                }
                el.style.display = '';
                delete el.dataset.consentBlocked;
            });
        }
    }
};

/* ══════════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════════════════════════════ */
const CookieConsent = () => {
    const [visible,  setVisible]  = useState(false);
    const [panel,    setPanel]    = useState(false);
    const [expanded, setExpanded] = useState({});
    const [prefs,    setPrefs]    = useState({
        necessary:  true,
        analytics:  false,
        functional: false,
        marketing:  false,
    });

    useEffect(() => {
        const stored = getStoredConsent();
        if (!stored) {
            // Pas de consentement stocké → afficher la bannière
            // On n'applique RIEN par défaut (pas de blocage)
            const t = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(t);
        }
        // Consentement existant → appliquer silencieusement
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
            {/* Overlay panneau détaillé */}
            {panel && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                    onClick={() => setPanel(false)}
                />
            )}

            {/* ══ BANNIÈRE PRINCIPALE ══ */}
            {!panel && (
                <div className="fixed bottom-0 left-0 right-0 z-[9999] p-3 md:p-5">
                    <div className="max-w-[860px] mx-auto bg-white border border-slate-200 shadow-2xl">

                        {/* Barre titre */}
                        <div className="bg-slate-900 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-white/60" />
                                <span className="text-[10px] font-black uppercase tracking-[.2em] text-white">
                                    Confidentialité & Cookies
                                </span>
                            </div>
                            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest hidden md:block">
                                Briefly Digital Media
                            </span>
                        </div>

                        <div className="px-5 py-4">
                            <p className="text-[12px] text-slate-600 leading-relaxed mb-4">
                                Briefly utilise des cookies pour améliorer votre expérience et vous envoyer des notifications lors de nouvelles publications.
                                Choisissez librement ce que vous souhaitez autoriser — les cookies essentiels sont toujours actifs.
                            </p>

                            {/* Aperçu catégories */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-4">
                                {COOKIE_CATEGORIES.map(cat => {
                                    const Icon   = cat.icon;
                                    const active = prefs[cat.id];
                                    return (
                                        <div key={cat.id}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-[9px] font-bold uppercase tracking-[.08em] transition-colors ${
                                                active
                                                    ? 'border-slate-800 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-slate-50 text-slate-500'
                                            }`}>
                                            <Icon size={10} />
                                            <span className="truncate">
                                                {cat.id === 'necessary'  ? 'Essentiels'     : ''}
                                                {cat.id === 'analytics'  ? 'Analytiques'    : ''}
                                                {cat.id === 'functional' ? 'Notifications'  : ''}
                                                {cat.id === 'marketing'  ? 'Contenus tiers' : ''}
                                            </span>
                                            {cat.required && <span className="ml-auto opacity-50">✓</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Boutons */}
                            <div className="flex flex-col sm:flex-row items-stretch gap-2">
                                <button onClick={acceptAll}
                                    className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                                    Tout accepter
                                </button>
                                <button onClick={rejectAll}
                                    className="flex-1 sm:flex-none sm:px-6 py-2.5 border border-slate-300 hover:border-slate-700 text-slate-600 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    Refuser les optionnels
                                </button>
                                <button onClick={() => setPanel(true)}
                                    className="flex-1 sm:flex-none sm:px-6 py-2.5 border border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-400 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    Personnaliser →
                                </button>
                            </div>

                            <p className="text-[9px] text-slate-400 mt-3">
                                Sans action de votre part, seuls les cookies essentiels seront utilisés. —{' '}
                                <a href="/confidentialite" className="underline hover:text-slate-600 transition-colors">
                                    Politique de confidentialité
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ PANNEAU DÉTAILLÉ ══ */}
            {panel && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white border border-slate-200 shadow-2xl w-full max-w-[640px] max-h-[88vh] flex flex-col">

                        {/* Header */}
                        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-white/60" />
                                <span className="text-[10px] font-black uppercase tracking-[.2em] text-white">
                                    Gérer mes préférences
                                </span>
                            </div>
                            <button onClick={() => setPanel(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1">
                                <X size={17} />
                            </button>
                        </div>

                        {/* Intro */}
                        <div className="px-5 py-3 border-b border-slate-100 flex-shrink-0 bg-slate-50">
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Activez ou désactivez chaque catégorie selon vos préférences.
                                Vos choix sont enregistrés immédiatement et s'appliquent à votre prochaine visite.
                            </p>
                        </div>

                        {/* Catégories */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                            {COOKIE_CATEGORIES.map(cat => {
                                const Icon   = cat.icon;
                                const isOn   = prefs[cat.id];
                                const isOpen = expanded[cat.id];

                                return (
                                    <div key={cat.id} className="px-5 py-4">
                                        <div className="flex items-start gap-3">

                                            {/* Icône catégorie */}
                                            <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                                isOn ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                <Icon size={14} />
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-[12px] font-bold text-slate-900">{cat.name}</span>
                                                    {cat.required && (
                                                        <span className="text-[8px] font-black uppercase tracking-[.1em] px-1.5 py-0.5 bg-slate-100 text-slate-500">
                                                            Toujours actif
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-relaxed mb-2">{cat.description}</p>

                                                {/* Services détaillés */}
                                                {isOpen && (
                                                    <div className="mb-2 space-y-0 bg-slate-50 border border-slate-100 p-3">
                                                        {cat.services.map((svc, i) => (
                                                            <div key={i} className={`flex gap-2.5 py-2 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                                                                <div className="w-1 h-1 bg-slate-400 rounded-full mt-1.5 flex-shrink-0" />
                                                                <div>
                                                                    <div className="text-[10px] font-bold text-slate-700">{svc.name}</div>
                                                                    <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{svc.purpose}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => toggleExpand(cat.id)}
                                                    className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-[.08em]">
                                                    {isOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                                    {isOpen
                                                        ? 'Masquer les détails'
                                                        : `Voir ${cat.services.length} service${cat.services.length > 1 ? 's' : ''}`}
                                                </button>
                                            </div>

                                            {/* Toggle switch */}
                                            <div className="flex-shrink-0 mt-0.5">
                                                {cat.required ? (
                                                    <div className="w-10 h-5 bg-slate-800 rounded-full relative opacity-50 cursor-not-allowed">
                                                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => togglePref(cat.id)}
                                                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 ${
                                                            isOn ? 'bg-slate-900' : 'bg-slate-200'
                                                        }`}
                                                        role="switch"
                                                        aria-checked={isOn}
                                                        aria-label={`${isOn ? 'Désactiver' : 'Activer'} ${cat.name}`}>
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                                                            isOn ? 'translate-x-5' : 'translate-x-0.5'
                                                        }`} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0 bg-slate-50">
                            <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                <button onClick={saveCustom}
                                    className="flex-1 px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                                    Enregistrer mes choix
                                </button>
                                <button onClick={acceptAll}
                                    className="flex-1 px-5 py-2.5 border border-slate-300 hover:border-slate-900 text-slate-700 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    Tout accepter
                                </button>
                                <button onClick={rejectAll}
                                    className="flex-1 px-5 py-2.5 border border-slate-200 text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest transition-all">
                                    Tout refuser
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-400 text-center">
                                Vos préférences s'appliquent immédiatement et sont mémorisées pour vos prochaines visites.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

/* ══════════════════════════════════════════════════════
   BOUTON RÉOUVRIR LES PRÉFÉRENCES (pour le footer)
══════════════════════════════════════════════════════ */
export const CookieSettingsButton = ({ className = '' }) => {
    const reopen = () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(CONSENT_KEY);
        window.location.reload();
    };
    return (
        <button
            onClick={reopen}
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-slate-400 hover:text-slate-700 transition-colors ${className}`}>
            <Shield size={11} />
            Gérer les cookies
        </button>
    );
};

/* ══════════════════════════════════════════════════════
   HOOK — lire les préférences depuis n'importe quel composant
   Usage : const { analytics, functional, marketing } = useCookieConsent()
══════════════════════════════════════════════════════ */
export const useCookieConsent = () => {
    const [prefs, setPrefs] = useState({
        necessary:  true,
        analytics:  true,   // Par défaut permissif pour ne pas bloquer les fonctionnalités
        functional: true,   // Notifications activées par défaut jusqu'au choix explicite
        marketing:  true,   // Embeds actifs par défaut
    });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const stored = getStoredConsent();
        if (stored) {
            setPrefs(stored.prefs);
        }
        setLoaded(true);

        const handler = (e) => setPrefs(e.detail);
        window.addEventListener('briefly:consent', handler);
        return () => window.removeEventListener('briefly:consent', handler);
    }, []);

    return { ...prefs, loaded };
};

export default CookieConsent;
