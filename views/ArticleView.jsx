"use client";
import React, { useMemo, useEffect } from 'react';
import AdBannerSquare from '../components/AdBannerSquare';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Clock, Eye, Share2, Bookmark, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';

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

const Icon = ({ name }) => {
    const icons = {
        whatsapp: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/>,
        facebook: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>,
        telegram: <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.357.265-.546.265l.182-2.58 4.68-4.23c.203-.18-.047-.28-.312-.104l-5.786 3.64-2.502-.78c-.544-.17-.554-.544.114-.81l9.76-3.76c.452-.164.847.108.71.79z"/>,
        twitter: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    };
    return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            {icons[name]}
        </svg>
    );
};

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
        window.scrollTo(0, 0);
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.BackButton.show();
            tg.BackButton.onClick(() => window.location.href = '/');
        }
    }, [article]);

    const { currentIdx, encodedMessage, encodedUrl, suggestions, readTime, sortedNews } = useMemo(() => {
        if (!article || !news.length) return {};
        const sorted = [...news].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        const idx = sorted.findIndex(n => n.id === article.id);
        const articleUrl = `https://briefly-lilac.vercel.app/article/${article.id}`;
        const words = article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const time = Math.ceil(words / 200) || 1;
        return { 
            currentIdx: idx, sortedNews: sorted,
            encodedMessage: encodeURIComponent(` ${article.title}\n\n${articleUrl}`),
            encodedUrl: encodeURIComponent(articleUrl),
            suggestions: sorted.filter(n => n.id !== article.id).sort(() => 0.5 - Math.random()),
            readTime: time
        };
    }, [article, news]);

    if (!article) return null;

    const shareOptions = [
        { name: 'whatsapp', color: 'text-[#25D366]', bg: 'hover:bg-[#25D366]/10', url: `https://api.whatsapp.com/send?text=${encodedMessage}` },
        { name: 'facebook', color: 'text-[#1877F2]', bg: 'hover:bg-[#1877F2]/10', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
        { name: 'telegram', color: 'text-[#0088cc]', bg: 'hover:bg-[#0088cc]/10', url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}` },
        { name: 'twitter', color: 'text-[#1DA1F2]', bg: 'hover:bg-[#1DA1F2]/10', url: `https://twitter.com/intent/tweet?url=${encodedUrl}` },
    ];

    const displayDate = article.date || (article.timestamp?.seconds ? new Date(article.timestamp.seconds * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Récemment");

    return (
        <div className="bg-[#f6f6f8] min-h-screen">
            {/* SPACING FOR NAVBAR */}
            <div className="h-16 md:h-20"></div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                
                {/* BREADCRUMBS */}
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto no-scrollbar">
                    <a href="/" className="hover:text-slate-900 transition-colors">Accueil</a>
                    <ChevronRight size={12} />
                    <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{article.category || "Actualité"}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* ARTICLE CONTENT */}
                    <article className="lg:col-span-8 bg-white p-6 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
                        
                        {/* HEADER */}
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

                        {/* FEATURED IMAGE */}
                        <figure className="mb-12 -mx-6 md:-mx-12 relative">
                            <img src={article.imageUrl} className="w-full h-auto object-cover md:rounded-xl shadow-2xl" alt={article.title} />
                            <figcaption className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest italic">
                                Source : Briefly Digital Media
                            </figcaption>
                        </figure>

                        {/* PARTAGE MOBILE */}
                        <div className="lg:hidden flex gap-2 mb-10 overflow-x-auto no-scrollbar">
                            {shareOptions.map(s => (
                                <button key={s.name} onClick={() => window.open(s.url)} className={`flex-1 min-w-[50px] h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 transition-all active:scale-95 ${s.color}`}>
                                    <Icon name={s.name} />
                                </button>
                            ))}
                        </div>

                        {/* ARTICLE BODY */}
                        <div 
                            className="article-body font-sans text-slate-800 leading-[1.8] text-[18px] md:text-[20px] max-w-none mb-16"
                            style={{ whiteSpace: "pre-line" }}
                            dangerouslySetInnerHTML={{ __html: article.content }} 
                        />

                        <div className="my-12">
                            <AdBannerSquare />
                        </div>

                        {/* FOOTER ARTICLE - TAGS */}
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

                    {/* SIDEBAR */}
                    <aside className="lg:col-span-4 space-y-12">
                        
                        {/* MOST READ */}
                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <TrendingUp size={20} className="text-primary" style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Plus lus</h3>
                            </div>
                            <div className="space-y-8">
                                {suggestions.slice(0, 5).map((s, i) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="flex gap-4 group no-underline">
                                        <span className="text-3xl font-serif font-black text-slate-200 group-hover:text-slate-900 transition-colors italic">0{i + 1}</span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors line-clamp-2" style={ { '--tw-text-opacity': '1', color: `var(--group-hover-color, #000)` } }>
                                                {s.title}
                                            </h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest">{s.category || "INFO"}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* SIDEBAR AD */}
                        <div className="bg-slate-900 p-8 rounded-[2rem] text-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-serif italic font-black mb-4 tracking-tighter leading-tight">Restez informé en temps réel</h4>
                                <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Rejoignez nos 10k+ lecteurs sur Briefly-Infos</p>
                                <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">S'abonner</button>
                            </div>
                        </div>

                        {/* RELATED STORIES */}
                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <Sparkles size={20} style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">À Découvrir</h3>
                            </div>
                            <div className="space-y-6">
                                {suggestions.slice(5, 8).map((s) => (
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
