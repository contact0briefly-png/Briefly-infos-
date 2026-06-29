"use client";
import React, { useMemo, useEffect, useRef } from 'react';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { Clock, Eye, Share2, Bookmark, ChevronRight, TrendingUp, Sparkles, ChevronLeft, Mail, ArrowUp } from 'lucide-react';

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

/* ══════════════════════════════════════════════════════
   STYLES QUILL — couvre TOUS les formats de l'éditeur
══════════════════════════════════════════════════════ */
const QUILL_ARTICLE_STYLES = `

    /* ── Reset de base ── */
    .article-body * { box-sizing: border-box; }

    /* ── Titres ── */
    .article-body h1 {
        font-size: 2em; font-weight: 900; margin: 1.4em 0 .6em;
        line-height: 1.15; color: #0f172a; font-family: Georgia, serif;
    }
    .article-body h2 {
        font-size: 1.55em; font-weight: 800; margin: 1.3em 0 .55em;
        line-height: 1.25; color: #0f172a; font-family: Georgia, serif;
    }
    .article-body h3 {
        font-size: 1.25em; font-weight: 700; margin: 1.2em 0 .5em;
        line-height: 1.35; color: #0f172a;
    }
    .article-body h4 { font-size: 1.1em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }
    .article-body h5 { font-size: 1em;   font-weight: 700; margin: .9em 0 .4em; color: #334155; }
    .article-body h6 { font-size: .9em;  font-weight: 700; margin: .8em 0 .3em; color: #475569; }

    /* ── Paragraphes — supprimer les vides Quill ── */
    .article-body p {
        margin: 0 0 1em;
        line-height: 1.85;
        color: #1e293b;
    }
    .article-body p:empty { display: none; }
    .article-body p:has(> br:only-child) { display: none; }
    .article-body p > br:only-child { display: none; }

    /* ── Gras, italique, souligné, barré ── */
    .article-body strong,
    .article-body b,
    .article-body [style*="font-weight: bold"],
    .article-body [style*="font-weight:bold"] {
        font-weight: 800 !important;
        color: inherit;
    }
    .article-body em,
    .article-body i { font-style: italic; }
    .article-body u,
    .article-body [style*="text-decoration: underline"] { text-decoration: underline; }
    .article-body s,
    .article-body [style*="text-decoration: line-through"] { text-decoration: line-through; }

    /* ── COULEURS DE TEXTE — préserver les styles inline Quill ── */
    .article-body [style*="color"] { color: inherit; }
    .article-body span[style] { display: inline; }

    /* ── COULEURS DE FOND ── */
    .article-body [style*="background-color"] {
        padding: 1px 4px;
        border-radius: 3px;
    }

    /* ── Tailles de police Quill ── */
    .article-body .ql-size-small,
    .article-body [style*="font-size: 0.75em"] { font-size: 0.82em !important; }
    .article-body .ql-size-large,
    .article-body [style*="font-size: 1.5em"]  { font-size: 1.3em  !important; line-height: 1.5; }
    .article-body .ql-size-huge,
    .article-body [style*="font-size: 2.5em"]  { font-size: 1.7em  !important; font-weight: 800; line-height: 1.3; }

    /* ── Polices Quill ── */
    .article-body .ql-font-serif { font-family: Georgia, 'Times New Roman', serif; }
    .article-body .ql-font-monospace { font-family: 'Courier New', Courier, monospace; }

    /* ── Alignements ── */
    .article-body .ql-align-center,
    .article-body [style*="text-align: center"] { text-align: center; }
    .article-body .ql-align-right,
    .article-body [style*="text-align: right"]  { text-align: right; }
    .article-body .ql-align-justify,
    .article-body [style*="text-align: justify"] { text-align: justify; }

    /* ── Listes ── */
    .article-body ul,
    .article-body ol {
        padding-left: 1.8em;
        margin: .8em 0 1.2em;
    }
    .article-body ul { list-style: disc; }
    .article-body ol { list-style: decimal; }
    .article-body li {
        margin-bottom: .45em;
        line-height: 1.75;
        color: #1e293b;
    }
    .article-body li::marker { color: #6366f1; font-weight: 700; }

    /* Listes Quill (ql-indent) */
    .article-body .ql-indent-1 { padding-left: 2.5em; }
    .article-body .ql-indent-2 { padding-left: 5em; }
    .article-body .ql-indent-3 { padding-left: 7.5em; }
    .article-body .ql-indent-4 { padding-left: 10em; }

    /* ── Citation (blockquote) ── */
    .article-body blockquote {
        border-left: 4px solid #6366f1;
        margin: 2em 0;
        padding: 1em 1.6em;
        background: linear-gradient(135deg, #f8f7ff 0%, #f0f0ff 100%);
        border-radius: 0 14px 14px 0;
        font-style: italic;
        color: #374151;
        font-size: 1.08em;
        line-height: 1.8;
        position: relative;
    }
    .article-body blockquote::before {
        content: '"';
        position: absolute;
        top: -10px; left: 12px;
        font-size: 4em;
        color: #6366f1;
        opacity: .15;
        font-family: Georgia, serif;
        line-height: 1;
    }

    /* ── Code ── */
    .article-body pre {
        background: #1e1e2e;
        color: #cdd6f4;
        border-radius: 14px;
        padding: 1.4em 1.6em;
        font-family: 'Fira Code', 'Courier New', monospace;
        font-size: .88em;
        overflow-x: auto;
        margin: 1.4em 0;
        line-height: 1.7;
        border: 1px solid #2d2d3d;
    }
    .article-body code {
        background: #f1f5f9;
        color: #6366f1;
        padding: 2px 7px;
        border-radius: 5px;
        font-family: 'Fira Code', monospace;
        font-size: .88em;
        border: 1px solid #e2e8f0;
    }
    .article-body pre code {
        background: none;
        color: inherit;
        padding: 0;
        border: none;
        font-size: inherit;
    }

    /* ── Images ── */
    .article-body img {
        max-width: 100%;
        height: auto;
        border-radius: 14px;
        margin: 1.4em auto;
        display: block;
        box-shadow: 0 6px 28px rgba(0,0,0,.12);
    }

    /* ── Liens ── */
    .article-body a {
        color: #4f46e5;
        text-decoration: underline;
        text-underline-offset: 3px;
        font-weight: 600;
        transition: opacity .2s;
    }
    .article-body a:hover { opacity: .75; }

    /* ── Séparateur ── */
    .article-body hr {
        border: none;
        border-top: 2px solid #e2e8f0;
        margin: 2.5em 0;
    }

    /* ── Exposant / indice ── */
    .article-body sub { vertical-align: sub;   font-size: .75em; }
    .article-body sup { vertical-align: super; font-size: .75em; }

 /* ══ Embeds sociaux (TikTok, Twitter, Instagram) ══ */
    .article-body .tiktok-wrapper {
        margin: 2em auto;
        display: flex;
        justify-content: center;
        max-width: 605px;
    }
    .article-body blockquote.tiktok-embed {
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
    }
    .article-body blockquote.twitter-tweet {
        margin: 1.5em auto !important;
    }
    .article-body blockquote.instagram-media {
        margin: 1.5em auto !important;
    }
    /* ══════════════════════════
       VIDÉOS YOUTUBE / IFRAMES
    ══════════════════════════ */
    .article-body .video-wrapper {
        position: relative;
        width: 100%;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        border-radius: 14px;
        margin: 2em 0;
        box-shadow: 0 8px 32px rgba(0,0,0,.2);
        background: #000;
    }
    .article-body .video-wrapper iframe {
        position: absolute;
        top: 0; left: 0;
        width: 100% !important;
        height: 100% !important;
        border: none;
        border-radius: 14px;
    }
    .article-body iframe:not(.video-wrapper iframe),
    .article-body .ql-video {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 9;
        height: auto;
        min-height: 220px;
        border-radius: 14px;
        margin: 2em auto;
        border: none;
        box-shadow: 0 8px 32px rgba(0,0,0,.2);
    }

    /* ══════════════════════════
       TYPOGRAPHIE FLUIDE
    ══════════════════════════ */
    @media (max-width: 640px) {
        .article-body { font-size: 16px !important; }
        .article-body h1 { font-size: 1.7em; }
        .article-body h2 { font-size: 1.35em; }
        .article-body h3 { font-size: 1.15em; }
        .article-body .ql-size-huge { font-size: 1.4em !important; }
        .article-body .ql-size-large { font-size: 1.15em !important; }
        .article-body blockquote { padding: .8em 1em; font-size: 1em; }
    }
    @media (min-width: 1024px) {
        .article-body { font-size: 19px !important; }
    }
`;

