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

    const filteredNews = useMemo(() => {
        return news.filter(n => {
            const matchesSearch = !searchTerm || 
                n.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "Tous" || 
                n.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [news, searchTerm, activeCategory]);

    const heroNews = useMemo(() => filteredNews.slice(0, 5), [filteredNews]);
    const trendingNews = useMemo(() => news.slice(0, 3), [news]);

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
        if (cat === "Tous") params.delete('category');
        else params.set('category', cat);
        router.push(`?${params.toString()}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full bg-[#f6f6f8] min-h-screen font-sans text-slate-900 flex flex-col">
            <h1 className="sr-only">Briefly : L'actualité en continu</h1>

            {/* ZÉRO MARGE ICI : On colle à la navbar */}
            <div className="h-14 md:h-20 shrink-0"></div>

            {/* --- SECTION HERO DYNAMIQUE (Format Intelligent) --- */}
            {!searchTerm && activeCategory === "Tous" && heroNews.length > 0 && (
                <section className="w-full relative bg-black overflow-hidden shrink-0 z-10 border-b border-white/10">
                    {/* On définit une hauteur max pour ne pas que les images verticales prennent tout l'écran */}
                    <div className="relative w-full h-[50vh] md:h-[70vh]">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div 
                                key={activeIndex} 
                                custom={direction} 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }} 
                                transition={{ duration: 0.8 }} 
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <a href={`/article/${heroNews[activeIndex].id}`} onClick={handleHaptic} className="block w-full h-full relative group">
                                    
                                    {/* COUCHE 1 : Arrière-plan flou (pour boucher les trous sans couper l'image) */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img 
                                            src={heroNews[activeIndex].imageUrl} 
                                            className="w-full h-full object-cover scale-125 blur-3xl opacity-50 transition-transform duration-[3000ms]" 
                                            alt=""
                                        />
                                    </div>

                                    {/* COUCHE 2 : L'image RÉELLE (on utilise object-contain pour NE PAS LA COUPER) */}
                                    <img 
                                        src={heroNews[activeIndex].imageUrl} 
                                        className="w-full h-full object-contain relative z-10 p-2 md:p-0" 
                                        alt={heroNews[activeIndex].title} 
                                    />

                                    {/* COUCHE 3 : Overlay Dégradé pour le texte (plus intense en bas) */}
                                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                    {/* COUCHE 4 : Titre et Catégorie */}
                                    <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full max-w-[1200px] mx-auto right-0 z-30">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: B24_BLUE }}>
                                                À LA UNE
                                            </span>
                                            <h2 className="text-xl md:text-5xl font-serif font-black text-white italic tracking-tighter leading-[1.1] max-w-4xl drop-shadow-lg">
                                                {heroNews[activeIndex].title}
                                            </h2>
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>
            )}

            <main className="container mx-auto max-w-[1200px] px-4 py-6 flex-grow">
                {/* Section Catégories */}
                <div className="sticky top-14 z-30 bg-[#f6f6f8]/95 backdrop-blur-md -mx-4 px-4 py-4 mb-8 border-b border-slate-200 lg:relative lg:top-0 lg:bg-transparent lg:border-none lg:px-0">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                        {dynamicCategories.map((cat) => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                                    activeCategory === cat ? "text-white shadow-lg" : "bg-white border border-slate-200 text-slate-500"
                                }`}
                                style={activeCategory === cat ? { backgroundColor: B24_BLUE } : {}}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grille d'articles */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {displayArticles.map((item) => (
                            <article key={item.id} className="flex flex-col group bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                <a href={`/article/${item.id}`} onClick={handleHaptic}>
                                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                                        <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.imageUrl} loading="lazy" />
                                        <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-[8px] font-black uppercase tracking-widest">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-serif font-black text-lg leading-tight mb-4 italic tracking-tight text-slate-950 line-clamp-3">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <span className="text-[9px] font-black uppercase text-slate-400">{item.authorName || "Rédaction Briefly"}</span>
                                            <span className="text-[9px] text-slate-300 font-bold flex items-center gap-1">
                                                <Clock size={10} /> {formatDate(item.date)}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                {visibleCount < filteredNews.length && !searchTerm && (
                    <div ref={loaderRef} className="py-10 flex justify-center">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-primary animate-spin rounded-full" style={{ borderTopColor: B24_BLUE }}></div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
