"use client";
import React, { useMemo, useEffect, useRef } from 'react';
import { getFirestore, doc, updateDoc, increment } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import {
    Clock, Eye, Share2, ChevronRight, TrendingUp,
    Sparkles, ChevronLeft, Mail, ArrowUp, Link2, Check
} from 'lucide-react';

const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db  = getFirestore(app);

const BREVO_ACTION = "https://b33f5b02.sibforms.com/serve/MUIFAGBxCfyEwfx-cB0M9i9gOYvlwv3b9XmULA8_jGaWHLuG5zbH6c2QvO928ogIkVBjF1c1mj7KCG06Zfye3McOWoe9G04JeD_TsTFM9EDSz7QYpppQ-u5X9E5udLQ7RLKl0QOuqiTCBG1jawLH4u1WYJNwxQ1OrCbFri0xOGjcxz6ye7PhaJEy9ibaiQ4LS_foT82lqz32UOJdBw==";

/* ════════════════════════════════════════
   STYLES QUILL — rendu fidèle à l'éditeur
════════════════════════════════════════ */
const QUILL_STYLES = `
    .ab * { box-sizing: border-box; }

    .ab h1 { font-family: Georgia,serif; font-size: 2em; font-weight: 900; margin: 1.4em 0 .6em; line-height: 1.15; color: #0f172a; }
    .ab h2 { font-family: Georgia,serif; font-size: 1.55em; font-weight: 800; margin: 1.3em 0 .55em; line-height: 1.25; color: #0f172a; }
    .ab h3 { font-size: 1.25em; font-weight: 700; margin: 1.2em 0 .5em; line-height: 1.35; color: #0f172a; }
    .ab h4 { font-size: 1.1em; font-weight: 700; margin: 1em 0 .4em; color: #1e293b; }

    .ab p { margin: 0 0 1em; line-height: 1.85; color: #1e293b; }
    .ab p:empty { display: none; }
    .ab p:has(> br:only-child) { display: none; }
    .ab p > br:only-child { display: none; }

    .ab strong, .ab b,
    .ab [style*="font-weight: bold"],
    .ab [style*="font-weight:bold"] { font-weight: 800 !important; }
    .ab em, .ab i { font-style: italic; }
    .ab u { text-decoration: underline; }
    .ab s { text-decoration: line-through; }

    .ab span[style] { display: inline; }
    .ab [style*="background-color"] { padding: 1px 4px; border-radius: 3px; }

    .ab .ql-size-small  { font-size: .82em !important; }
    .ab .ql-size-large  { font-size: 1.3em !important; line-height: 1.5; }
    .ab .ql-size-huge   { font-size: 1.7em !important; font-weight: 800; line-height: 1.3; }

    .ab .ql-font-serif     { font-family: Georgia,'Times New Roman',serif; }
    .ab .ql-font-monospace { font-family: 'Courier New',Courier,monospace; }

    .ab .ql-align-center,
    .ab [style*="text-align: center"] { text-align: center; }
    .ab .ql-align-right,
    .ab [style*="text-align: right"]  { text-align: right; }
    .ab .ql-align-justify             { text-align: justify; }

    .ab ul { list-style: disc;    padding-left: 1.8em; margin: .8em 0 1.2em; }
    .ab ol { list-style: decimal; padding-left: 1.8em; margin: .8em 0 1.2em; }
    .ab li { margin-bottom: .45em; line-height: 1.75; color: #1e293b; }
    .ab li::marker { color: #334155; font-weight: 700; }

    .ab .ql-indent-1 { padding-left: 2.5em; }
    .ab .ql-indent-2 { padding-left: 5em; }
    .ab .ql-indent-3 { padding-left: 7.5em; }

    .ab blockquote:not(.tiktok-embed):not(.twitter-tweet):not(.instagram-media) {
        border-left: 3px solid #0f172a;
        margin: 2em 0;
        padding: .8em 1.4em;
        background: #f8f8f8;
        font-style: italic;
        color: #374151;
        font-size: 1.1em;
        line-height: 1.75;
    }

    .ab pre {
        background: #1e1e2e; color: #cdd6f4;
        border-radius: 10px; padding: 1.2em 1.4em;
        font-family: monospace; font-size: .87em;
        overflow-x: auto; margin: 1.4em 0; line-height: 1.7;
    }
    .ab code {
        background: #f1f5f9; color: #334155;
        padding: 2px 6px; border-radius: 4px;
        font-family: monospace; font-size: .88em;
    }
    .ab pre code { background: none; color: inherit; padding: 0; }

    .ab img {
        max-width: 100%; height: auto;
        margin: 1.4em auto; display: block;
        box-shadow: 0 2px 16px rgba(0,0,0,.08);
    }

    .ab a { color: #1e40af; text-decoration: underline; text-underline-offset: 3px; font-weight: 600; }
    .ab a:hover { color: #1e3a8a; }

    .ab hr { border: none; border-top: 1px solid #e2e8f0; margin: 2.5em 0; }
    .ab sub { vertical-align: sub;   font-size: .75em; }
    .ab sup { vertical-align: super; font-size: .75em; }

    /* ── Embeds sociaux ── */
    .ab .tiktok-wrapper { margin: 2em auto; display: flex; justify-content: center; max-width: 605px; }
    .ab blockquote.tiktok-embed    { margin: 0 !important; border: none !important; background: transparent !important; padding: 0 !important; }
    .ab blockquote.twitter-tweet   { margin: 1.5em auto !important; }
    .ab blockquote.instagram-media { margin: 1.5em auto !important; }

    /* ── Vidéos YouTube ── */
    .ab .video-wrapper {
        position: relative; width: 100%; padding-bottom: 56.25%; height: 0;
        overflow: hidden; margin: 2em 0; background: #000;
    }
    .ab .video-wrapper iframe {
        position: absolute; top: 0; left: 0;
        width: 100% !important; height: 100% !important; border: none;
    }
    .ab iframe:not(.video-wrapper iframe), .ab .ql-video {
        display: block; width: 100%; aspect-ratio: 16/9;
        height: auto; min-height: 220px; border: none; margin: 2em auto;
    }

    /* ── Responsive ── */
    @media (max-width: 640px) {
        .ab { font-size: 16px !important; }
        .ab h1 { font-size: 1.7em; }
        .ab h2 { font-size: 1.35em; }
        .ab blockquote:not(.tiktok-embed):not(.twitter-tweet):not(.instagram-media) { padding: .7em 1em; }
    }
    @media (min-width: 1024px) {
        .ab { font-size: 19px !important; }
    }
`;

