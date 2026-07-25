"use client";
import React from 'react';
import Link from 'next/link';
import { BrieflyLogo } from "./Navbar";

const SOCIAL = [
    { name: 'TikTok',    href: 'https://www.tiktok.com/@briefly_infos?_r=1&_t=ZS-9685Xjk0hE5',               d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { name: 'WhatsApp',  href: 'https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F',                      d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.551 4.197 1.595 6.035L0 24l6.105-1.602a11.832 11.832 0 005.94 1.6c6.632 0 12.05-5.418 12.05-12.048 0-3.213-1.252-6.234-3.525-8.508' },
    { name: 'Facebook',  href: 'https://www.facebook.com/share/18RiF3NASk/',                                  d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { name: 'Instagram', href: 'https://www.instagram.com/briefly_infos?igsh=MTZrZ2l5b3g4d2JuZA==',          d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { name: 'LinkedIn',  href: 'https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/',         d: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
    { name: 'Telegram',  href: 'https://t.me/brieflyinfos',                                                   d: 'M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-1.97 9.28c-.148.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.307.28-.595.28l.213-3.033 5.518-4.985c.24-.213-.054-.33-.373-.12l-6.82 4.295-2.946-.92c-.64-.203-.654-.64.135-.954l11.503-4.435c.533-.193 1 .127.868.891z' },
];

const RUBRIQUES = ['Togo', 'International', 'Sport', 'Économie', 'Lifestyle', 'Décryptage', 'Éducation'];
const LIENS     = [
    { name: 'À propos',         href: '/contact' },
    { name: 'Contact',          href: '/contact' },
    { name: 'Mentions légales', href: '/mentionslegales' },
    { name: 'Confidentialité',  href: '/confidentialite' },
    { name: 'Flux RSS',         href: 'https://rss.app/feeds/TENwT5ha8Msc6ON4.xml' },
];

const Footer = ({ B24_BLUE }) => (
    <footer className="bg-white border-t-2 border-slate-900 mt-auto no-print">

        {/* ── Bloc principal ── */}
        <div className="max-w-[1280px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* Logo + baseline */}
            <div className="md:col-span-4">
                <Link href="/" className="inline-flex items-center gap-3 no-underline group mb-5">
                    <BrieflyLogo size={40} />
                    <div>
                        <div className="font-black italic text-[22px] text-slate-950 uppercase tracking-tight leading-none"
                            style={{ fontFamily: 'Georgia, serif' }}>
                            BRIEFLY
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-[.2em] text-slate-400 mt-0.5">
                            Infos
                        </div>
                    </div>
                </Link>
                <p className="text-[12px] text-slate-500 leading-relaxed max-w-xs">
                    Briefly Digital Media couvre l'actualité du Togo et de l'Afrique avec rigueur et clarté, depuis Lomé.
                </p>

                {/* Réseaux sociaux */}
                <div className="flex items-center gap-2 mt-6 flex-wrap">
                    {SOCIAL.map(s => (
                        <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                            aria-label={`Briefly sur ${s.name}`}
                            className="w-8 h-8 bg-slate-900 hover:bg-slate-700 flex items-center justify-center rounded transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                                <path d={s.d} />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>

            {/* Rubriques */}
            <div className="md:col-span-4">
                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b border-slate-200 pb-2 mb-4">
                    Rubriques
                </div>
                <ul className="space-y-2">
                    {RUBRIQUES.map(r => (
                        <li key={r}>
                            <Link href={`/?category=${encodeURIComponent(r)}`}
                                className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline flex items-center gap-1.5 group">
                                <span className="w-1 h-1 bg-slate-300 group-hover:bg-slate-900 rounded-full transition-colors" />
                                {r}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Liens légaux + newsletter */}
            <div className="md:col-span-4">
                <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 border-b border-slate-200 pb-2 mb-4">
                    Informations
                </div>
                <ul className="space-y-2 mb-8">
                    {LIENS.map(l => (
                        <li key={l.name}>
                            <Link href={l.href}
                                className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors no-underline flex items-center gap-1.5 group">
                                <span className="w-1 h-1 bg-slate-300 group-hover:bg-slate-900 rounded-full transition-colors" />
                                {l.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mini newsletter */}
                <div className="border-t border-slate-200 pt-5">
                    <div className="text-[10px] font-black uppercase tracking-[.2em] text-slate-900 mb-3">
                        Newsletter
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                        Recevez les dernières actualités directement par email.
                    </p>
                    <Link href="/#newsletter"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors no-underline">
                        S'abonner gratuitement
                    </Link>
                </div>
            </div>
        </div>

        {/* ── Barre basse ── */}
        <div className="border-t border-slate-100 bg-slate-50">
            <div className="max-w-[1280px] mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-[10px] text-slate-400 font-medium">
                    © {new Date().getFullYear()} Briefly Digital Media. Tous droits réservés.
                </p>
                <p className="text-[10px] text-slate-400">
                    Lomé, Togo — L'essentiel de l'information, décrypté pour vous.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