/* ══════════════════════════════════════
   SANITIZE HTML
══════════════════════════════════════ */
const sanitizeContent = (html) => {
    if (!html) return '';
    let result = html;

    // 1. Supprimer les paragraphes vides Quill
    result = result.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');
    result = result.replace(/<p>\s*<\/p>/gi, '');
    result = result.replace(/(<p>\s*<br\s*\/?>\s*<\/p>\s*){2,}/gi, '');

    // 2. Préserver les styles inline (couleurs, tailles)
    // Les styles inline Quill sont déjà dans le HTML — on les laisse passer

    // 3. Envelopper les iframes YouTube dans video-wrapper
    result = result.replace(
        /(<iframe[^>]*?src="https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[^"]*"[^>]*?>(?:<\/iframe>)?)/gi,
        (match) => {
            if (match.includes('video-wrapper')) return match;
            return `<div class="video-wrapper">${match.includes('</iframe>') ? match : match + '</iframe>'}</div>`;
        }
    );

    // 4. Ajouter attributs allow + allowfullscreen
    result = result.replace(
        /<iframe([^>]*?)src="(https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[^"]*)"([^>]*?)(?:><\/iframe>|>)/gi,
        (match, before, src, after) => {
            let attrs = (before + ' ' + after)
                .replace(/\s*allowfullscreen(?:="[^"]*")?/gi, '')
                .replace(/\s*allow="[^"]*"/gi, '')
                .replace(/\s*frameborder="[^"]*"/gi, '')
                .replace(/\s*width="[^"]*"/gi, '')
                .replace(/\s*height="[^"]*"/gi, '')
                .trim();
            const cleanSrc = src.replace('www.youtube.com', 'www.youtube-nocookie.com');
            return `<iframe ${attrs} src="${cleanSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        }
    );

    return result;
};
/* ══════════════════════════════════════
   ARTICLE CONTENT — post-rendu DOM
══════════════════════════════════════ */
const ArticleContent = ({ html }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        // ── 1. Styles inline (couleurs Quill) ──
        ref.current.querySelectorAll('span[style]').forEach(span => {
            const style = span.getAttribute('style') || '';
            if (style.includes('color') || style.includes('background')) {
                span.style.cssText = style;
            }
        });

        // ── 2. Iframes YouTube ──
        ref.current.querySelectorAll('iframe').forEach(iframe => {
            if (!iframe.parentElement?.classList.contains('video-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'video-wrapper';
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.appendChild(iframe);
            }
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.removeAttribute('height');
            iframe.removeAttribute('width');
            const src = iframe.getAttribute('src') || '';
            if (src.includes('youtube.com') && !src.includes('youtube-nocookie')) {
                iframe.setAttribute('src', src.replace('www.youtube.com', 'www.youtube-nocookie.com'));
            }
        });

        // ── 3. Images responsive ──
        ref.current.querySelectorAll('img').forEach(img => {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        });

        // ── 4. Embeds TikTok ──
        const tiktokBlocks = ref.current.querySelectorAll('blockquote.tiktok-embed');
        if (tiktokBlocks.length > 0) {
            // Envelopper chaque blockquote TikTok pour le style
            tiktokBlocks.forEach(block => {
                if (!block.parentElement?.classList.contains('tiktok-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'tiktok-wrapper';
                    wrapper.style.cssText = 'margin: 1.5em auto; display: flex; justify-content: center;';
                    block.parentNode.insertBefore(wrapper, block);
                    wrapper.appendChild(block);
                }
            });

            // Supprimer l'ancien script TikTok s'il existe
            const oldScript = document.querySelector('script[src*="tiktok.com/embed.js"]');
            if (oldScript) oldScript.remove();

            // Recharger le script TikTok pour activer les embeds
            const script = document.createElement('script');
            script.src = 'https://www.tiktok.com/embed.js';
            script.async = true;
            script.onload = () => {
                // Forcer le rechargement des widgets TikTok si l'API est disponible
                if (window.__tiktok_embed_initialized) {
                    try {
                        window.instgrm?.Embeds?.process?.();
                    } catch {}
                }
            };
            document.body.appendChild(script);
        }

        // ── 5. Embeds Twitter/X ──
        const twitterBlocks = ref.current.querySelectorAll('blockquote.twitter-tweet');
        if (twitterBlocks.length > 0) {
            if (window.twttr?.widgets) {
                window.twttr.widgets.load(ref.current);
            } else {
                const script = document.createElement('script');
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                document.body.appendChild(script);
            }
        }

        // ── 6. Embeds Instagram ──
        const instaBlocks = ref.current.querySelectorAll('blockquote.instagram-media');
        if (instaBlocks.length > 0) {
            const oldScript = document.querySelector('script[src*="instagram.com/embed.js"]');
            if (oldScript) oldScript.remove();
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        }

    }, [html]);

    return (
        <div
            ref={ref}
            className="article-body max-w-none mb-16"
            style={{ fontSize: '17px', lineHeight: '1.85', color: '#1e293b' }}
            dangerouslySetInnerHTML={{ __html: sanitizeContent(html) }}
        />
    );
};
/* ══════════════════════════════════════
   NEWSLETTER
══════════════════════════════════════ */
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
        <section className="my-14 relative overflow-hidden rounded-3xl">
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
                    <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
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

/* ══════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════ */
const ScrollToTop = () => {
    const [visible, setVisible] = React.useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 600);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    if (!visible) return null;
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-6 z-50 w-11 h-11 bg-slate-900 hover:bg-slate-700 text-white rounded-2xl flex items-center justify-center shadow-xl transition-all"
            title="Retour en haut">
            <ArrowUp size={18} />
        </button>
    );
};

/* ══════════════════════════════════════
   ARTICLE VIEW — composant principal
══════════════════════════════════════ */
const ArticleView = ({ article, news = [], B24_BLUE }) => {

    // Injection styles Quill
    useEffect(() => {
        const id = 'quill-article-styles';
        if (!document.getElementById(id)) {
            const style = document.createElement('style');
            style.id = id;
            style.textContent = QUILL_ARTICLE_STYLES;
            document.head.appendChild(style);
        }
    }, []);

    // Compteur de vues
    useEffect(() => {
        if (!article?.id) return;
        updateDoc(
            doc(db, 'artifacts', 'bbriefly-7e3b8', 'public', 'data', 'news', article.id),
            { views: increment(1) }
        ).catch(() => {});
    }, [article?.id]);

    // Twitter + scroll + Telegram
    useEffect(() => {
        const load = () => {
            if (window.twttr?.widgets) window.twttr.widgets.load();
            else {
                const s = document.createElement('script');
                s.src = 'https://platform.twitter.com/widgets.js';
                s.async = true;
                document.body.appendChild(s);
            }
        };
        const t = setTimeout(load, 600);
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.BackButton.show();
            tg.BackButton.onClick(() => window.location.href = '/');
        }
        return () => clearTimeout(t);
    }, [article]);

    const { readTime, prevArticle, nextArticle, randomSuggestions, sideSuggestions, suggestions } = useMemo(() => {
        if (!article || !news.length) return {};
        const sorted = [...news].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        const idx = sorted.findIndex(n => n.id === article.id);
        const words = article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const others = sorted.filter(n => n.id !== article.id);
        const shuffled = [...others].sort(() => 0.5 - Math.random());
        return {
            readTime: Math.ceil(words / 200) || 1,
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
        return article?.date || 'Récemment';
    }, [article]);

    // Partage robuste
    const [shareLabel, setShareLabel] = React.useState(null);
    const handleShare = async () => {
        const url = window.location.href;
        const text = article.title;
        if (navigator.share) {
            try { await navigator.share({ title: text, text, url }); return; }
            catch (e) { if (e.name === 'AbortError') return; }
        }
        try {
            await navigator.clipboard.writeText(url);
            setShareLabel('✓ Copié !');
            setTimeout(() => setShareLabel(null), 2500);
            return;
        } catch {}
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try {
            document.execCommand('copy');
            setShareLabel('✓ Copié !');
            setTimeout(() => setShareLabel(null), 2500);
        } catch {}
        document.body.removeChild(ta);
    };

    if (!article) return null;

    return (
        <div className="bg-white min-h-screen">
            <div className="h-16 md:h-20" />
            <ScrollToTop />

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 overflow-x-auto no-scrollbar">
                    <a href="/" className="hover:text-slate-900 transition-colors whitespace-nowrap">Accueil</a>
                    <ChevronRight size={12} />
                    <a
                        href={`/?category=${encodeURIComponent(article.category || '')}`}
                        className="hover:text-slate-900 transition-colors truncate max-w-[200px] md:max-w-none"
                    >
                        {article.category || 'Actualité'}
                    </a>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">

                    {/* ══════════ ARTICLE PRINCIPAL ══════════ */}
                    <article className="lg:col-span-8">

                        {/* En-tête */}
                        <header className="mb-10">
                            <div className="flex items-center gap-3 mb-6 flex-wrap">
                                <span className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                                    {article.category || 'À LA UNE'}
                                </span>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                                    <Clock size={11} /> {readTime} min de lecture
                                </div>
                            </div>

                            <h1 className="font-serif font-black text-[28px] md:text-[42px] lg:text-[52px] text-slate-950 leading-[1.1] mb-8 italic tracking-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-slate-100">
                                {/* Auteur */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                                        style={{ backgroundColor: B24_BLUE }}>
                                        {article.authorName ? article.authorName[0].toUpperCase() : 'B'}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-black text-slate-900 italic leading-tight">
                                            Par {article.authorName || 'Rédaction Briefly'}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            {displayDate}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 pr-3 border-r border-slate-200 flex items-center gap-1">
                                        <Eye size={11} /> {(article.views || 0).toLocaleString('fr-FR')}
                                    </span>
                                    <button
                                        onClick={handleShare}
                                        className="p-1.5 hover:bg-white rounded-xl transition-all hover:shadow-sm flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
                                        title="Partager">
                                        <Share2 size={15} />
                                        {shareLabel && (
                                            <span className="text-[9px] font-black text-green-600 whitespace-nowrap">{shareLabel}</span>
                                        )}
                                    </button>
                                    <button
                                        className="p-1.5 hover:bg-white rounded-xl transition-all hover:shadow-sm text-slate-600 hover:text-slate-900"
                                        title="Sauvegarder">
                                        <Bookmark size={15} />
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Image principale */}
                        <figure className="mb-12">
                            <img
                                src={article.imageUrl}
                                className="w-full h-auto object-cover rounded-2xl shadow-md"
                                alt={article.title}
                                loading="eager"
                            />
                            <figcaption className="text-[10px] text-center mt-3 text-slate-400 font-bold uppercase tracking-widest italic">
                                Briefly Digital Media
                            </figcaption>
                        </figure>

                        {/* ══ CONTENU DE L'ARTICLE ══ */}
                        <ArticleContent html={article.content} />

                        {/* Newsletter */}
                        <NewsletterInline />

                        {/* Navigation précédent / suivant */}
                        <div className="grid grid-cols-2 gap-3 py-8 border-y border-slate-100 mb-12">
                            {prevArticle ? (
                                <a href={`/article/${prevArticle.id}`}
                                    className="group flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <ChevronLeft size={12} /> Article précédent
                                    </span>
                                    <span className="font-bold text-slate-900 leading-snug line-clamp-2 text-[13px] italic group-hover:text-indigo-600 transition-colors">
                                        {prevArticle.title}
                                    </span>
                                </a>
                            ) : <div />}
                            {nextArticle ? (
                                <a href={`/article/${nextArticle.id}`}
                                    className="group flex flex-col gap-1.5 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 text-right">
                                    <span className="flex items-center justify-end gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Article suivant <ChevronRight size={12} />
                                    </span>
                                    <span className="font-bold text-slate-900 leading-snug line-clamp-2 text-[13px] italic group-hover:text-indigo-600 transition-colors">
                                        {nextArticle.title}
                                    </span>
                                </a>
                            ) : <div />}
                        </div>

                        {/* Suggestions */}
                        <section className="mb-12">
                            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <Sparkles size={14} style={{ color: B24_BLUE }} /> Ça pourrait vous plaire
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {(randomSuggestions || []).map(s => (
                                    <a key={s.id} href={`/article/${s.id}`} className="group block">
                                        <div className="aspect-video rounded-xl overflow-hidden mb-2.5 shadow-sm border border-slate-100">
                                            <img
                                                src={s.imageUrl} alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-[13px] leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {s.title}
                                        </h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {s.category || 'ACTU'}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Tags */}
                        <footer className="pt-6 border-t border-slate-100">
                            <div className="flex flex-wrap gap-2">
                                {['#Afrique', '#Actualité', '#Briefly', `#${article.category || 'Info'}`].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-[9px] font-black text-slate-400 rounded-full uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </footer>
                    </article>

                    {/* ══════════ SIDEBAR ══════════ */}
                    <aside className="lg:col-span-4 space-y-10">

                        {/* Top articles */}
                        <section className="sticky top-24">
                            <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-900 pb-2">
                                <TrendingUp size={16} style={{ color: B24_BLUE }} />
                                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Plus lus</h3>
                            </div>
                            <div className="space-y-6">
                                {(suggestions || []).slice(0, 5).map((s, i) => (
                                    <a key={s.id} href={`/article/${s.id}`} className="flex gap-3 group no-underline">
                                        <span className="text-2xl font-serif font-black text-slate-150 group-hover:text-slate-300 transition-colors italic flex-shrink-0 leading-none mt-1"
                                            style={{ color: '#e8e8ef' }}>
                                            0{i + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 text-[13px]">
                                                {s.title}
                                            </h4>
                                            <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-widest">
                                                {s.category || 'ACTU'}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Newsletter sidebar desktop */}
                            <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-5 mt-10">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-orange-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full mb-3">
                                        <Mail size={9} className="text-orange-400" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Newsletter</span>
                                    </div>
                                    <p className="text-white font-serif font-black italic text-[16px] leading-tight mb-4">
                                        L'info Briefly dans votre mail.
                                    </p>
                                    <a href="https://briefly-lilac.vercel.app/#newsletter"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 transition-colors rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                                        <Mail size={11} /> S'abonner
                                    </a>
                                </div>
                            </div>

                            {/* À découvrir */}
                            <div className="mt-10">
                                <div className="flex items-center gap-2 mb-6 border-b-2 border-slate-900 pb-2">
                                    <Sparkles size={16} style={{ color: B24_BLUE }} />
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">À Découvrir</h3>
                                </div>
                                <div className="space-y-4">
                                    {(sideSuggestions || []).slice(0, 4).map(s => (
                                        <a key={s.id} href={`/article/${s.id}`}
                                            className="flex gap-3 group items-start">
                                            <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={s.imageUrl} alt=""
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-600 italic transition-colors line-clamp-2 text-[12px]">
                                                    {s.title}
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {s.category || 'ACTU'}
                                                </p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ArticleView;