/* ════════════════
   SANITIZE HTML
════════════════ */
const sanitize = (html) => {
    if (!html) return '';
    let r = html;
    r = r.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '');
    r = r.replace(/<p>\s*<\/p>/gi, '');
    r = r.replace(
        /(<iframe[^>]*?src="https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[^"]*"[^>]*?>(?:<\/iframe>)?)/gi,
        (m) => m.includes('video-wrapper') ? m : `<div class="video-wrapper">${m.includes('</iframe>') ? m : m + '</iframe>'}</div>`
    );
    r = r.replace(
        /<iframe([^>]*?)src="(https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com\/embed\/[^"]*)"([^>]*?)(?:><\/iframe>|>)/gi,
        (match, b, src, a) => {
            let attrs = (b + ' ' + a)
                .replace(/\s*allowfullscreen(?:="[^"]*")?/gi, '')
                .replace(/\s*allow="[^"]*"/gi, '')
                .replace(/\s*frameborder="[^"]*"/gi, '')
                .replace(/\s*width="[^"]*"/gi, '')
                .replace(/\s*height="[^"]*"/gi, '')
                .trim();
            const s = src.replace('www.youtube.com', 'www.youtube-nocookie.com');
            return `<iframe ${attrs} src="${s}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        }
    );
    return r;
};

/* ════════════════════════════════
   ARTICLE CONTENT — post-rendu
════════════════════════════════ */
const ArticleContent = ({ html }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        // Styles inline Quill
        ref.current.querySelectorAll('span[style]').forEach(s => {
            const st = s.getAttribute('style') || '';
            if (st.includes('color') || st.includes('background')) s.style.cssText = st;
        });
        // YouTube iframes
        ref.current.querySelectorAll('iframe').forEach(f => {
            if (!f.parentElement?.classList.contains('video-wrapper')) {
                const w = document.createElement('div');
                w.className = 'video-wrapper';
                f.parentNode.insertBefore(w, f);
                w.appendChild(f);
            }
            f.setAttribute('frameborder', '0');
            f.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            f.setAttribute('allowfullscreen', 'true');
            f.removeAttribute('height'); f.removeAttribute('width');
            const src = f.getAttribute('src') || '';
            if (src.includes('youtube.com') && !src.includes('youtube-nocookie'))
                f.setAttribute('src', src.replace('www.youtube.com', 'www.youtube-nocookie.com'));
        });
        // Images
        ref.current.querySelectorAll('img').forEach(i => { i.style.maxWidth = '100%'; i.style.height = 'auto'; });
        // TikTok
        const tiktoks = ref.current.querySelectorAll('blockquote.tiktok-embed');
        if (tiktoks.length) {
            tiktoks.forEach(b => {
                if (!b.parentElement?.classList.contains('tiktok-wrapper')) {
                    const w = document.createElement('div');
                    w.className = 'tiktok-wrapper';
                    b.parentNode.insertBefore(w, b);
                    w.appendChild(b);
                }
            });
            document.querySelector('script[src*="tiktok.com/embed.js"]')?.remove();
            const sc = document.createElement('script');
            sc.src = 'https://www.tiktok.com/embed.js'; sc.async = true;
            document.body.appendChild(sc);
        }
        // Twitter
        const tweets = ref.current.querySelectorAll('blockquote.twitter-tweet');
        if (tweets.length) {
            if (window.twttr?.widgets) window.twttr.widgets.load(ref.current);
            else {
                const sc = document.createElement('script');
                sc.src = 'https://platform.twitter.com/widgets.js'; sc.async = true;
                document.body.appendChild(sc);
            }
        }
        // Instagram
        const instas = ref.current.querySelectorAll('blockquote.instagram-media');
        if (instas.length) {
            document.querySelector('script[src*="instagram.com/embed.js"]')?.remove();
            const sc = document.createElement('script');
            sc.src = 'https://www.instagram.com/embed.js'; sc.async = true;
            document.body.appendChild(sc);
        }
    }, [html]);

    return (
        <div ref={ref} className="ab max-w-none mb-12"
            style={{ fontSize: '17px', lineHeight: '1.85', color: '#1e293b' }}
            dangerouslySetInnerHTML={{ __html: sanitize(html) }} />
    );
};

/* ════════════════
   NEWSLETTER
════════════════ */
const Newsletter = () => {
    const [email,   setEmail]   = React.useState('');
    const [status,  setStatus]  = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) { setStatus('err'); return; }
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('EMAIL', email); fd.append('email_address_check', ''); fd.append('locale', 'fr');
            await fetch(BREVO_ACTION, { method: 'POST', body: fd, mode: 'no-cors' });
            setStatus('ok'); setEmail('');
        } catch { setStatus('err'); } finally { setLoading(false); }
    };

    return (
        <div className="border border-slate-200 p-6 my-12">
            <div className="flex items-start gap-4 mb-4">
                <Mail size={20} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                    <div className="text-[11px] font-black uppercase tracking-[.18em] text-slate-900 mb-1">
                        Newsletter Briefly
                    </div>
                    <div className="text-[12px] text-slate-500 leading-relaxed">
                        Recevez les dernières actualités directement dans votre boîte mail. Gratuit, sans spam.
                    </div>
                </div>
            </div>
            {status === 'ok' ? (
                <div className="flex items-center gap-2 text-[13px] font-bold text-green-700 bg-green-50 px-4 py-3">
                    <Check size={16} /> Inscription confirmée — merci !
                </div>
            ) : (
                <form onSubmit={submit} className="flex gap-0 mt-4">
                    <input type="email" value={email} required
                        onChange={e => { setEmail(e.target.value); setStatus(null); }}
                        placeholder="votre@email.com"
                        className="flex-1 border border-slate-300 border-r-0 px-4 py-2.5 text-[13px] font-medium outline-none focus:border-slate-900 transition-colors"
                    />
                    <button type="submit" disabled={loading}
                        className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50 whitespace-nowrap">
                        {loading ? '…' : "S'inscrire"}
                    </button>
                </form>
            )}
            {status === 'err' && <p className="text-[11px] text-red-600 font-medium mt-2">Adresse email invalide.</p>}
        </div>
    );
};

/* ════════════════
   SCROLL TO TOP
════════════════ */
const ScrollTop = () => {
    const [v, setV] = React.useState(false);
    useEffect(() => {
        const fn = () => setV(window.scrollY > 600);
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);
    if (!v) return null;
    return (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-5 z-50 w-10 h-10 bg-slate-900 hover:bg-slate-700 text-white flex items-center justify-center shadow-lg transition-all"
            title="Retour en haut">
            <ArrowUp size={17} />
        </button>
    );
};

/* ════════════════════════════════════
   BOUTONS DE PARTAGE — 4 plateformes
════════════════════════════════════ */
const ShareButtons = ({ title }) => {
    const [copied, setCopied] = React.useState(false);
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const share = async (platform) => {
        const encoded = encodeURIComponent(url);
        const text    = encodeURIComponent(title);
        const map = {
            native:    () => navigator.share?.({ title, url }).catch(() => {}),
            copy:      async () => {
                try { await navigator.clipboard.writeText(url); } catch {
                    const ta = document.createElement('textarea');
                    ta.value = url; ta.style.cssText = 'position:fixed;opacity:0';
                    document.body.appendChild(ta); ta.select();
                    document.execCommand('copy'); document.body.removeChild(ta);
                }
                setCopied(true); setTimeout(() => setCopied(false), 2500);
            },
            whatsapp:  () => window.open(`https://wa.me/?text=${text}%20${encoded}`, '_blank'),
            facebook:  () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank'),
            twitter:   () => window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encoded}`, '_blank'),
            telegram:  () => window.open(`https://t.me/share/url?url=${encoded}&text=${text}`, '_blank'),
            linkedin:  () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, '_blank'),
        };
        await map[platform]?.();
    };

    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);

    return (
        <div className="border-t border-b border-slate-200 py-5 my-8">
            <div className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500 mb-4">
                Partager cet article
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {/* Partage natif mobile */}
                {isMobile && (
                    <button onClick={() => share('native')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-[11px] font-bold uppercase tracking-wide transition-colors">
                        <Share2 size={13} /> Partager
                    </button>
                )}
                {/* WhatsApp */}
                <button onClick={() => share('whatsapp')}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.551 4.197 1.595 6.035L0 24l6.105-1.602a11.832 11.832 0 005.94 1.6c6.632 0 12.05-5.418 12.05-12.048 0-3.213-1.252-6.234-3.525-8.508"/>
                    </svg>
                    WhatsApp
                </button>
                {/* Facebook */}
                <button onClick={() => share('facebook')}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#1877f2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
                {/* Twitter / X */}
                <button onClick={() => share('twitter')}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#000">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X / Twitter
                </button>
                {/* Telegram */}
                <button onClick={() => share('telegram')}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-all">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#229ed9">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-1.97 9.28c-.148.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.307.28-.595.28l.213-3.033 5.518-4.985c.24-.213-.054-.33-.373-.12l-6.82 4.295-2.946-.92c-.64-.203-.654-.64.135-.954l11.503-4.435c.533-.193 1 .127.868.891z"/>
                    </svg>
                    Telegram
                </button>
                {/* Copier le lien */}
                <button onClick={() => share('copy')}
                    className={`flex items-center gap-2 px-4 py-2 border text-[11px] font-bold transition-all ${
                        copied
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-700'
                    }`}>
                    {copied ? <Check size={13} /> : <Link2 size={13} />}
                    {copied ? 'Lien copié !' : 'Copier le lien'}
                </button>
            </div>
        </div>
    );
};

