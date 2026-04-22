"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import AdBannerSquare from '@/components/AdBannerSquare'; 
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';

const Home = ({ news = [], B24_BLUE }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Récupération de la recherche et de la catégorie via l'URL
    const searchTerm = searchParams.get('search') || "";
    const activeCategory = searchParams.get('category') || "Tous";

    const [visibleCount, setVisibleCount] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const articlesPerPage = 10;
    const loaderRef = useRef(null);

    const categories = ["Tous", "Politique", "Economie", "Tech", "Santé", "Culture", "Sport"];

    // Reset pagination quand on change de filtre
    useEffect(() => {
        setVisibleCount(10);
        setCurrentPage(1);
    }, [searchTerm, activeCategory]);

    // Infinite Scroll (uniquement si pas de recherche par page)
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

    // Filtrage principal (Recherche + Catégorie)
    const filteredNews = useMemo(() => {
        return news.filter(n => {
            const matchesSearch = !searchTerm || 
                n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                n.category?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = activeCategory === "Tous" || 
                n.category?.toLowerCase() === activeCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [news, searchTerm, activeCategory]);

    // News pour les différentes sections
    const heroNews = useMemo(() => filteredNews.slice(0, 5), [filteredNews]);
    const trendingNews = useMemo(() => news.slice(0, 3), [news]); // Les tendances restent globales

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

    const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

    return (
        <div className="w-full bg-[#f6f6f8] min-h-screen font-sans text-slate-900 transition-colors duration-200">
            
            <h1 className="sr-only">Briefly : L'actualité essentielle en Afrique</h1>

            {/* HEADER SPACING */}
            <div className="h-16 md:h-24"></div>

            <main className="container mx-auto max-w-[1200px] px-4 py-6">
                
                {/* SEARCH & FILTER HEADER */}
                {(searchTerm || activeCategory !== "Tous") && (
                    <div className="mb-10 flex justify-between items-end border-b border-slate-200 pb-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">
                                {searchTerm ? "Résultats de recherche" : "Exploration par rubrique"}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif font-black italic tracking-tighter text-slate-900">
                                {searchTerm ? `"${searchTerm}"` : activeCategory}
                            </h2>
                        </div>
                        <button onClick={() => router.push('/')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                            Réinitialiser
                        </button>
                    </div>
                )}

                {/* HERO SECTION (Uniquement si pas de recherche active pour garder le focus) */}
                {!searchTerm && activeCategory === "Tous" && heroNews.length > 0 && (
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                        <div className="lg:col-span-8 group relative overflow-hidden rounded-3xl bg-slate-900 aspect-[16/9] shadow-2xl">
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
                                        <img src={heroNews[activeIndex].imageUrl} className="w-full h-full object-cover" alt={heroNews[activeIndex].title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                                            <span className="inline-block px-3 py-1 rounded bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: B24_BLUE }}>
                                                À la une
                                            </span>
                                            <h2 className="text-2xl md:text-5xl font-serif font-black text-white leading-[1.1] mb-4 max-w-2xl italic tracking-tighter">
                                                {heroNews[activeIndex].title}
                                            </h2>
                                            <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest">
                                                Lire l'article <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </a>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Sidebar Tendances - Cachée sur petit mobile pour performance */}
                        <div className="lg:col-span-4 hidden md:flex flex-col gap-6">
                            <h3 className="text-xl font-serif font-black border-b border-primary/20 pb-2 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary" /> Tendances
                            </h3>
                            <div className="space-y-6">
                                {trendingNews.map((item, idx) => (
                                    <article key={item.id} className="flex gap-4 items-start group cursor-pointer">
                                        <span className="text-3xl font-serif font-black text-slate-200">0{idx + 1}</span>
                                        <a href={`/article/${item.id}`} className="block">
                                            <h4 className="font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">{item.title}</h4>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">{item.category}</p>
                                        </a>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CATEGORIES CHIPS - Sticky sur mobile pour navigation facile */}
                <div className="sticky top-[64px] z-30 bg-[#f6f6f8]/95 backdrop-blur-md -mx-4 px-4 py-4 mb-8 border-b border-slate-200 lg:relative lg:top-0 lg:bg-transparent lg:border-none lg:px-0">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button 
                                key={cat} 
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                                    activeCategory === cat 
                                    ? "bg-slate-900 text-white shadow-lg" 
                                    : "bg-white border border-slate-200 text-slate-500 hover:border-primary"
                                }`}
                                style={activeCategory === cat ? { backgroundColor: B24_BLUE } : {}}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID D'ARTICLES */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {displayArticles.map((item) => (
                            <article key={item.id} className="flex flex-col group cursor-pointer">
                                <a href={`/article/${item.id}`} onClick={handleHaptic} className="flex flex-col h-full">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 shadow-sm bg-slate-200">
                                        <img 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            src={item.imageUrl} 
                                            loading="lazy"
                                        />
                                        <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/60 text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className="font-serif font-black text-xl leading-snug group-hover:text-primary transition-colors mb-3 italic tracking-tight">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Jean DUPONT
                                        </span>
                                        <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1 uppercase tracking-widest">
                                            <Clock size={10} /> {item.date}
                                        </span>
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
                                <button 
                                    key={i} 
                                    onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                                    className={`w-12 h-12 rounded-xl font-black italic flex items-center justify-center border-2 transition-all ${
                                        currentPage === i + 1 ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white text-slate-400 border-slate-100"
                                    }`}
                                    style={currentPage === i + 1 ? { backgroundColor: B24_BLUE, borderColor: B24_BLUE } : {}}
                                >
                                    {i + 1}
                                </button>
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

                {/* PUBLICITÉ BAS DE PAGE (Conservée comme demandé) */}
                <div className="mt-12 py-8 border-t border-slate-200">
                    <AdBannerSquare />
                </div>
            </main>
        </div>
    );
};

export default Home;
