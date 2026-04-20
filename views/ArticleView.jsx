"use client";
import React, { useMemo, useEffect } from 'react';
import AdBannerSquare from '../components/AdBannerSquare';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

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
        twitter: <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>,
        linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
    };
    return (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            {icons[name]}
        </svg>
    );
};

const ArticleView = ({ article, news = [] }) => {
    
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
        <article className="max-w-[1440px] mx-auto pb-20 w-full bg-white pt-24 md:pt-32 px-4 md:px-8">
            <div className="flex flex-col lg:grid lg:grid-cols-[120px_1fr_350px] gap-8 md:gap-12">
                
                <aside className="hidden lg:flex flex-col items-center gap-4 sticky top-48 h-fit">
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 mb-2">Partage</p>
                    {shareOptions.map(s => (
                        <button key={s.name} onClick={() => window.open(s.url)} className={`w-11 h-11 flex items-center justify-center rounded-full border border-gray-100 shadow-sm transition-all hover:scale-110 ${s.color} ${s.bg}`}>
                            <Icon name={s.name} />
                        </button>
                    ))}
                </aside>

                <main className="max-w-3xl mx-auto w-full">
                    <header className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-blue-600 font-black text-[11px] uppercase tracking-widest border-l-4 border-blue-600 pl-3 block">
                                {article.category || "À la une"}
                            </span>
                            <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">
                                👁️ {article.views || 0} vues
                            </span>
                        </div>
                        
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight italic">
                            {article.title}
                        </h1>

                        <div className="lg:hidden flex gap-2 mb-8 border-b border-gray-50 pb-6 overflow-x-auto no-scrollbar">
                            {shareOptions.map(s => (
                                <button key={s.name} onClick={() => window.open(s.url)} className={`flex-1 min-w-[50px] h-12 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 ${s.color}`}>
                                    <Icon name={s.name} />
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-between py-6 border-y border-gray-100 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                                    {article.authorName ? article.authorName[0].toUpperCase() : 'B'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-900">Par {article.authorName || "Rédaction Briefly"}</span>
                                    <span className="text-[10px] font-medium text-gray-400">{displayDate}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{readTime} min</span>
                        </div>
                    </header>

                    <img src={article.imageUrl} className="w-full h-auto object-cover rounded-3xl mb-12 shadow-md" alt={article.title} />

                    {/* SECTION MISE EN PAGE CORRIGÉE */}
                    <div 
                        className="article-body text-gray-800 leading-[1.8] text-[18px] md:text-[21px] mb-16" 
                        style={{ 
                            fontFamily: "Inter, sans-serif",
                            whiteSpace: "pre-line" // Conserve les sauts de ligne du texte brut
                        }}
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />

                    <AdBannerSquare />

                    <nav className="grid grid-cols-2 gap-4 py-10 border-t border-gray-100 mt-10 mb-20">
                        {currentIdx < sortedNews?.length - 1 && (
                            <a href={`/article/${sortedNews[currentIdx + 1].id}`} className="group no-underline">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">← Précédent</span>
                                <p className="text-sm font-bold text-gray-900 line-clamp-2 mt-1 group-hover:text-blue-600 transition-colors">{sortedNews[currentIdx + 1].title}</p>
                            </a>
                        )}
                        {currentIdx > 0 && (
                            <a href={`/article/${sortedNews[currentIdx - 1].id}`} className="group no-underline text-right ml-auto">
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Suivant →</span>
                                <p className="text-sm font-bold text-gray-900 line-clamp-2 mt-1 group-hover:text-blue-600 transition-colors">{sortedNews[currentIdx - 1].title}</p>
                            </a>
                        )}
                    </nav>

                    <footer className="mt-20 border-t border-gray-200 pt-16">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">À ne pas manquer</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {suggestions.slice(0, 6).map((s) => (
                                <a key={s.id} href={`/article/${s.id}`} className="group no-underline block">
                                    <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-5 bg-gray-100 shadow-sm">
                                        <img src={s.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={s.title} />
                                    </div>
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{s.category || "ACTU"}</span>
                                    <h4 className="font-bold text-gray-900 text-base leading-tight group-hover:text-blue-700 transition-colors line-clamp-3">{s.title}</h4>
                                </a>
                            ))}
                        </div>
                    </footer>
                </main>

                <aside className="hidden lg:block">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Top Stories</h3>
                            <div className="space-y-8">
                                {suggestions.slice(6, 11).map((s, i) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="flex gap-4 group no-underline">
                                        <span className="text-3xl font-black text-gray-200 group-hover:text-blue-100 transition-colors italic">0{i + 1}</span>
                                        <h4 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">{s.title}</h4>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </article>
    );
};

export default ArticleView;