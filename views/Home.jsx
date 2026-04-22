"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import AdBannerSquare from '@/components/AdBannerSquare'; 
import { Search, Bell, UserCircle, ArrowRight, TrendingUp, Clock, ExternalLink } from 'lucide-react';

const Home = ({ news = [], B24_BLUE }) => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || "";

    const [visibleCount, setVisibleCount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const articlesPerPage = 10;
    const loaderRef = useRef(null);

    // Synchronisation avec les termes de recherche
    useEffect(() => {
        setVisibleCount(10);
        setCurrentPage(1);
    }, [searchTerm]);

    // Infinite Scroll
    useEffect(() => {
        if (searchTerm) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisibleCount(prev => prev + 10);
            }
        }, { threshold: 0.1 });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [searchTerm]);

    const handleHaptic = () => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };

    const heroNews = useMemo(() => news.slice(0, 5), [news]);
    const trendingNews = useMemo(() => news.slice(5, 8), [news]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % (heroNews.length || 1));
    }, [heroNews.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + heroNews.length) % (heroNews.length || 1));
    }, [heroNews.length]);

    useEffect(() => {
        if (!searchTerm && heroNews.length > 0) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [searchTerm, heroNews.length, nextSlide]);

    const filteredNews = useMemo(() => {
        return news.filter(n => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase().trim();
            return (n.category?.toLowerCase().trim().includes(search) || n.title?.toLowerCase().includes(search));
        });
    }, [news, searchTerm]);

    const displayArticles = useMemo(() => {
        if (searchTerm) {
            const indexOfLast = currentPage * articlesPerPage;
            return filteredNews.slice(indexOfLast - articlesPerPage, indexOfLast);
        }
        return filteredNews.slice(0, visibleCount);
    }, [filteredNews, searchTerm, currentPage, visibleCount]);

    const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

    return (
        <div className="w-full bg-[#f6f6f8] min-h-screen font-sans text-slate-900 transition-colors duration-200">
            
            {/* SEO H1 HIDDEN */}
            <h1 className="sr-only">Briefly : L'actualité essentielle en Afrique et à l'International</h1>

            {/* HEADER ESPACE (Padding pour compenser le sticky header de l'app) */}
            <div className="h-20 md:h-24"></div>

            <main className="container mx-auto max-w-[1200px] px-4 py-6">
                
                {/* PUB TOP */}
                <div className="w-full h-24 bg-slate-200/40 rounded-xl mb-8 flex items-center justify-center border border-dashed border-slate-300">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Publicité</span>
                </div>

                {/* SEARCH RESULTS HEADER */}
                {searchTerm && (
                    <div className="mb-10 flex justify-between items-end border-b border-slate-200 pb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">Exploration</span>
                            <h2 className="text-4xl font-serif font-black italic tracking-tighter text-slate-900">"{searchTerm}"</h2>
                        </div>
                        <a href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Retour</a>
                    </div>
                )}

                {/* SECTION HERO + TRENDING */}
                {!searchTerm && heroNews.length > 0 && (
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        {/* Carrousel Principal */}
                        <div className="lg:col-span-8 group relative overflow-hidden rounded-2xl bg-slate-900 aspect-[16/9] shadow-2xl">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div 
                                    key={activeIndex}
                                    custom={direction}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute inset-0"
                                >
                                    <a href={`/article/${heroNews[activeIndex].id}`} onClick={handleHaptic} className="block w-full h-full relative">
                                        <img 
                                            src={heroNews[activeIndex].imageUrl} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                            alt={heroNews[activeIndex].title} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                                            <span className="inline-block px-3 py-1 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: B24_BLUE }}>
                                                À la une
                                            </span>
                                            <h2 className="text-2xl md:text-5xl font-serif font-black text-white leading-[1.1] mb-4 max-w-2xl italic tracking-tighter">
                                                {heroNews[activeIndex].title}
                                            </h2>
                                            <button className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                                                Lire l'article <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </a>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Carrousel */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all">‹</button>
                                <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all">›</button>
                            </div>
                        </div>

                        {/* Sidebar Trending */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <h3 className="text-xl font-serif font-black border-b border-primary/20 pb-2 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" /> Tendances
                            </h3>
                            <div className="space-y-6">
                                {trendingNews.map((item, idx) => (
                                    <article key={item.id} className="flex gap-4 items-start group cursor-pointer">
                                        <span className="text-3xl font-serif font-black text-slate-200">0{idx + 1}</span>
                                        <a href={`/article/${item.id}`} onClick={handleHaptic} className="block">
                                            <h4 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">
                                                {item.category} • {item.date}
                                            </p>
                                        </a>
                                    </article>
                                ))}
                            </div>
                            
                            {/* Petit Ad Sidebar */}
                            <div className="mt-auto p-4 bg-white rounded-xl border border-slate-200 text-center">
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-2">Partenaire</span>
                                <div className="h-32 bg-slate-50 rounded-lg flex items-center justify-center italic text-slate-300 text-xs">
                                    Espace Publicitaire
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FILTRE / CATEGORIES */}
                <div className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar mb-8 border-b border-slate-100">
                    <button className="px-6 py-2 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest whitespace-nowrap shadow-lg shadow-primary/20" style={{ backgroundColor: B24_BLUE }}>Tous</button>
                    {["Politique", "Economie", "Tech", "Santé", "Culture", "Sport"].map((cat) => (
                        <button key={cat} className="px-6 py-2 rounded-full bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all font-bold text-xs uppercase tracking-widest whitespace-nowrap text-slate-500">
                            {cat}
                        </button>
                    ))}
                </div>

                {/* GRILLE D'ARTICLES RÉCENTS */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-black italic tracking-tighter">
                            {searchTerm ? `Résultats` : "Dernières Analyses"}
                        </h2>
                        {!searchTerm && (
                            <div className="h-[1px] flex-grow mx-8 bg-slate-200 hidden md:block"></div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayArticles.map((item, index) => (
                            <React.Fragment key={item.id}>
                                {/* Insertion Pub tous les 6 articles */}
                                {index > 0 && index % 6 === 0 && (
                                    <div className="col-span-full py-10">
                                        <div className="w-full p-8 bg-slate-900 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-white overflow-hidden relative">
                                            <div className="relative z-10">
                                                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">Newsletter</span>
                                                <h4 className="text-2xl font-serif font-black italic mt-2">Ne manquez aucun brief.</h4>
                                                <p className="text-slate-400 text-sm mt-1">L'essentiel de l'info directement dans votre poche.</p>
                                            </div>
                                            <div className="flex gap-2 w-full md:w-auto relative z-10">
                                                <input className="flex-1 md:w-64 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-slate-500 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Votre email" type="email"/>
                                                <button className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-colors" style={{ backgroundColor: B24_BLUE }}>Rejoindre</button>
                                            </div>
                                            {/* Design element */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                        </div>
                                    </div>
                                )}

                                <article className="flex flex-col group cursor-pointer">
                                    <a href={`/article/${item.id}`} onClick={handleHaptic} className="flex flex-col h-full">
                                        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 shadow-sm">
                                            <img 
                                                alt={item.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                                src={item.imageUrl} 
                                                loading="lazy"
                                            />
                                            <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                                {item.category || "Info"}
                                            </span>
                                        </div>
                                        
                                        <h3 className="font-serif font-black text-xl leading-snug group-hover:text-primary transition-colors mb-3 italic tracking-tight">
                                            {item.title}
                                        </h3>
                                        
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {/* Simulation de description si absente */}
                                            Analyse approfondie de l'impact des récents événements sur la scène locale et internationale.
                                        </p>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                                    {item.authorName ? item.authorName[0] : 'B'}
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Jean DUPONT
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1 uppercase tracking-widest">
                                                <Clock size={10} /> {item.date}
                                            </span>
                                        </div>
                                    </a>
                                </article>
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* PAGINATION SEARCH */}
                {searchTerm && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pb-24 mt-12">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                className={`w-12 h-12 rounded-xl font-black italic transition-all flex items-center justify-center border-2 ${currentPage === i + 1 ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-400 border-slate-100 hover:border-primary"}`}
                            >
                                {i + 1}
                           </button>
                        ))}
                    </div>
                )}

                {/* LOADER INFINITE SCROLL */}
                {!searchTerm && visibleCount < filteredNews.length && (
                    <div ref={loaderRef} className="py-20 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary animate-spin rounded-full" style={{ borderTopColor: B24_BLUE }}></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Chargement des dossiers</span>
                    </div>
                )}

                {/* FOOTER NATIVE AD BANNER */}
                {!searchTerm && (
                    <div className="mt-12">
                        <AdBannerSquare />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
