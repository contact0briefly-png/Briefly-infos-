"use client";
import React, { useEffect, useState } from 'react';
import { getAuthor, getNewsByAuthor } from "../../lib/news";
import { Clock, MapPin, Globe, Mail } from 'lucide-react';

const SOCIAL_CONFIG = {
    twitter: {
        label: 'X (Twitter)',
        color: '#000000',
        bg: '#f1f5f9',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    x: {
        label: 'X',
        color: '#000000',
        bg: '#f1f5f9',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    facebook: {
        label: 'Facebook',
        color: '#1877F2',
        bg: '#eff6ff',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        )
    },
    instagram: {
        label: 'Instagram',
        color: '#E4405F',
        bg: '#fdf2f8',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        )
    },
    linkedin: {
        label: 'LinkedIn',
        color: '#0A66C2',
        bg: '#f0f9ff',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        )
    },
    tiktok: {
        label: 'TikTok',
        color: '#000000',
        bg: '#f8fafc',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        )
    },
    whatsapp: {
        label: 'WhatsApp',
        color: '#25D366',
        bg: '#f0fdf4',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.551 4.197 1.595 6.035L0 24l6.105-1.602a11.832 11.832 0 005.94 1.6c6.632 0 12.05-5.418 12.05-12.048 0-3.213-1.252-6.234-3.525-8.508" />
            </svg>
        )
    },
    youtube: {
        label: 'YouTube',
        color: '#FF0000',
        bg: '#fef2f2',
        svg: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        )
    },
    website: {
        label: 'Site Web',
        color: '#475569',
        bg: '#f8fafc',
        svg: <Globe size={14} />
    },
    email: {
        label: 'E-mail',
        color: '#2563EB',
        bg: '#eff6ff',
        svg: <Mail size={14} />
    }
};

