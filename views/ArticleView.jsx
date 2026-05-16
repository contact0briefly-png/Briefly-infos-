"use client";
import React, { useMemo, useEffect } from 'react';
import AdBannerSquare from '../components/AdBannerSquare';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Clock, Eye, Share2, Bookmark, ChevronRight, TrendingUp, Sparkles, ChevronLeft, Mail } from 'lucide-react';

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

const BREVO_ACTION = "https://b33f5b02.sibforms.com/serve/MUIFAGBxCfyEwfx-cB0M9i9gOYvlwv3b9XmULA8_jGaWHLuG5zbH6c2QvO928ogIkVBjF1c1mj7KCG06Zfye3McOWoe9G04JeD_TsTFM9EDSz7QYpppQ-u5X9E5udLQ7RLKl0QOuqiTCBG1jawLH4u1WYJNwxQ1OrCbFri0xOGjcxz6ye7PhaJEy9ibaiQ4LS_foT82lqz32UOJdBw==";

// ── Styles Quill injectés dans la page pour le rendu correct du contenu ──
const QUILL_ARTICLE_STYLES = `
    .article-body h1 { font-size: 2em; font-weight: 900; margin: 1.2em 0 .5em; line-height: 1.2; color: #0f172a; }
    .article-body h2 { font-size: 1.5em; font-weight: 800; margin: 1.2em 0 .5em; line-height: 1.3; color: #0f172a; }
    .article-body h3 { font-size: 1.2em; font-weight: 700; margin: 1.1em 0 .4em; line-height: 1.4; color: #0f172a; }
    .article-body p  { margin: 0 0 1.1em; }
    .article-body p:empty { display: none; }
    .article-body strong, .article-body b { font-weight: 800; color: #0f172a; }
    .article-body em, .article-body i { font-style: italic; }
    .article-body s  { text-decoration: line-through; }
    .article-body u  { text-decoration: underline; }
    .article-body a  { color: #4f46e5; text-decoration: underline; font-weight: 600; }
    .article-body a:hover { opacity: .8; }
    .article-body ul { list-style: disc;   padding-left: 1.6em; margin: .8em 0 1.2em; }
    .article-body ol { list-style: decimal; padding-left: 1.6em; margin: .8em 0 1.2em; }
    .article-body li { margin-bottom: .4em; }
    .article-body blockquote {
        border-left: 4px solid #4f46e5; margin: 1.6em 0;
        padding: 1em 1.4em; background: #f8f7ff;
        border-radius: 0 12px 12px 0; font-style: italic;
        color: #374151; font-size: 1.05em;
    }
    .article-body pre {
        background: #1e1e2e; color: #cdd6f4;
        border-radius: 12px; padding: 1.2em 1.4em;
        font-family: 'Fira Code', monospace; font-size: .85em;
        overflow-x: auto; margin: 1.2em 0;
    }
    .article-body code {
        background: #f1f5f9; color: #6366f1;
        padding: 2px 6px; border-radius: 5px;
        font-family: monospace; font-size: .88em;
    }
    .article-body pre code { background: none; color: inherit; padding: 0; }
    .article-body img {
        max-width: 100%; height: auto; border-radius: 12px;
        margin: 1.2em auto; display: block; box-shadow: 0 4px 20px rgba(0,0,0,.1);
    }
    .article-body .ql-align-center { text-align: center; }
    .article-body .ql-align-right  { text-align: right; }
    .article-body .ql-align-justify { text-align: justify; }
    .article-body sub { vertical-align: sub; font-size: .75em; }
    .article-body sup { vertical-align: super; font-size: .75em; }
    .article-body .ql-size-small  { font-size: .875em; }
    .article-body .ql-size-large  { font-size: 1.25em; }
    .article-body .ql-size-huge   { font-size: 1.6em; font-weight: 700; }
    .article-body .ql-indent-1 { padding-left: 2em; }
    .article-body .ql-indent-2 { padding-left: 4em; }
    .article-body .ql-indent-3 { padding-left: 6em; }
    .article-body hr {
        border: none; border-top: 2px solid #e2e8f0;
        margin: 2em 0;
    }
    /* Couleurs de texte et de fond générées par Quill */
    .article-body [style*="color"] { /* hérite via inline styles */ }
    .article-body [style*="background-color"] { padding: 1px 3px; border-radius: 3px; }
`;

