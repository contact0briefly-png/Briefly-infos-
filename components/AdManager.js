"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from "../lib/supabase";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';


// Les colonnes Supabase (snake_case) sont ramenées aux noms utilisés par les composants ci-dessous
const mapAd = (r) => ({
    id: r.id, type: r.type, title: r.title || '', subtitle: r.subtitle || '', cta: r.cta || '',
    ctaColor: r.cta_color, bgColor: r.bg_color, textColor: r.text_color,
    imageUrl: r.image_url, link: r.link, active: r.active, delay: r.delay_seconds,
});

/* ═══════════════════════════════════════
   BANNIÈRE CARROUSEL (espace sous la nav)
═══════════════════════════════════════ */
export const AdBanner = () => {
    const [ads,     setAds]     = useState([]);
    const [current, setCurrent] = useState(0);
    const [paused,  setPaused]  = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        let alive = true;
        supabase.from('ads_banner').select('*').eq('active', true).order('sort_order', { ascending: true })
            .then(({ data }) => { if (alive) { setAds((data || []).map(mapAd)); setCurrent(0); } });
        return () => { alive = false; };
    }, []);

    const next = useCallback(() => setCurrent(c => (c + 1) % ads.length), [ads.length]);
    const prev = useCallback(() => setCurrent(c => (c - 1 + ads.length) % ads.length), [ads.length]);

    useEffect(() => {
        if (ads.length <= 1 || paused) { clearInterval(timerRef.current); return; }
        timerRef.current = setInterval(next, 4000);
        return () => clearInterval(timerRef.current);
    }, [ads.length, paused, next]);

    if (!ads.length) return null;

    const ad = ads[current];

    return (
        <div
            className="w-full relative overflow-hidden bg-slate-50 border-b border-slate-200 h-[56px] sm:h-[72px] md:h-[90px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>

            {/* Slide */}
            {ad.link ? (
                <a href={ad.link} target="_blank" rel="noopener noreferrer sponsored"
                    className="block w-full h-full no-underline">
                    <BannerSlide ad={ad} />
                </a>
            ) : (
                <BannerSlide ad={ad} />
            )}

            {/* Label pub discret */}
            <span className="absolute top-1 right-2 text-[8px] font-bold uppercase tracking-[.12em] text-slate-400 bg-white/80 px-1.5 py-0.5 pointer-events-none">
                Publicité
            </span>

            {/* Contrôles carrousel (si plusieurs) */}
            {ads.length > 1 && (
                <>
                    <button onClick={e => { e.stopPropagation(); e.preventDefault(); prev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all z-10">
                        <ChevronLeft size={14} className="text-slate-600" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); e.preventDefault(); next(); }}
                        className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all z-10">
                        <ChevronRight size={14} className="text-slate-600" />
                    </button>

                    {/* Indicateurs */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {ads.map((_, i) => (
                            <button key={i} onClick={e => { e.stopPropagation(); e.preventDefault(); setCurrent(i); }}
                                className={`transition-all ${i === current ? 'w-4 h-1.5 bg-slate-700' : 'w-1.5 h-1.5 bg-slate-400 hover:bg-slate-600'} rounded-full`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const BannerSlide = ({ ad }) => {
    // Le conteneur a une hauteur fixe : l'image s'y adapte sans jamais être étirée ni agrandie
    if (ad.type === 'image' && ad.imageUrl) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <img src={ad.imageUrl} alt={ad.title || 'Publicité'}
                    className="h-full w-auto max-w-full object-contain" />
                {ad.title && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                        <span className="text-white font-bold text-[12px] md:text-[13px] drop-shadow">{ad.title}</span>
                    </div>
                )}
            </div>
        );
    }
    if (ad.type === 'text') {
        return (
            <div className="w-full h-full flex items-center justify-center px-8 overflow-hidden"
                style={{ backgroundColor: ad.bgColor || '#f8f9fa' }}>
                <div className="text-center">
                    {ad.title && (
                        <div className="font-bold text-[12px] md:text-[14px] leading-tight truncate"
                            style={{ color: ad.textColor || '#0f172a' }}>{ad.title}</div>
                    )}
                    {ad.subtitle && (
                        <div className="text-[10px] md:text-[11px] truncate hidden sm:block"
                            style={{ color: ad.textColor ? ad.textColor + 'aa' : '#64748b' }}>{ad.subtitle}</div>
                    )}
                    {ad.cta && (
                        <div className="inline-block mt-1 px-3 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white hidden sm:inline-block"
                            style={{ backgroundColor: ad.ctaColor || '#0f172a' }}>{ad.cta}</div>
                    )}
                </div>
            </div>
        );
    }
    // Type mixte image + texte superposé
    return (
        <div className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: ad.bgColor || '#0f172a' }}>
            {ad.imageUrl && (
                <img src={ad.imageUrl} alt={ad.title || 'Publicité'} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="relative h-full flex items-center"
                style={{ backgroundColor: ad.imageUrl ? 'rgba(0,0,0,0.35)' : 'transparent' }}>
                <div className="px-4 md:px-6 min-w-0">
                    {ad.title && (
                        <div className="font-black text-[12px] md:text-[15px] text-white leading-tight truncate">{ad.title}</div>
                    )}
                    {ad.subtitle && (
                        <div className="text-[10px] md:text-[11px] text-white/80 truncate hidden sm:block">{ad.subtitle}</div>
                    )}
                </div>
            </div>
        </div>
    );
};


/* ═══════════════════════════════════════
   POPUP PUBLICITAIRE
   — S'affiche une seule fois par navigateur
   — Délai configurable depuis l'admin
═══════════════════════════════════════ */
const POPUP_KEY = 'briefly_popup_seen';

export const AdPopup = () => {
    const [popup,   setPopup]   = useState(null);
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        let alive = true, timer;
        supabase.from('ads_popup').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1)
            .then(({ data }) => {
                const active = data && data[0] ? mapAd(data[0]) : null;
                if (!alive || !active) return;
                setPopup(active);
                // Déjà vu ? (clé = id du popup pour réafficher si un nouveau popup est créé)
                try { if (localStorage.getItem(POPUP_KEY) === active.id) return; } catch {}
                timer = setTimeout(() => setVisible(true), (active.delay ?? 3) * 1000);
            });
        return () => { alive = false; clearTimeout(timer); };
    }, []);

    const close = () => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            setClosing(false);
            if (popup) localStorage.setItem(POPUP_KEY, popup.id);
        }, 300);
    };

    if (!visible || !popup) return null;

    return (
        <div className={`fixed inset-0 z-[8000] flex items-center justify-center p-4 transition-all duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

            {/* Popup */}
            <div className={`relative z-10 bg-white w-full max-w-[420px] shadow-2xl transition-all duration-300 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>

                {/* Bouton fermer */}
                <button onClick={close}
                    className="absolute top-3 right-3 z-20 w-7 h-7 bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center shadow-sm transition-all">
                    <X size={13} className="text-slate-600" />
                </button>

                {/* Label pub */}
                <div className="absolute top-3 left-3 z-20 text-[8px] font-black uppercase tracking-[.15em] text-slate-400 bg-white/90 px-1.5 py-0.5">
                    Publicité
                </div>

                {/* Contenu du popup */}
                <PopupContent popup={popup} onClose={close} />
            </div>
        </div>
    );
};