function formatSocialUrl(key, val) {
    if (!val || typeof val !== 'string') return '';
    const clean = val.trim();
    if (!clean) return '';
    if (/^https?:\/\//i.test(clean) || clean.startsWith('mailto:')) return clean;
    const stripped = clean.replace(/^@/, '');
    switch (key.toLowerCase()) {
        case 'twitter':
        case 'x':
            return `https://x.com/${stripped}`;
        case 'facebook':
            return `https://facebook.com/${stripped}`;
        case 'instagram':
            return `https://instagram.com/${stripped}`;
        case 'linkedin':
            return `https://linkedin.com/in/${stripped}`;
        case 'tiktok':
            return `https://tiktok.com/@${stripped}`;
        case 'whatsapp':
            return `https://wa.me/${stripped.replace(/[^0-9]/g, '')}`;
        case 'youtube':
            return `https://youtube.com/@${stripped}`;
        default:
            return `https://${clean}`;
    }
}

const AuthorPage = ({ params, B24_BLUE }) => {
    const [author,   setAuthor]   = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading,  setLoading]  = useState(true);

    const authorId = params?.id;

    useEffect(() => {
        if (!authorId) return;
        const load = async () => {
            try {
                const a = await getAuthor(authorId);
                if (a) {
                    setAuthor(a);
                    setArticles(await getNewsByAuthor(a.id));
                }
            } catch (e) {
                console.error('Erreur chargement profil auteur :', e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [authorId]);

    const formatDate = (item) => {
        const ts = item.timestamp?.seconds || item.lastUpdate?.seconds;
        if (ts) return new Date(ts * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        return 'Récemment';
    };

    if (loading) return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-[12px] font-medium text-slate-400 uppercase tracking-widest animate-pulse">Chargement…</div>
        </div>
    );

    if (!author) return (
        <div className="bg-white min-h-screen flex items-center justify-center">
            <div className="text-center p-8">
                <div className="text-[44px] mb-3 text-slate-300">∅</div>
                <h2 className="text-[18px] font-serif font-bold text-slate-900 mb-2">Profil introuvable</h2>
                <p className="text-[13px] text-slate-500 max-w-sm mb-6">Cet auteur n'existe pas ou n'est plus actif sur la plateforme.</p>
                <a href="/" className="inline-block px-5 py-2.5 rounded-full bg-slate-900 text-white text-[12px] font-bold no-underline hover:bg-slate-800 transition-colors">
                    ← Retour à l'accueil
                </a>
            </div>
        </div>
    );

    // Extraction et normalisation des réseaux sociaux
    let socialsMap = {};
    if (author.socials) {
        if (typeof author.socials === 'string') {
            try { socialsMap = JSON.parse(author.socials); } catch (e) {}
        } else if (typeof author.socials === 'object') {
            socialsMap = author.socials;
        }
    }

    const validSocials = Object.entries(socialsMap)
        .map(([k, v]) => {
            const keyNorm = k.toLowerCase().trim();
            const url = formatSocialUrl(keyNorm, v);
            const cfg = SOCIAL_CONFIG[keyNorm] || {
                label: k.charAt(0).toUpperCase() + k.slice(1),
                color: '#475569',
                bg: '#f8fafc',
                svg: <Globe size={14} />
            };
            return { key: keyNorm, url, cfg };
        })
        .filter(item => Boolean(item.url));

    const roleLabel = author.role === 'admin_general' ? 'Administrateur Général' : 'Rédacteur';

    return (
        <div className="bg-white min-h-screen">
            <div className="h-16 md:h-[113px]" />

            {/* ── HERO PROFIL ── */}
            <div className="border-b border-slate-200 bg-slate-50/50">
                <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">

                        {/* Photo de profil */}
                        <div className="flex-shrink-0">
                            {author.photoUrl ? (
                                <img
                                    src={author.photoUrl}
                                    alt={author.name}
                                    className="w-28 h-28 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl ring-1 ring-slate-200"
                                />
                            ) : (
                                <div
                                    className="w-28 h-28 md:w-40 md:h-40 rounded-full flex items-center justify-center text-white text-[44px] font-bold shadow-xl border-4 border-white"
                                    style={{ backgroundColor: B24_BLUE || '#0f172a' }}
                                >
                                    {author.name ? author.name[0].toUpperCase() : 'B'}
                                </div>
                            )}
                        </div>

                        {/* Informations auteur */}
                        <div className="flex-1 text-center md:text-left">
                            {/* Rôle & Localisation */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                    {roleLabel}
                                </span>
                                {author.location && (
                                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500">
                                        <MapPin size={13} className="text-slate-400" />
                                        {author.location}
                                    </span>
                                )}
                            </div>

                            {/* Nom de l'auteur */}
                            <h1
                                className="font-serif font-bold text-[32px] md:text-[44px] text-slate-950 leading-tight mb-4 tracking-tight"
                                style={{ fontFamily: 'Georgia, serif' }}
                            >
                                {author.name}
                            </h1>

                            {/* Biographie : conservation intégrale de la mise en page (paragraphes & retours à la ligne) */}
                            {author.bio ? (
                                <div
                                    className="text-[14px] md:text-[15px] text-slate-600 leading-relaxed max-w-2xl mb-6 whitespace-pre-line text-justify md:text-left"
                                    style={{ whiteSpace: 'pre-line' }}
                                >
                                    {author.bio}
                                </div>
                            ) : (
                                <p className="text-[13px] text-slate-400 italic mb-6">
                                    Membre de la rédaction Briefly Infos.
                                </p>
                            )}

                            {/* Statistiques rapides */}
                            <div className="flex items-center justify-center md:justify-start gap-8 mb-6 pb-6 border-b border-slate-200/80">
                                <div>
                                    <div className="font-serif font-bold text-[24px] md:text-[28px] text-slate-950 leading-none">
                                        {articles.length}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400 mt-1">
                                        {articles.length > 1 ? 'Articles publiés' : 'Article publié'}
                                    </div>
                                </div>
                            </div>

                            {/* Liens et Réseaux sociaux vérifiés avec vrais logos */}
                            {validSocials.length > 0 && (
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[.15em] text-slate-400 mb-2.5">
                                        Réseaux &amp; Contact
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                                        {validSocials.map(({ key, url, cfg }) => (
                                            <a
                                                key={key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={cfg.label}
                                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:border-slate-900 hover:shadow-sm transition-all text-[11px] font-bold text-slate-700 hover:text-slate-950 group no-underline"
                                            >
                                                <span style={{ color: cfg.color }} className="group-hover:scale-110 transition-transform">
                                                    {cfg.svg}
                                                </span>
                                                <span>{cfg.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* ── ARTICLES DE L'AUTEUR ── */}
            <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-8">
                    <h2 className="text-[11px] font-black uppercase tracking-[.2em] text-slate-900">
                        Articles publiés par {author.name} ({articles.length})
                    </h2>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <div className="text-[32px] mb-2 opacity-40">📰</div>
                        <p className="text-[14px] font-medium text-slate-500">Aucun article publié pour le moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(a => (
                            <a key={a.id} href={`/article/${a.id}`} className="group block no-underline">
                                <div className="aspect-[16/10] overflow-hidden rounded-lg mb-3 bg-slate-100">
                                    <img
                                        src={a.imageUrl}
                                        alt={a.title}
                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                </div>
                                <div className="text-[10px] font-black uppercase tracking-[.12em] text-blue-600 mb-1.5">
                                    {a.category}
                                </div>
                                <h3 className="font-serif font-bold text-[17px] text-slate-950 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">
                                    {a.title}
                                </h3>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    <Clock size={11} /> {formatDate(a)}
                                </span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthorPage;
