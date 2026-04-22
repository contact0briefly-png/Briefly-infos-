"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import AdBannerSquare from '@/components/AdBannerSquare'; 
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';

const Home = ({ news = [], B24_BLUE }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const searchTerm = searchParams.get('search') || "";
    const activeCategory = searchParams.get('category') || "Tous";

    const [visibleCount, setVisibleCount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const articlesPerPage = 10;
    const loaderRef = useRef(null);

    // --- EXTRACTION DYNAMIQUE DES CATÉGORIES ---
    const dynamicCategories = useMemo(() => {
        const cats = news
            .map(item => item.category)
            .filter(cat => cat && cat.trim() !== ""); 
        return ["Tous", ...new Set(cats)]; 
    }, [news]);

    useEffect(() => {
        setVisibleCount(10);
        setCurrentPage(1);
    }, [searchTerm, activeCategory]);

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

    // --- FILTRAGE ---
    const filteredNews = useMemo(() => {
        return news.filter(n => {
            const matchesSearch = !searchTerm || 
                n.title?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = activeCategory === "Tous" || 
                n.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [news, searchTerm, activeCategory]);

    // On utilise les news filtrées pour le carrousel afin qu'il soit pertinent
    const heroNews = useMemo(() => filteredNews.slice(0, 5), [filteredNews]);
    // Les tendances restent basées sur l'ensemble des news
    const trendingNews = useMemo(() => news.slice(0, 3), [news]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % (heroNews.length || 1));
    }, [heroNews.length]);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + heroNews.length) % (heroNews.length || 1));
    }, [heroNews.length]);

    useEffect(() => {
        if (!searchTerm && heroNews.length > 1) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [searchTerm, heroNews.length, nextSlide]);

    const displayArticles = useMemo(() => {
        if (searchTerm) {
            const indexOfLast = currentPage * articlesPerPage;
            return filteredNews.slice(indexOfLast - articlesPerPage, indexOfLast);
        }
        return filteredNews.slice(0, visibleCount);
    }, [filteredNews, searchTerm, currentPage, visibleCount]);

    const handleCategoryClick = (cat) => {
        handleHaptic();
        const params = new URLSearchParams(searchParams);
        if (cat === "Tous") {
            params.delete('category');
        } else {
            params.set('category', cat);
        }
        router.push(`?${params.toString()}`);
    };

    // --- FORMATAGE DE LA DATE ---
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

    return (
        <div className="w-full bg-[#f6f6f8] min-h-screen font-sans text-slate-900 transition-colors duration-200 flex flex-col">
            <h1 className="sr-only">Briefly : L'actualité en continu</h1>
            
            {/* HEADER SPACING (Padding pour compenser le sticky header de l'app) */}
            <div className="h-16 md:h-24 shrink-0"></div>

            {/* --- SECTION HERO FULL WIDTH & SQUARE --- */}
            {!searchTerm && activeCategory === "Tous" && heroNews.length > 0 && (
                <section className="w-full relative bg-slate-900 overflow-hidden shrink-0 shadow-2xl z-10">
                    {/* On force un ratio format cinéma (21/9) pour mobile et PC pour que ça remplisse bien l'espace sans être trop haut */}
                    <div className="relative w-full aspect-[21/9] md:aspect-[21/9]">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div 
                                key={activeIndex} 
                                custom={direction} 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                transition={{ duration: 0.7, ease: "easeInOut" }} 
                                className="absolute inset-0"
                            >
                                <a href={`/article/${heroNews[activeIndex].id}`} onClick={handleHaptic} className="block w-full h-full relative group">
                                    <img 
                                        src={heroNews[activeIndex].imageUrl} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                        alt={heroNews[activeIndex].title} 
                                    />
                                    {/* Overlay dégradé plus sombre en bas pour la lisibilité du titre */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                                    
                                    {/* Contenu textuel carré/rectangle en bas à gauche */}
                                    <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-[1200px] mx-auto right-0 flex flex-col items-start">
                                        <span className="inline-block px-4 py-1.5 rounded-none bg-primary text-white text-[10px] md:text-xs font-black uppercase tracking-widest mb-4" style={{ backgroundColor: B24_BLUE }}>
                                            À LA UNE
                                        </span>
                                        <h2 className="text-2xl md:text-6xl font-serif font-black text-white italic tracking-tighter leading-[1.1] mb-2 rectangle-title group-hover:text-white/80 transition-colors">
                                            {heroNews[activeIndex].title}
                                        </h2>
                                    </div>
                                </a>
                            </motion.div>
                        </AnimatePresence>
                        
                        {/* Flèches de navigation Carrousel (Optionnel, désactivé pour look plus épuré "rectangle") */}
                        {/* <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white text-4xl">‹</button> */}
                        {/* <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white text-4xl">›</button> */}
                    </div>
                </section>
            )}

            <main className="container mx-auto max-w-[1200px] px-4 py-6 flex-grow">
                
                {/* HEADER FILTRE (S'affiche si recherche ou catégorie active) */}
                {(searchTerm || activeCategory !== "Tous") && (
                    <div className="mb-10 flex justify-between items-end border-b border-slate-200 pb-6 mt-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">Exploration</span>
                            <h2 className="text-3xl font-serif font-black italic tracking-tighter text-slate-900">
                                {searchTerm ? `"${searchTerm}"` : activeCategory}
                            </h2>
                        </div>
                        <button onClick={() => router.push('/')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">Réinitialiser</button>
                    </div>
                )}

                {/* --- TENDANCES (Maintenant en bas du Hero sur Mobile, ou masqué si préféré) --- */}
                {!searchTerm && activeCategory === "Tous" && trendingNews.length > 0 && (
                    <section className="mt-8 mb-12 md:hidden">
                        <h3 className="text-lg font-serif font-black border-b border-primary/20 pb-2 flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-primary" /> Tendances Actuelles</h3>
                        <div className="space-y-5">
                            {trendingNews.map((item, idx) => (
                                <article key={item.id} className="flex gap-4 items-center group cursor-pointer bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                                    <span className="text-2xl font-serif font-black text-slate-200">0{idx + 1}</span>
                                    <a href={`/article/${item.id}`} className="block flex-grow">
                                        <h4 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                                    </a>
                                    <ArrowRight size={16} className="text-slate-300 shrink-0" />
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- CATEGORIES DYNAMIQUES (Sticky) --- */}
                <div className="sticky top-[64px] z-30 bg-[#f6f6f8]/95 backdrop-blur-md -mx-4 px-4 py-4 mb-8 border-b border-slate-200 lg:relative lg:top-0 lg:bg-transparent lg:border-none lg:px-0">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2">
                        {dynamicCategories.map((cat) => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeCategory === cat ? "text-white shadow-lg shadow-primary/20" : "bg-white border border-slate-200 text-slate-500 hover:border-primary"
                                }`}
                                style={activeCategory === cat ? { backgroundColor: B24_BLUE } : {}}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- GRILLE D'ARTICLES --- */}
                <section className="mb-12">
                    {/* Titre de section dynamique sur PC */}
                    {!searchTerm && activeCategory === "Tous" && (
                        <div className="hidden md:flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-serif font-black italic tracking-tighter text-slate-900">Récemment Publié</h2>
                            <div className="h-[1px] flex-grow mx-8 bg-slate-200"></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {displayArticles.map((item) => (
                            <article key={item.id} className="flex flex-col group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                                <a href={`/article/${item.id}`} onClick={handleHaptic} className="flex flex-col h-full">
                                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200">
                                        <img 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            src={item.imageUrl} 
                                            loading="lazy" 
                                        />
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">{item.category}</span>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="font-serif font-black text-xl leading-snug group-hover:text-primary transition-colors mb-4 italic tracking-tight text-slate-950 line-clamp-3">
                                            {item.title}
                                        </h3>
                                        
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {item.authorName || "Rédaction Briefly"}
                                            </span>
                                            <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1 uppercase tracking-widest">
                                                <Clock size={10} /> {formatDate(item.date)}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                {/* PAGINATION / LOADER */}
                {searchTerm ? (
                    totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pb-24 mt-12">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`w-12 h-12 rounded-xl font-black italic flex items-center justify-center border-2 transition-all ${currentPage === i + 1 ? "text-white border-none shadow-xl" : "bg-white text-slate-400 border-slate-100"}`} style={currentPage === i + 1 ? { backgroundColor: B24_BLUE } : {}}>{i + 1}</button>
                            ))}
                        </div>
                    )
                ) : (
                    visibleCount < filteredNews.length && (
                        <div ref={loaderRef} className="py-20 flex flex-col items-center gap-4">
                            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary animate-spin rounded-full" style={{ borderTopColor: B24_BLUE }}></div>
                        </div>
                    )
                )}

                {/* PUBLICITÉ BAS DE PAGE */}
                <div className="mt-12 py-8 border-t border-slate-200">
                    <AdBannerSquare />
                </div>
            </main>
        </div>
    );
};

export default Home;
