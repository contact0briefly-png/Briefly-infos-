"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Clock, ChevronRight, Mail, Rss } from 'lucide-react';
import { AdBanner, AdPopup } from '@/components/AdManager';

const RSS_URL = "https://rss.app/feeds/TENwT5ha8Msc6ON4.xml";
const BREVO_ACTION = "https://b33f5b02.sibforms.com/serve/MUIFAGBxCfyEwfx-cB0M9i9gOYvlwv3b9XmULA8_jGaWHLuG5zbH6c2QvO928ogIkVBjF1c1mj7KCG06Zfye3McOWoe9G04JeD_TsTFM9EDSz7QYpppQ-u5X9E5udLQ7RLKl0QOuqiTCBG1jawLH4u1WYJNwxQ1OrCbFri0xOGjcxz6ye7PhaJEy9ibaiQ4LS_foT82lqz32UOJdBw==";

/* ── Avatar auteur miniature ── */
const AuthorAvatar = ({ item, size = 20 }) => {
    if (item.authorPhotoUrl) {
        return (
            <img src={item.authorPhotoUrl} alt={item.authorName || 'Briefly'}
                style={{ width: size, height: size }}
                className="rounded-full object-cover flex-shrink-0 border border-slate-200" />
        );
    }
    return (
        <div style={{ width: size, height: size, fontSize: size * 0.45 }}
            className="rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">
            {item.authorName ? item.authorName[0].toUpperCase() : 'B'}
        </div>
    );
};