// ── Composant Newsletter inline ──
const NewsletterInline = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) { setStatus('error'); return; }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('EMAIL', email);
            fd.append('email_address_check', '');
            fd.append('locale', 'fr');
            await fetch(BREVO_ACTION, { method: 'POST', body: fd, mode: 'no-cors' });
            setStatus('success');
            setEmail('');
        } catch { setStatus('error'); }
        finally { setLoading(false); }
    };

    return (
        <section className="my-12 relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute top-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-orange-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            <div className="relative z-10 px-8 py-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-3">
                        <Mail size={11} className="text-orange-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/70">Newsletter</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-black italic tracking-tight leading-tight mb-2">
                        Ne ratez aucun article.
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Recevez l'essentiel de Briefly dans votre boîte mail. Gratuit, sans spam.
                    </p>
                </div>
                <div className="flex-1 w-full max-w-sm">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center gap-2 py-4 text-center">
                            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-white font-black font-serif italic">Inscription confirmée !</p>
                            <p className="text-slate-400 text-[11px]">Vous recevrez les prochains articles.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="email" value={email}
                                    onChange={e => { setEmail(e.target.value); setStatus(null); }}
                                    placeholder="votre@email.com" required
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm font-medium focus:outline-none focus:border-orange-400 transition-all"
                                />
                                <button type="submit" disabled={loading}
                                    className="px-5 py-3 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 transition-colors rounded-xl text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                    {loading ? '…' : "S'inscrire"}
                                </button>
                            </div>
                            {status === 'error' && (
                                <p className="text-red-400 text-[10px] font-bold">Email invalide.</p>
                            )}
                            <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">
                                Gratuit · Sans spam · Désabonnement en 1 clic
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

const ArticleView = ({ article, news = [], B24_BLUE }) => {

    // ── Injection des styles Quill dans le <head> ──
    useEffect(() => {
        const id = 'quill-article-styles';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = QUILL_ARTICLE_STYLES;
            document.head.appendChild(style);
        }
        return () => {
            // On garde le style en place pour éviter le flash au changement d'article
        };
    }, []);

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
        const loadTwitter = () => {
            if (window.twttr && window.twttr.widgets) {
                window.twttr.widgets.load();
            } else {
                const script = document.createElement("script");
                script.src = "https://platform.twitter.com/widgets.js";
                script.async = true;
                document.body.appendChild(script);
            }
        };
        const timer = setTimeout(loadTwitter, 500);
        window.scrollTo(0, 0);
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.BackButton.show();
            tg.BackButton.onClick(() => window.location.href = '/');
        }
        return () => clearTimeout(timer);
    }, [article]);

    const { readTime, prevArticle, nextArticle, randomSuggestions, sideSuggestions, suggestions } = useMemo(() => {
        if (!article || !news.length) return {};
        const sorted = [...news].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        const idx = sorted.findIndex(n => n.id === article.id);
        const words = article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const time = Math.ceil(words / 200) || 1;
        const others = sorted.filter(n => n.id !== article.id);
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        return {
            readTime: time,
            prevArticle: idx < sorted.length - 1 ? sorted[idx + 1] : null,
            nextArticle: idx > 0 ? sorted[idx - 1] : null,
            suggestions: others,
            randomSuggestions: shuffled.slice(0, 3),
            sideSuggestions: shuffled.slice(3, 8),
        };
    }, [article, news]);

    const displayDate = useMemo(() => {
        const ts = article?.timestamp?.seconds || article?.lastUpdate?.seconds || article?.date?.seconds;
        if (ts) return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        return article?.date || "Récemment";
    }, [article]);

    // ── Partage natif ──
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.title,
                    url: window.location.href,
                });
            } catch {}
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    if (!article) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="h-16 md:h-20" />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto no-scrollbar">
                    <a href="/" className="hover:text-slate-900 transition-colors whitespace-nowrap">Accueil</a>
                    <ChevronRight size={12} />
                    <span className="text-slate-900 truncate max-w-[200px] md:max-w-none">{article.category || "Actualité"}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* ══════════ ARTICLE PRINCIPAL ══════════ */}
                    <article className="lg:col-span-8 h-fit">

                        {/* En-tête */}
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
                                {/* Auteur */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shadow-inner"
                                        style={{ backgroundColor: B24_BLUE }}>
                                        {article.authorName ? article.authorName[0] : 'B'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 italic">
                                            Par {article.authorName || "Rédaction Briefly"}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                            {displayDate}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 px-3 border-r border-slate-200">
                                        <Eye size={12} className="inline mr-1" /> {article.views || 0}
                                    </span>
                                    <div className="flex gap-1 px-1">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                                            title="Partager">
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-white rounded-xl transition-all hover:shadow-sm"
                                            title="Sauvegarder">
                                            <Bookmark size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Image principale */}
                        <figure className="mb-12 relative">
                            <img
                                src={article.imageUrl}
                                className="w-full h-auto object-cover rounded-xl shadow-lg"
                                alt={article.title}
                            />
                            <figcaption className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest italic">
                                Source : Briefly Digital Media
                            </figcaption>
                        </figure>

                        {/* ── CONTENU ARTICLE (styles Quill appliqués) ── */}
                        <div
                            className="article-body leading-[1.8] text-[17px] md:text-[19px] max-w-none mb-12"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* ── NEWSLETTER après le contenu ── */}
                        <NewsletterInline />

                        {/* Navigation précédent / suivant */}
                        <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-100 mb-12">
                            {prevArticle ? (
                                <a href={`/article/${prevArticle.id}`}
                                    className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                    <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <ChevronLeft size={14} /> Précédent
                                    </span>
                                    <span className="font-bold text-slate-900 leading-tight line-clamp-2 italic group-hover:text-indigo-600 transition-colors">
                                        {prevArticle.title}
                                    </span>
                                </a>
                            ) : <div />}
                            {nextArticle ? (
                                <a href={`/article/${nextArticle.id}`}
                                    className="group flex flex-col gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 text-right">
                                    <span className="flex items-center justify-end gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Suivant <ChevronRight size={14} />
                                    </span>
                                    <span className="font-bold text-slate-900 leading-tight line-clamp-2 italic group-hover:text-indigo-600 transition-colors">
                                        {nextArticle.title}
                                    </span>
                                </a>
                            ) : <div />}
                        </div>

                        {/* Suggestions aléatoires */}
                        <section className="mb-12">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Sparkles size={16} style={{ color: B24_BLUE }} /> Ça pourrait vous plaire
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(randomSuggestions || []).map(s => (
                                    <a key={s.id} href={`/article/${s.id}`} className="group block">
                                        <div className="aspect-video rounded-2xl overflow-hidden mb-3 shadow-sm border border-slate-100">
                                            <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {s.title}
                                        </h4>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Tags */}
                        <footer className="mt-8 pt-8 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2">
                                {['#Afrique', '#Actualité', '#Briefly', `#${article.category || 'Info'}`].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 rounded-full uppercase tracking-widest border border-slate-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    </article>

                    {/* ══════════ SIDEBAR ══════════ */}
                    <aside className="lg:col-span-4 space-y-12">

                        {/* Top articles */}
                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <TrendingUp size={20} style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Plus lus</h3>
                            </div>
                            <div className="space-y-8">
                                {(suggestions || []).slice(0, 5).map((s, i) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="flex gap-4 group no-underline">
                                        <span className="text-3xl font-serif font-black text-slate-200 group-hover:text-slate-900 transition-colors italic flex-shrink-0">
                                            0{i + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {s.title}
                                            </h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest">
                                                {s.category || "ACTU"}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Newsletter sidebar (desktop uniquement) */}
                        <section className="hidden lg:block">
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4">
                                        <Mail size={10} className="text-orange-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Newsletter</span>
                                    </div>
                                    <p className="text-white font-serif font-black italic text-lg leading-tight mb-4">
                                        L'info Briefly dans votre mail.
                                    </p>
                                    <a href="https://briefly-lilac.vercel.app/#newsletter"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 transition-colors rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                                        <Mail size={12} /> S'abonner
                                    </a>
                                </div>
                            </div>
                        </section>

                        {/* À découvrir */}
                        <section>
                            <div className="flex items-center gap-2 mb-8 border-b-2 border-slate-900 pb-2">
                                <Sparkles size={20} style={{ color: B24_BLUE }} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">À Découvrir</h3>
                            </div>
                            <div className="space-y-6">
                                {(sideSuggestions || []).map(s => (
                                    <a key={s.id} href={`/article/${s.id}`}
                                        className="block group bg-white p-4 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                                        <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                                            <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 italic transition-colors line-clamp-2">
                                            {s.title}
                                        </h4>
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