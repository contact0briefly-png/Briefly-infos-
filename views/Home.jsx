"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import AdBannerSquare from '@/components/AdBannerSquare'; 
import { ArrowRight, TrendingUp, Clock, FileText, Eye, ChevronRight, Rss } from 'lucide-react';

const RSS_URL = "https://rss.app/feeds/TENwT5ha8Msc6ON4.xml";

const Home = ({ news = [], B24_BLUE }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchTerm = searchParams.get('search') || "";
    const activeCategory = searchParams.get('category') || "Tous";

    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const loaderRef = useRef(null);

    const stats = useMemo(() => {
        const totalArticles = news.length;
        const totalViews = news.reduce((acc, curr) => acc + (curr.views || 0), 0);
        return { totalArticles, totalViews };
    }, [news]);

    const dynamicCategories = useMemo(() => {
        const cats = news
            .map(item => item.category)
            .filter(cat => cat && cat.trim() !== ""); 
        return ["Tous", ...new Set(cats)]; 
    }, [news]);

    const handleHaptic = () => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };

    const filteredNews = useMemo(() => {
        return news.filter(n => {
            const matchesSearch = !searchTerm || 
                n.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "Tous" || 
                n.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [news, searchTerm, activeCategory]);

    const latestNews = useMemo(() => filteredNews.slice(0, 5), [filteredNews]);

    const categorySections = useMemo(() => {
        const targetCats = ["Togo", "International", "Lifestyle", "Décryptage", "Sport"];
        return targetCats.map(cat => ({
            name: cat,
            articles: news.filter(n => n.category?.toLowerCase() === cat.toLowerCase()).slice(0, 5)
        })).filter(section => section.articles.length > 0);
    }, [news]);

    const heroNews = useMemo(() => latestNews, [latestNews]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % (heroNews.length || 1));
    }, [heroNews.length]);

    useEffect(() => {
        if (!searchTerm && heroNews.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [searchTerm, heroNews.length, nextSlide]);

    const handleCategoryClick = (cat) => {
        handleHaptic();
        const params = new URLSearchParams(searchParams);
        if (cat === "Tous") params.delete('category');
        else params.set('category', cat);
        router.push(`?${params.toString()}`);
    };

    const formatDate = (item) => {
        const ts = item.timestamp?.seconds || item.lastUpdate?.seconds || item.date?.seconds;
        if (ts) {
            const date = new Date(ts * 1000);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        }
        if (typeof item.date === 'string' && item.date !== "") return item.date;
        return "Récemment";
    };

    const ArticleCard = ({ item }) => (
        <article className="flex flex-col group bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <a href={`/article/${item.id}`} onClick={handleHaptic}>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                    <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.imageUrl} loading="lazy" />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-[8px] font-black uppercase tracking-widest">
                        {item.category}
                    </span>
                </div>
                <div className="p-5">
                    <h3 className="font-serif font-black text-lg leading-tight mb-4 italic tracking-tight text-slate-950 line-clamp-2">
                        {item.title}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className="text-[9px] font-black uppercase text-slate-400">{item.authorName || "Briefly"}</span>
                        <span className="text-[9px] text-slate-300 font-bold flex items-center gap-1">
                            <Clock size={10} /> {formatDate(item)}
                        </span>
                    </div>
                </div>
            </a>
        </article>
    );

    return (
        <div className="w-full bg-[#f6f6f8] min-h-screen font-sans text-slate-900 flex flex-col">
            <div className="h-14 md:h-20 shrink-0"></div>

            {/* ===== BANDEAU RSS (sous la navbar) ===== */}
            <div className="w-full bg-slate-900 border-b border-white/10">
                <div className="container mx-auto max-w-[1200px] px-4 py-2 flex items-center justify-end">
                    <a
                        href={RSS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#f97316] transition-colors duration-200 group"
                        title="S'abonner au flux RSS"
                    >
                        <Rss size={13} className="text-[#f97316] group-hover:animate-pulse" />
                        S'abonner via RSS
                    </a>
                </div>
            </div>

            {/* --- HERO CARROUSEL --- */}
            {!searchTerm && activeCategory === "Tous" && heroNews.length > 0 && (
                <section className="w-full relative bg-black overflow-hidden shrink-0 z-10 border-b border-white/10">
                    <div className="relative w-full h-[50vh] md:h-[70vh]">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div key={activeIndex} custom={direction} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 flex items-center justify-center">
                                <a href={`/article/${heroNews[activeIndex].id}`} onClick={handleHaptic} className="block w-full h-full relative group">
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img src={heroNews[activeIndex].imageUrl} className="w-full h-full object-cover scale-125 blur-3xl opacity-50" alt=""/>
                                    </div>
                                    <img src={heroNews[activeIndex].imageUrl} className="w-full h-full object-contain relative z-10 p-2 md:p-0" alt={heroNews[activeIndex].title} />
                                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full max-w-[1200px] mx-auto right-0 z-30">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: B24_BLUE }}>À LA UNE</span>
                                            <h2 className="text-xl md:text-5xl font-serif font-black text-white italic tracking-tighter leading-[1.1] max-w-4xl drop-shadow-lg">{heroNews[activeIndex].title}</h2>
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            )}

            <main className="container mx-auto max-w-[1200px] px-4 py-6 flex-grow">

                {/* --- DERNIÈRES PUBLICATIONS --- */}
                {!searchTerm && activeCategory === "Tous" && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8 border-b-2 border-slate-900 pb-2">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <TrendingUp size={18} style={{ color: B24_BLUE }} /> Derniers articles
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestNews.map(item => <ArticleCard key={item.id} item={item} />)}
                        </div>
                    </section>
                )}

                {/* --- SECTIONS PAR CATÉGORIES --- */}
                {!searchTerm && activeCategory === "Tous" && categorySections.map((section) => (
                    <section key={section.name} className="mb-16">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-2">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em]">{section.name}</h2>
                            <button onClick={() => handleCategoryClick(section.name)} className="text-[10px] font-bold uppercase text-slate-400 hover:text-slate-900 flex items-center gap-1 transition-colors">
                                Voir plus <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {section.articles.map(item => (
                                <a key={item.id} href={`/article/${item.id}`} className="group block bg-white p-3 border border-slate-100 shadow-sm">
                                    <div className="aspect-video overflow-hidden mb-3">
                                        <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                    </div>
                                    <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary italic transition-colors">
                                        {item.title}
                                    </h3>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}

                {/* --- VUE RECHERCHE / FILTRE UNIQUE --- */}
                {(searchTerm || activeCategory !== "Tous") && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {filteredNews.map(item => <ArticleCard key={item.id} item={item} />)}
                    </div>
                )}

                {/* --- SECTION CHIFFRES + CTA RSS --- */}
                <section className="mt-20 mb-12 py-12 bg-slate-900 rounded-[2.5rem] text-white px-8 md:px-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-12">
                        <div className="text-center">
                            <div className="flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 mx-auto">
                                <FileText size={28} />
                            </div>
                            <p className="text-4xl font-serif font-black italic tracking-tighter mb-1">{stats.totalArticles}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Articles publiés</p>
                        </div>

                        <div className="w-px h-12 bg-white/10 hidden md:block" />

                        <div className="text-center">
                            <div className="flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 mx-auto">
                                <Eye size={28} />
                            </div>
                            <p className="text-4xl font-serif font-black italic tracking-tighter mb-1">
                                {stats.totalViews > 1000 ? `${(stats.totalViews / 1000).toFixed(1)}k` : stats.totalViews}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vues totales</p>
                        </div>

                        <div className="w-px h-12 bg-white/10 hidden md:block" />

                        <div className="text-center flex flex-col items-center gap-4">
                            <div>
                                <h4 className="text-xl font-serif italic font-black mb-2">Briefly Digital Media</h4>
                                <p className="text-[9px] text-slate-400 max-w-[200px] leading-relaxed uppercase font-bold tracking-widest">
                                    L'essentiel de l'information, décrypté pour vous.
                                </p>
                            </div>

                            {/* ===== BOUTON RSS ===== */}
                            <a
                                href={RSS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea6c0a] transition-colors rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-900/30"
                                title="S'abonner au flux RSS"
                            >
                                <Rss size={13} />
                                Flux RSS
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;