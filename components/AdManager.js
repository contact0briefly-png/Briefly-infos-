"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';


const AID = 'bbriefly-7e3b8';
const COL = `artifacts/${AID}/public/data`;

/* ═══════════════════════════════════════
   BANNIÈRE CARROUSEL (espace sous la nav)
═══════════════════════════════════════ */
export const AdBanner = () => {
    const [ads,     setAds]     = useState([]);
    const [current, setCurrent] = useState(0);
    const [paused,  setPaused]  = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const q = query(collection(db, `${COL}/ads_banner`), orderBy('order', 'asc'));
        const unsub = onSnapshot(q, snap => {
            const items = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(a => a.active !== false);
            setAds(items);
            setCurrent(0);
        });
        return () => unsub();
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
            className="w-full relative overflow-hidden bg-slate-50 border-b border-slate-200"
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
    if (ad.type === 'image' && ad.imageUrl) {
        return (
            <div className="relative w-full h-auto flex items-center justify-center">
                <img src={ad.imageUrl} alt={ad.title || 'Publicité'}
                    className="w-full h-full object-cover" />
                {ad.title && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="text-white font-bold text-[13px] drop-shadow">{ad.title}</span>
                    </div>
                )}
            </div>
        );
    }
    if (ad.type === 'text') {
        return (
            <div className="w-full h-full flex items-center justify-center px-8"
                style={{ backgroundColor: ad.bgColor || '#f8f9fa' }}>
                <div className="text-center">
                    {ad.title && (
                        <div className="font-bold text-[14px] mb-0.5"
                            style={{ color: ad.textColor || '#0f172a' }}>{ad.title}</div>
                    )}
                    {ad.subtitle && (
                        <div className="text-[11px]"
                            style={{ color: ad.textColor ? ad.textColor + 'aa' : '#64748b' }}>{ad.subtitle}</div>
                    )}
                    {ad.cta && (
                        <div className="inline-block mt-2 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                            style={{ backgroundColor: ad.ctaColor || '#0f172a' }}>{ad.cta}</div>
                    )}
                </div>
            </div>
        );
    }
    // Type mixte image + texte superposé
    return (
        <div className="relative w-full h-full">
            {ad.imageUrl && (
                <img src={ad.imageUrl} alt={ad.title || 'Publicité'} className="w-full h-auto object-contain block max-h-[220px]" />
            )}
            <div className="absolute inset-0 flex items-center"
                style={{ backgroundColor: ad.imageUrl ? 'rgba(0,0,0,0.35)' : (ad.bgColor || '#0f172a') }}>
                <div className="px-6">
                    {ad.title && (
                        <div className="font-black text-[15px] text-white leading-tight">{ad.title}</div>
                    )}
                    {ad.subtitle && (
                        <div className="text-[11px] text-white/80 mt-0.5">{ad.subtitle}</div>
                    )}
                    {ad.cta && (
                        <div className="inline-block mt-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-white text-slate-900">
                            {ad.cta}
                        </div>
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
        const q = query(collection(db, `${COL}/ads_popup`), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            const active = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .find(p => p.active !== false);
            if (!active) return;
            setPopup(active);

            // Vérifier si déjà vu (clé = id du popup pour reset si nouveau popup)
            const seen = localStorage.getItem(POPUP_KEY);
            if (seen === active.id) return;

            // Afficher après le délai configuré (défaut 3s)
            const delay = (active.delay ?? 3) * 1000;
            const t = setTimeout(() => setVisible(true), delay);
            return () => clearTimeout(t);
        });
        return () => unsub();
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