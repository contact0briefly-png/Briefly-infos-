"use client";
import React, { useMemo, useEffect } from 'react';
import AdBannerSquare from '../components/AdBannerSquare';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Clock, Eye, Share2, Bookmark, ChevronRight, TrendingUp, Sparkles, ChevronLeft } from 'lucide-react';

// --- CONFIG FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const ArticleView = ({ article, news = [], B24_BLUE }) => {

    useEffect(() => {
        if (article?.id) {
            const incrementView = async () => {
                try {
                    const articleRef = doc(db, 'artifacts', 'bbriefly-7e3b8', 'public', 'data', 'news', article.id);
                    await updateDoc(articleRef, { views: increment(1) });
                } catch (e) { console.error("Erreur compteur:", e); }
            };
            incrementView();
        }
    }, [article?.id]);

    useEffect(() => {
        // --- LOGIQUE DE CHARGEMENT TWITTER/X ---
        if (typeof window !== 'undefined') {
            if (!window.twttr) {
                const script = document.createElement("script");
                script.src = "https://platform.twitter.com/widgets.js";
                script.async = true;
                document.body.appendChild(script);
            } else if (window.twttr.widgets) {
                window.twttr.widgets.load();
            }
        }
        // ---------------------------------------

        window.scrollTo(0, 0);
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.BackButton.show();
            tg.BackButton.onClick(() => window.location.href = '/');
        }
    }, [article]);

    const { currentIdx, readTime, prevArticle, nextArticle, randomSuggestions, sideSuggestions, suggestions } = useMemo(() => {
        if (!article || !news.length) return {};
        const sorted = [...news].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        const idx = sorted.findIndex(n => n.id === article.id);
        const words = article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const time = Math.ceil(words / 200) || 1;

        const others = sorted.filter(n => n.id !== article.id);
        const shuffled = [...others].sort(() => 0.5 - Math.random());

        return { 
            currentIdx: idx, 
            prevArticle: idx < sorted.length - 1 ? sorted[idx + 1] : null,
            nextArticle: idx > 0 ? sorted[idx - 1] : null,
            suggestions: others,
            randomSuggestions: shuffled.slice(0, 3),
            sideSuggestions: shuffled.slice(3, 8), 
            readTime: time
        };
    }, [article, news]);

    if (!article) return null;

    const displayDate = useMemo(() => {
        const ts = article.timestamp?.seconds || article.lastUpdate?.seconds || article.date?.seconds;
        if (ts) {
            return new Date(ts * 1000).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        }
        return article.date || "Récemment";
    }, [article]);

    return (
        <div className="bg-white min-h-screen">
            <div className="h-16 md:h-20"></div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto no-scrollbar">
                    <a href="/" className="hover:text-slate-900 transition-colors">Accueil</a>
                    <ChevronRight size={12} />
                    <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{article.category || "Actualité"}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    <article className="lg:col-span-8 h-fit">

                        <header className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                                    {article.category || "À LA UNE"}
                                </span>
                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase">
                                    <Clock size={12} /> {readTime} min de lecture
                                </div>
                            </div>

                            <h1 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl text-slate-950 leading-[1.1] mb-8 italic tracking-tighter">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-inner" style={{ backgroundColor: B24_BLUE }}>
                                        {article.authorName ? article.authorName[0] : 'B'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 italic">Par {article.authorName || "Rédaction Briefly"}</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{displayDate}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 px-3 border-r border-slate-200">
                                        <Eye size={12} className="inline mr-1" /> {article.views || 0}
                                    </span>
                                    <div className="flex gap-1 px-1">
                                        <button className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"><Share2 size={16} /></button>
                                        <button className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"><Bookmark size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <figure className="mb-12 relative">
                            <img src={article.imageUrl} className="w-full h-auto object-cover rounded-xl shadow-lg" alt={article.title} />
                            <figcaption className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest italic">
                                Source : Briefly Digital Media
                            </figcaption>
                        </figure>

                        <div 
                            className="article-body font-sans text-slate-800 leading-[1.8] text-[18px] md:text-[20px] max-w-none mb-16"
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{ __html: article.content }} 
                        />

                        {/* --- NAVIGATION PRÉCÉDENT / SUIVANT --- */}
                        <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-100 mb-12">
                            {prevArticle ? (
                                <a href={`/article/${prevArticle.id}`} className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                    <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><ChevronLeft size={14}/> Précédent</span>
                                    <span className="font-bold text-slate-900 leading-tight line-clamp-2 italic group-hover:text-indigo-600 transition-colors">{prevArticle.title}</span>
                                </a>
                            ) : <div />}
                            {nextArticle ? (
                                <a href={`/article/${nextArticle.id}`} className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 text-right">
                                    <span className="flex items-center justify-end gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">Suivant <ChevronRight size={14}/></span>
                                    <span className="font-bold text-slate-900 leading-tight line-clamp-2 italic group-hover:text-indigo-600 transition-colors">{nextArticle.title}</span>
                                </a>
                            ) : <div />}
                        </div>

                        {/* --- SECTION SUGGESTIONS ALÉATOIRES --- */}
                        <section className="mb-12">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Sparkles size={16} style={{ color: B24_BLUE }} /> Ça pourrait vous plaire
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {randomSuggestions.map(s => (
                                    <a key={s.id} href={`/article/${s.id}`} className="group block">
                                        <div className="aspect-video rounded-2xl overflow-hidden mb-3 shadow-sm border border-slate-100">
                                            <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{s.title}</h4>
                                    </a>
                                ))}
                            </div>
                        </section>

                        <footer className="mt-16 pt-8 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2 mb-8">
                                {['#Afrique', '#Actualité', '#Briefly'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 rounded-full uppercase tracking-widest border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    </article>

                    <aside className="lg:col-span-4 space-y-12">
                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <TrendingUp size={20} style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Plus lus</h3>
                            </div>
                            <div className="space-y-8">
                                {suggestions.slice(0, 5).map((s, i) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="flex gap-4 group no-underline">
                                        <span className="text-3xl font-serif font-black text-slate-200 group-hover:text-slate-900 transition-colors italic">0{i + 1}</span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">{s.title}</h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest">{s.category || "ACTU"}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <Sparkles size={20} style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">À Découvrir</h3>
                            </div>
                            <div className="space-y-6">
                                {sideSuggestions.map((s) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="block group bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                                        <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                                            <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 leading-tight group-hover:text-primary italic transition-colors line-clamp-2">{s.title}</h4>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ArticleView;