/* ════════════════════════════
   ARTICLE VIEW — principal
════════════════════════════ */
const ArticleView = ({ article, news = [], B24_BLUE }) => {

    /* Inject styles Quill */
    useEffect(() => {
        const ID = 'quill-ab-styles';
        if (!document.getElementById(ID)) {
            const el = document.createElement('style');
            el.id = ID; el.textContent = QUILL_STYLES;
            document.head.appendChild(el);
        }
    }, []);

    /* Compteur vues */
    useEffect(() => {
        if (!article?.id) return;
        updateDoc(doc(db, 'artifacts', 'bbriefly-7e3b8', 'public', 'data', 'news', article.id), { views: increment(1) }).catch(() => {});
    }, [article?.id]);

    /* Twitter + scroll + Telegram */
    useEffect(() => {
        const t = setTimeout(() => {
            if (window.twttr?.widgets) window.twttr.widgets.load();
            else {
                const s = document.createElement('script');
                s.src = 'https://platform.twitter.com/widgets.js'; s.async = true;
                document.body.appendChild(s);
            }
        }, 600);
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready(); tg.BackButton.show();
            tg.BackButton.onClick(() => window.location.href = '/');
        }
        return () => clearTimeout(t);
    }, [article]);

    const { readTime, prevArticle, nextArticle, suggestions, randomSuggestions, sideSuggestions } = useMemo(() => {
        if (!article || !news.length) return {};
        const sorted  = [...news].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        const idx     = sorted.findIndex(n => n.id === article.id);
        const words   = article.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        const others  = sorted.filter(n => n.id !== article.id);
        const shuffled = [...others].sort(() => .5 - Math.random());
        return {
            readTime:         Math.ceil(words / 200) || 1,
            prevArticle:      idx < sorted.length - 1 ? sorted[idx + 1] : null,
            nextArticle:      idx > 0 ? sorted[idx - 1] : null,
            suggestions:      others,
            randomSuggestions: shuffled.slice(0, 3),
            sideSuggestions:  shuffled.slice(3, 8),
        };
    }, [article, news]);

    const displayDate = useMemo(() => {
        const ts = article?.timestamp?.seconds || article?.lastUpdate?.seconds || article?.date?.seconds;
        if (ts) return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        return article?.date || 'Récemment';
    }, [article]);

    if (!article) return null;

    return (
        <div className="bg-white min-h-screen">
            <ScrollTop />

            <main className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-8 uppercase tracking-[.12em]">
                    <a href="/" className="hover:text-slate-700 transition-colors">Accueil</a>
                    <ChevronRight size={10} className="flex-shrink-0" />
                    <a href={`/?category=${encodeURIComponent(article.category || '')}`}
                        className="hover:text-slate-700 transition-colors text-slate-600 font-bold">
                        {article.category || 'Actualité'}
                    </a>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

                    {/* ══════════ COLONNE ARTICLE ══════════ */}
                    <article className="lg:col-span-8">

                        {/* En-tête */}
                        <header className="mb-8">
                            {/* Catégorie + temps de lecture */}
                            <div className="flex items-center gap-4 mb-5">
                                <span className="text-[10px] font-black uppercase tracking-[.15em] px-2.5 py-1 bg-slate-900 text-white">
                                    {article.category || 'À LA UNE'}
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <Clock size={11} /> {readTime} min de lecture
                                </span>
                            </div>

                            {/* Titre */}
                            <h1 className="font-serif font-bold text-[26px] md:text-[38px] lg:text-[44px] text-slate-950 leading-[1.12] mb-6 tracking-tight"
                                style={{ fontFamily: 'Georgia, serif' }}>
                                {article.title}
                            </h1>

                            {/* Auteur + date + vues */}
                            <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-t border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                                        style={{ backgroundColor: B24_BLUE || '#0f172a' }}>
                                        {article.authorName ? article.authorName[0].toUpperCase() : 'B'}
                                    </div>
                                    <div>
                                        {/* Remplace l'ancien bloc auteur par celui-ci */}
<div className="flex items-center gap-3">
    {/* Photo de profil depuis Firebase */}
    {article.authorPhotoUrl ? (
        <a href={`/auteur/${article.authorId || ''}`} className="flex-shrink-0">
            <img
                src={article.authorPhotoUrl}
                alt={article.authorName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
        </a>
    ) : (
        <a href={`/auteur/${article.authorId || ''}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: B24_BLUE || '#0f172a' }}>
                {article.authorName ? article.authorName[0].toUpperCase() : 'B'}
            </div>
        </a>
    )}
    <div>
        <a href={`/auteur/${article.authorId || ''}`}
            className="text-[13px] font-bold text-slate-900 leading-tight hover:underline no-underline block">
            {article.authorName || 'Rédaction Briefly'}
        </a>
        <div className="text-[11px] text-slate-400 mt-0.5">{displayDate}</div>
    </div>                          </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                    <Eye size={13} />
                                    <span>{(article.views || 0).toLocaleString('fr-FR')} lectures</span>
                                </div>
                            </div>
                        </header>

                        {/* Image principale */}
                        <figure className="mb-10">
                            <img src={article.imageUrl} alt={article.title} loading="eager"
                                className="w-full h-auto object-cover"
                                style={{ maxHeight: '520px', objectFit: 'cover' }}
                            />
                            <figcaption className="text-[10px] text-slate-400 font-medium mt-2 italic">
                                © Briefly Digital Media
                            </figcaption>
                        </figure>

                        {/* Contenu */}
                        <ArticleContent html={article.content} />

                        {/* Boutons de partage */}
                        <ShareButtons title={article.title} />

                        {/* Newsletter */}
                        <Newsletter />

                        {/* Navigation précédent / suivant */}
                        <div className="grid grid-cols-2 gap-0 border border-slate-200 mb-12">
                            {prevArticle ? (
                                <a href={`/article/${prevArticle.id}`}
                                    className="group flex flex-col gap-1 p-5 border-r border-slate-200 hover:bg-slate-50 transition-colors no-underline">
                                    <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-[.15em]">
                                        <ChevronLeft size={11} /> Article précédent
                                    </span>
                                    <span className="font-serif font-bold text-[14px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors mt-1">
                                        {prevArticle.title}
                                    </span>
                                </a>
                            ) : <div className="border-r border-slate-200" />}
                            {nextArticle ? (
                                <a href={`/article/${nextArticle.id}`}
                                    className="group flex flex-col gap-1 p-5 text-right hover:bg-slate-50 transition-colors no-underline">
                                    <span className="flex items-center justify-end gap-1 text-[9px] font-black text-slate-400 uppercase tracking-[.15em]">
                                        Article suivant <ChevronRight size={11} />
                                    </span>
                                    <span className="font-serif font-bold text-[14px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors mt-1">
                                        {nextArticle.title}
                                    </span>
                                </a>
                            ) : <div />}
                        </div>

                        {/* À lire aussi */}
                        {(randomSuggestions || []).length > 0 && (
                            <section className="mb-12">
                                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b-2 border-slate-900 pb-2 mb-6">
                                    À lire aussi
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {randomSuggestions.map(s => (
                                        <a key={s.id} href={`/article/${s.id}`} className="group block no-underline">
                                            <div className="aspect-video overflow-hidden mb-3">
                                                <img src={s.imageUrl} alt=""
                                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                            </div>
                                            <div className="text-[9px] font-black uppercase tracking-[.12em] text-slate-400 mb-1">{s.category}</div>
                                            <h4 className="font-serif font-bold text-[14px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
                                                {s.title}
                                            </h4>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100">
                            {[article.category, 'Afrique', 'Briefly', 'Actualité'].filter(Boolean).map(tag => (
                                <a key={tag} href={`/?category=${encodeURIComponent(tag)}`}
                                    className="px-3 py-1 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-[.1em] hover:border-slate-900 hover:text-slate-900 transition-all no-underline">
                                    {tag}
                                </a>
                            ))}
                        </div>
                    </article>

                    {/* ══════════ SIDEBAR ══════════ */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-28 space-y-10">

                            {/* Plus lus */}
                            <section>
                                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b-2 border-slate-900 pb-2 mb-5">
                                    À ne pas manquer
                                </div>
                                <div className="space-y-0">
                                    {(suggestions || []).slice(0, 5).map((s, i) => (
                                        <a key={s.id} href={`/article/${s.id}`}
                                            className={`flex gap-4 py-4 group no-underline ${i < 4 ? 'border-b border-slate-100' : ''}`}>
                                            <span className="text-[22px] font-serif font-bold text-slate-200 group-hover:text-slate-400 transition-colors flex-shrink-0 leading-none mt-0.5 w-7">
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="text-[9px] font-black uppercase tracking-[.1em] text-slate-400 mb-1">{s.category}</div>
                                                <h4 className="font-serif font-bold text-[13px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
                                                    {s.title}
                                                </h4>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>

                            {/* À découvrir (miniatures) */}
                            {(sideSuggestions || []).length > 0 && (
                                <section>
                                    <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b-2 border-slate-900 pb-2 mb-5">
                                        À découvrir
                                    </div>
                                    <div className="space-y-0">
                                        {sideSuggestions.slice(0, 4).map((s, i) => (
                                            <a key={s.id} href={`/article/${s.id}`}
                                                className={`flex gap-3 py-4 group no-underline ${i < 3 ? 'border-b border-slate-100' : ''}`}>
                                                <div className="w-16 h-14 flex-shrink-0 overflow-hidden">
                                                    <img src={s.imageUrl} alt=""
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-[9px] font-black uppercase tracking-[.1em] text-slate-400 mb-1">{s.category}</div>
                                                    <h4 className="font-serif font-bold text-[12px] text-slate-900 leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
                                                        {s.title}
                                                    </h4>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Newsletter sidebar */}
                            <section className="border border-slate-200 p-5">
                                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 mb-3">
                                    Newsletter
                                </div>
                                <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
                                    L'info Briefly directement dans votre boîte mail.
                                </p>
                                <a href="/#newsletter"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
                                    <Mail size={12} /> S'abonner gratuitement
                                </a>
                            </section>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default ArticleView;
