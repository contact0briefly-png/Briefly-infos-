"use client";
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/* ══════════════════════════════════════════════════════
   Charge les outils tiers UNIQUEMENT selon le consentement
   enregistré par CookieBanner (clé 'briefly_cookie_consent').
   Se met à jour tout de suite quand le visiteur accepte
   (événement 'briefly:consent'), sans recharger la page.
══════════════════════════════════════════════════════ */
const CONSENT_KEY = 'briefly_cookie_consent';

const readPrefs = () => {
    try {
        const raw = localStorage.getItem(CONSENT_KEY);
        return raw ? (JSON.parse(raw).prefs || null) : null;
    } catch { return null; }
};

const loadScript = (id, src, attrs = {}) => {
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = src;
    s.async = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
};

const loadWebpushr = () => {
    if (window.webpushr) return;
    window.webpushr = window.webpushr || function () {
        (window.webpushr.q = window.webpushr.q || []).push(arguments);
    };
    loadScript('webpushr-jssdk', 'https://cdn.webpushr.com/app.min.js');
    window.webpushr('setup', { key: process.env.NEXT_PUBLIC_WEBPUSHR_KEY || 'BOAI8WZjrONBOT3bQhrF6i9FfsXUnw0UmucEgSqzae8y2kAjugYPjWXnlwXV4CJ2gz82aHTMNegMuJsziHe9WMo' });
};

export default function ConsentScripts() {
    const [prefs, setPrefs] = useState(null);

    useEffect(() => {
        setPrefs(readPrefs());
        const onConsent = (e) => setPrefs(e.detail);
        window.addEventListener('briefly:consent', onConsent);
        return () => window.removeEventListener('briefly:consent', onConsent);
    }, []);

    useEffect(() => {
        if (!prefs) return;
        if (prefs.marketing) {
            // Publicités Google AdSense + embeds Twitter/X
            loadScript('adsense-js',
                `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${(process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-7972578599056246')}`,
                { crossorigin: 'anonymous' });
            loadScript('twitter-widgets', 'https://platform.twitter.com/widgets.js');
        }
        if (prefs.functional) loadWebpushr();
    }, [prefs]);

    if (!prefs?.analytics) return null;
    return (
        <>
            <Analytics />
            <SpeedInsights />
        </>
    );
}