const PopupContent = ({ popup, onClose }) => {
    if (popup.type === 'image' && popup.imageUrl) {
        return (
            <div>
                {popup.link ? (
                    <a href={popup.link} target="_blank" rel="noopener noreferrer sponsored" onClick={onClose}>
                        <img src={popup.imageUrl} alt={popup.title || 'Publicité'}
                            className="w-full object-cover" style={{ maxHeight: '340px' }} />
                    </a>
                ) : (
                    <img src={popup.imageUrl} alt={popup.title || 'Publicité'}
                        className="w-full object-cover" style={{ maxHeight: '340px' }} />
                )}
                {(popup.title || popup.subtitle || popup.cta) && (
                    <div className="p-5 text-center">
                        {popup.title    && <div className="font-serif font-bold text-[18px] text-slate-900 mb-1">{popup.title}</div>}
                        {popup.subtitle && <div className="text-[12px] text-slate-500 mb-4 leading-relaxed">{popup.subtitle}</div>}
                        {popup.cta && popup.link && (
                            <a href={popup.link} target="_blank" rel="noopener noreferrer sponsored" onClick={onClose}
                                className="inline-block px-8 py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors no-underline">
                                {popup.cta}
                            </a>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Popup texte / mixte
    return (
        <div style={{ backgroundColor: popup.bgColor || '#0f172a', minHeight: '200px' }}
            className="flex flex-col items-center justify-center text-center p-8">
            {popup.imageUrl && (
                <img src={popup.imageUrl} alt="" className="w-full mb-6 object-cover" style={{ maxHeight: '180px' }} />
            )}
            {popup.title && (
                <div className="font-serif font-bold text-[22px] leading-tight mb-3"
                    style={{ color: popup.textColor || '#ffffff' }}>{popup.title}</div>
            )}
            {popup.subtitle && (
                <div className="text-[13px] leading-relaxed mb-6"
                    style={{ color: popup.textColor ? popup.textColor + 'cc' : 'rgba(255,255,255,0.7)' }}>
                    {popup.subtitle}
                </div>
            )}
            {popup.cta && popup.link && (
                <a href={popup.link} target="_blank" rel="noopener noreferrer sponsored" onClick={onClose}
                    className="inline-block px-8 py-3 text-[11px] font-black uppercase tracking-widest no-underline transition-opacity hover:opacity-80"
                    style={{ backgroundColor: popup.ctaColor || '#ffffff', color: popup.bgColor || '#0f172a' }}>
                    {popup.cta}
                </a>
            )}
            {!popup.cta && (
                <button onClick={onClose}
                    className="mt-4 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white/80 transition-colors">
                    Fermer
                </button>
            )}
        </div>
    );
};


/* ═══════════════════════════════════════
   COMPOSANT GLOBAL — importer dans layout
   Affiche popup + bannière en un seul import
═══════════════════════════════════════ */
export const AdSystem = () => (
    <>
        <AdPopup />
    </>
);

export default AdSystem;