/* ── Newsletter ── */
const NewsletterMini = () => {
    const [email,   setEmail]   = useState('');
    const [status,  setStatus]  = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) { setStatus('error'); return; }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('EMAIL', email); fd.append('email_address_check', ''); fd.append('locale', 'fr');
            await fetch(BREVO_ACTION, { method: 'POST', body: fd, mode: 'no-cors' });
            setStatus('success'); setEmail('');
        } catch { setStatus('error'); } finally { setLoading(false); }
    };
    return (
        <div id="newsletter" className="border-t border-b border-slate-200 py-6 my-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-3 flex-shrink-0">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                        <div className="text-[11px] font-black uppercase tracking-[.15em] text-slate-900">Newsletter Briefly</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">L'essentiel de l'info chaque jour</div>
                    </div>
                </div>
                {status === 'success' ? (
                    <div className="text-[12px] font-bold text-green-600">✓ Inscription confirmée !</div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-0 flex-1 max-w-md">
                        <input type="email" value={email} required
                            onChange={e => { setEmail(e.target.value); setStatus(null); }}
                            placeholder="Votre adresse email"
                            className="flex-1 border border-slate-300 border-r-0 px-3 py-2 text-[13px] focus:outline-none focus:border-slate-900 transition-colors" />
                        <button type="submit" disabled={loading}
                            className="bg-slate-900 text-white px-5 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors disabled:opacity-50 whitespace-nowrap">
                            {loading ? '…' : "S'inscrire"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════
   HOME
══════════════════════════════════════ */
const Home = ({ news = [], B24_BLUE }) => {
    const searchParams   = useSearchParams();
    const router         = useRouter();
    const searchTerm     = searchParams.get('search')   || "";
    const activeCategory = searchParams.get('category') || "Tous";
    const [tickerIndex, setTickerIndex] = useState(0);

    const handleHaptic = () => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp)
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    };

    const tickerNews = useMemo(() => news.slice(0, 8), [news]);
    useEffect(() => {
        const iv = setInterval(() => setTickerIndex(p => (p + 1) % (tickerNews.length || 1)), 4000);
        return () => clearInterval(iv);
    }, [tickerNews.length]);

    const filteredNews = useMemo(() => news.filter(n => {
        const ms = !searchTerm || n.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const mc = activeCategory === "Tous" || n.category === activeCategory;
        return ms && mc;
    }), [news, searchTerm, activeCategory]);

    const handleCategoryClick = (cat) => {
        handleHaptic();
        const params = new URLSearchParams(searchParams);
        if (cat === "Tous") params.delete('category'); else params.set('category', cat);
        router.push(`?${params.toString()}`);
    };

    const formatDate = (item) => {
        const ts = item.timestamp?.seconds || item.lastUpdate?.seconds || item.date?.seconds;
        if (ts) return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        return item.date || "Récemment";
    };
    const formatDateShort = (item) => {
        const ts = item.timestamp?.seconds || item.lastUpdate?.seconds || item.date?.seconds;
        if (ts) return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        return item.date || "Récemment";
    };

    const une            = useMemo(() => filteredNews[0] || null, [filteredNews]);
    const uneSecondaires = useMemo(() => filteredNews.slice(1, 4), [filteredNews]);
    const enBref         = useMemo(() => filteredNews.slice(4, 9), [filteredNews]);

    const RUBRIQUES = ["Togo","International","Politique","Économie","Sport","Lifestyle","Décryptage","Education"];
    const rubriquesSections = useMemo(() => RUBRIQUES.map(cat => ({
        name: cat,
        articles: news.filter(n => n.category?.toLowerCase() === cat.toLowerCase()).slice(0, 4)
    })).filter(s => s.articles.length >= 2), [news]);

    const dynamicCategories = useMemo(() => ["Tous", ...new Set(news.map(n => n.category).filter(Boolean))], [news]);

    /* ── Vue recherche / filtre ── */
    if (searchTerm || activeCategory !== "Tous") {
        return (
            <div className="bg-white min-h-screen">
                <div className="h-14 md:h-[113px]" />
                {/* Bannière pub même en vue filtre */}
                <AdBanner />
                <div className="max-w-[1280px] mx-auto px-4 py-8">
                    <div className="border-b-2 border-slate-900 pb-2 mb-8 flex items-center justify-between">
                        <h2 className="text-[11px] font-black uppercase tracking-[.2em] text-slate-900">
                            {activeCategory !== "Tous" ? activeCategory : `« ${searchTerm} »`}
                            <span className="ml-3 font-normal text-slate-400">{filteredNews.length} résultat{filteredNews.length > 1 ? 's' : ''}</span>
                        </h2>
                        <button onClick={() => router.push('/')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">← Retour</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map(item => <ArticleCard key={item.id} item={item} formatDate={formatDateShort} handleHaptic={handleHaptic} B24_BLUE={B24_BLUE} />)}
                    </div>
                    {!filteredNews.length && (
                        <div className="text-center py-20 text-slate-400">
                            <div className="text-4xl mb-4">∅</div>
                            <p className="text-[13px]">Aucun article trouvé.</p>
                        </div>
                    )}
                </div>
                {/* Popup pub */}
                <AdPopup />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900">

            {/* ══ BANNIÈRE PUBLICITAIRE ══
                Exactement dans l'espace disponible entre la navbar et le ticker
                Gérée depuis l'interface administrateur                          */}
            <AdBanner />

            {/* ══ TICKER ══ */}
            {tickerNews.length > 0 && (
                <div className="bg-slate-900 text-white overflow-hidden">
                    <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-4 h-9">
                        <span className="text-[9px] font-black uppercase tracking-[.2em] text-slate-400 flex-shrink-0 border-r border-slate-700 pr-4">En direct</span>
                        <AnimatePresence mode="wait">
                            <motion.a key={tickerIndex} href={`/article/${tickerNews[tickerIndex]?.id}`}
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.35 }}
                                className="text-[11px] font-medium text-white/90 hover:text-white truncate transition-colors"
                                onClick={handleHaptic}>
                                {tickerNews[tickerIndex]?.title}
                            </motion.a>
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* ══ BARRE CATÉGORIES ══ */}
            <div className="border-b border-slate-200 sticky top-14 md:top-[57px] bg-white z-40">
                <div className="max-w-[1280px] mx-auto px-4">
                    <div className="flex items-center overflow-x-auto no-scrollbar">
                        {dynamicCategories.slice(0, 10).map(cat => (
                            <button key={cat} onClick={() => handleCategoryClick(cat)}
                                className={`flex-shrink-0 px-4 py-3 text-[11px] font-bold uppercase tracking-[.1em] border-b-2 transition-all whitespace-nowrap ${
                                    activeCategory === cat ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-[1280px] mx-auto px-4">

                {/* ══ GRANDE UNE ══ */}
                {une && (
                    <section className="py-8 border-b border-slate-200">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                            {/* Article principal */}
                            <div className="lg:col-span-7 lg:pr-8 lg:border-r lg:border-slate-200">
                                <a href={`/article/${une.id}`} onClick={handleHaptic} className="group block no-underline">
                                    <div className="relative aspect-[16/10] overflow-hidden mb-4">
                                        <img src={une.imageUrl} alt={une.title}
                                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                                        <span className="absolute top-0 left-0 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[.15em] px-2.5 py-1.5">À la une</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[.12em]" style={{ color: B24_BLUE }}>{une.category}</span>
                                    <h1 className="font-serif font-bold text-[26px] md:text-[32px] leading-[1.15] text-slate-950 group-hover:text-slate-700 transition-colors mt-1 mb-3">{une.title}</h1>
                                    <div className="flex items-center gap-2">
                                        <AuthorAvatar item={une} size={22} />
                                        <a href={`/auteur/${une.authorId || ''}`} className="text-[11px] font-bold text-slate-600 hover:text-slate-900 no-underline">{une.authorName || "Briefly"}</a>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock size={10} />{formatDate(une)}</span>
                                    </div>
                                </a>
                            </div>

                            {/* Articles secondaires */}
                            <div className="lg:col-span-5 lg:pl-8 mt-6 lg:mt-0 flex flex-col">
                                {uneSecondaires.map((item, i) => (
                                    <a key={item.id} href={`/article/${item.id}`} onClick={handleHaptic}
                                        className={`group flex gap-4 py-5 no-underline ${i < uneSecondaires.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[9px] font-black uppercase tracking-[.12em] block mb-1.5" style={{ color: B24_BLUE }}>{item.category}</span>
                                            <h3 className="font-serif font-bold text-[15px] leading-[1.35] text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-3 mb-2">{item.title}</h3>
                                            <div className="flex items-center gap-1.5">
                                                <AuthorAvatar item={item} size={16} />
                                                <a href={`/auteur/${item.authorId || ''}`} className="text-[10px] text-slate-500 hover:text-slate-800 no-underline">{item.authorName || "Briefly"}</a>
                                                <span className="text-slate-300 text-[10px]">·</span>
                                                <span className="text-[10px] text-slate-400">{formatDateShort(item)}</span>
                                            </div>
                                        </div>
                                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <NewsletterMini />

                {/* ══ EN BREF ══ */}
                {enBref.length > 0 && (
                    <section className="mb-10">
                        <div className="border-b-2 border-slate-900 pb-2 mb-5"><h2 className="text-[11px] font-black uppercase tracking-[.2em] text-slate-900">En bref</h2></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0">
                            {enBref.map((item, i) => (
                                <a key={item.id} href={`/article/${item.id}`} onClick={handleHaptic}
                                    className={`group py-2 no-underline ${i > 0 ? 'pl-4' : ''} ${i < enBref.length - 1 ? 'pr-4 border-r border-slate-100' : ''}`}>
                                    <span className="text-[9px] font-black uppercase tracking-[.1em] block mb-1" style={{ color: B24_BLUE }}>{item.category}</span>
                                    <h4 className="font-serif font-bold text-[13px] leading-[1.35] text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-3 mb-1">{item.title}</h4>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <AuthorAvatar item={item} size={14} />
                                        <span className="text-[9px] text-slate-400">{item.authorName || "Briefly"}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* ══ RUBRIQUES ══ */}
                {rubriquesSections.map(section => (
                    <section key={section.name} className="mb-12 pb-12 border-b border-slate-200 last:border-0">
                        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-900 pb-2">
                            <h2 className="text-[13px] font-black uppercase tracking-[.18em] text-slate-900">{section.name}</h2>
                            <button onClick={() => handleCategoryClick(section.name)}
                                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
                                Tout voir <ChevronRight size={11} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                            <div className="md:col-span-5 md:pr-6 md:border-r md:border-slate-200">
                                {section.articles[0] && (
                                    <a href={`/article/${section.articles[0].id}`} onClick={handleHaptic} className="group block no-underline">
                                        <div className="aspect-[4/3] overflow-hidden mb-3">
                                            <img src={section.articles[0].imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                        </div>
                                        <h3 className="font-serif font-bold text-[18px] leading-[1.3] text-slate-900 group-hover:text-slate-600 transition-colors mb-2">{section.articles[0].title}</h3>
                                        <div className="flex items-center gap-2">
                                            <AuthorAvatar item={section.articles[0]} size={18} />
                                            <a href={`/auteur/${section.articles[0].authorId || ''}`} className="text-[10px] text-slate-500 hover:text-slate-800 no-underline">{section.articles[0].authorName || "Briefly"}</a>
                                            <span className="text-slate-200 text-[10px]">·</span>
                                            <span className="text-[10px] text-slate-400">{formatDateShort(section.articles[0])}</span>
                                        </div>
                                    </a>
                                )}
                            </div>
                            <div className="md:col-span-7 md:pl-6 mt-6 md:mt-0 flex flex-col">
                                {section.articles.slice(1, 4).map((item, i) => (
                                    <a key={item.id} href={`/article/${item.id}`} onClick={handleHaptic}
                                        className={`group flex gap-4 py-4 no-underline ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-serif font-bold text-[14px] leading-[1.35] text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-2 mb-1.5">{item.title}</h4>
                                            <div className="flex items-center gap-1.5">
                                                <AuthorAvatar item={item} size={14} />
                                                <a href={`/auteur/${item.authorId || ''}`} className="text-[10px] text-slate-400 hover:text-slate-700 no-underline">{item.authorName || "Briefly"}</a>
                                                <span className="text-slate-200 text-[10px]">·</span>
                                                <span className="text-[10px] text-slate-400">{formatDateShort(item)}</span>
                                            </div>
                                        </div>
                                        <div className="w-[72px] h-[60px] flex-shrink-0 overflow-hidden">
                                            <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                {/* ══ STATS ══ */}
                <section className="mb-16 py-10 bg-slate-50 border border-slate-200 -mx-4 px-4 md:mx-0 md:px-12">
                    <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
                        <div>
                            <div className="font-serif font-bold text-[36px] text-slate-900 leading-none mb-1">{news.length}</div>
                            <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">Articles</div>
                        </div>
                        <div className="border-x border-slate-200">
                            <div className="font-serif font-bold text-[36px] text-slate-900 leading-none mb-1">
                                {(() => { const v = news.reduce((a, c) => a + (c.views || 0), 0); return v >= 1000 ? `${(v/1000).toFixed(0)}k` : v; })()}
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">Vues</div>
                        </div>
                        <div>
                            <div className="font-serif font-bold text-[36px] text-slate-900 leading-none mb-1">{new Date().getFullYear() - 2023}</div>
                            <div className="text-[9px] font-black uppercase tracking-[.15em] text-slate-400">Ans</div>
                        </div>
                    </div>
                    <p className="text-center text-[11px] text-slate-500 mt-6">Briefly Digital Media — L'essentiel de l'information, décrypté pour vous depuis Lomé.</p>
                    <div className="flex items-center justify-center mt-4">
                        <a href={RSS_URL} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors no-underline">
                            <Rss size={12} /> Flux RSS
                        </a>
                    </div>
                </section>
            </main>

            {/* ══ POPUP PUBLICITAIRE ══
                S'affiche une seule fois par visiteur
                Mémorisé dans localStorage                */}
            <AdPopup />
        </div>
    );
};

/* ── Carte article (vue filtre/recherche) ── */
const ArticleCard = ({ item, formatDate, handleHaptic, B24_BLUE }) => (
    <article className="group">
        <a href={`/article/${item.id}`} onClick={handleHaptic} className="block no-underline">
            <div className="aspect-[16/10] overflow-hidden mb-3">
                <img src={item.imageUrl} alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[.12em] block mb-1.5" style={{ color: B24_BLUE }}>{item.category}</span>
            <h3 className="font-serif font-bold text-[16px] leading-[1.35] text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-2 mb-2">{item.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <AuthorAvatar item={item} size={18} />
                <a href={`/auteur/${item.authorId || ''}`} className="font-medium text-slate-600 hover:text-slate-900 no-underline">{item.authorName || "Briefly"}</a>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={9} />{formatDate(item)}</span>
            </div>
        </a>
    </article>
);

export default Home;
