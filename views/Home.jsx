"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import AdBannerSquare from '@/components/AdBannerSquare'; 

const Home = ({ news = [], B24_BLUE }) => {
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || "";

    const [visibleCount, setVisibleCount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const articlesPerPage = 10;
    const loaderRef = useRef(null);

    useEffect(() => {
        setVisibleCount(10);
        setCurrentPage(1);
    }, [searchTerm]);

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
        <div className="w-full bg-white min-h-screen font-sans">
            
            {/* 1. SEO H1 HIDDEN (Correctif Audit SEO) */}
            <h1 className="sr-only">Briefly : L'actualité essentielle au Togo et à l'International</h1>

            {/* 2. HEADER DE RECHERCHE */}
            {searchTerm && (
                <div className="max-w-7xl mx-auto px-4 pt-24 flex justify-between items-end">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Résultats pour</span>
                        <h2 className="text-4xl font-[1000] uppercase italic tracking-tighter" style={{ color: B24_BLUE }}>{searchTerm}</h2>
                    </div>
                    <a href="/" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 mb-1">Effacer</a>
                </div>
            )}

            {/* 3. LE CARROUSEL */}
            {!searchTerm && heroNews.length > 0 && (
                <section className="w-full max-w-7xl mx-auto md:px-4 mt-24">
                    <div className="relative aspect-video md:rounded-3xl overflow-hidden bg-black shadow-2xl">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div 
                                key={activeIndex} 
                                custom={direction} 
                                initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }} 
                                animate={{ x: 0, opacity: 1 }} 
                                exit={{ x: direction < 0 ? "100%" : "-100%", opacity: 0 }} 
                                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} 
                                className="absolute inset-0 w-full h-full"
                            >
                                <a href={`/article/${heroNews[activeIndex].id}`} onClick={handleHaptic} className="block w-full h-full relative group">
                                    <img src={heroNews[activeIndex].imageUrl} className="w-full h-full object-cover" alt={heroNews[activeIndex].title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="text-white px-3 py-1 font-black text-[10px] uppercase italic tracking-widest" style={{ backgroundColor: B24_BLUE }}>À LA UNE</span>
                                    </div>
                                    <div className="absolute bottom-10 left-6 right-6 md:bottom-16 md:left-12">
                                        <h2 className="text-2xl md:text-5xl font-[1000] text-white uppercase italic leading-[0.9] tracking-tighter">
                                            {heroNews[activeIndex].title}
                                        </h2>
                                    </div>
                                </a>
                            </motion.div>
                        </AnimatePresence>
                        
                        {/* Contrôles agrandis pour Mobile Friendly (Audit SEO) */}
                        <button 
                            onClick={prevSlide} 
                            aria-label="Précédent"
                            className="absolute left-0 top-0 bottom-0 w-16 z-30 flex items-center justify-center text-white/50 text-4xl bg-black/5 hover:bg-black/20 transition-all"
                        >
                            ‹
                        </button>
                        <button 
                            onClick={nextSlide} 
                            aria-label="Suivant"
                            className="absolute right-0 top-0 bottom-0 w-16 z-30 flex items-center justify-center text-white/50 text-4xl bg-black/5 hover:bg-black/20 transition-all"
                        >
                            ›
                        </button>
                    </div>
                </section>
            )}

            {/* 4. GRILLE D'ARTICLES */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter whitespace-nowrap">
                        {searchTerm ? `Rubrique : ${searchTerm}` : "Dernières actualités"}
                    </h2>
                    <div className="h-[2px] w-full bg-black/5"></div>
                </div>
                
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20">
                    {displayArticles.map((item, index) => (
                        <React.Fragment key={item.id}>
                            {index > 0 && index % 5 === 0 && (
                                <div className="col-span-full py-8 flex justify-center bg-gray-50 rounded-xl border border-gray-100">
                                    <AdBannerSquare />
                                </div>
                            )}

                            <a href={`/article/${item.id}`} onClick={handleHaptic} className="group flex flex-col no-underline text-inherit">
                                <div className="overflow-hidden aspect-video mb-5 shadow-lg border-b-4 bg-gray-100" style={{ borderBottomColor: B24_BLUE }}>
                                    <img 
                                        src={item.imageUrl} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                                        alt={item.title} 
                                        loading="lazy" 
                                    />
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-black uppercase text-white px-2 py-0.5" style={{ backgroundColor: B24_BLUE }}>{item.category || "INFO"}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">{item.date}</span>
                                </div>
                                <h3 className="text-2xl font-[1000] uppercase italic leading-tight tracking-tighter group-hover:opacity-70 transition">{item.title}</h3>
                            </a>
                        </React.Fragment>
                    ))}
                </section>

                {/* 5. PAGINATION (AMÉLIORÉE POUR MOBILE) */}
                {searchTerm && totalPages > 1 && (
                    <div className="flex justify-center items-center flex-wrap gap-3 pb-24">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                className={`min-w-[48px] min-h-[48px] px-4 font-[1000] italic transition-all border-2 ${currentPage === i + 1 ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-100"}`}
                            >
                                {i + 1}
                           </button>
                        ))}
                    </div>
                )}

                {/* 6. LOADER SCROLL INFINI */}
                {!searchTerm && visibleCount < filteredNews.length && (
                    <div ref={loaderRef} className="py-20 flex justify-center">
                        <div className="w-8 h-8 border-4 border-t-transparent animate-spin rounded-full" style={{ borderColor: `${B24_BLUE} transparent ${B24_BLUE} ${B24_BLUE}` }}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;