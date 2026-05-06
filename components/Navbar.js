"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronRight } from 'lucide-react';

export const BrieflyLogo = ({ color = "#0077b5" }) => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="30" cy="50" r="28" fill={color} opacity="0.15"/>
        <rect x="20" y="20" width="60" height="60" rx="4" fill={color}/>
        <path d="M40 35H53C58 35 62 38 62 43C62 46 60 49 56 50C61 51 64 55 64 60C64 66 59 71 52 71H40V35ZM46 41V50H52C55 50 56 48 56 45C56 42 55 41 52 41H46ZM46 56V65H53C56 65 58 63 58 60C58 57 56 56 53 56H46Z" fill="white"/>
        <circle cx="82" cy="50" r="6" fill={color}/>
    </svg>
);

const Navbar = ({ B24_BLUE }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
            setIsSearchOpen(false);
            setSearchValue("");
        }
    };

    const handleCategoryClick = (cat) => {
        router.push(`/?category=${encodeURIComponent(cat)}`);
        setIsMenuOpen(false);
    };

    const menuLinks = [
        { name: "Accueil", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "Confidentialité", href: "/confidentialite" },
        { name: "Mentions Légales", href: "/mentionslegales" },
    ];

    const menuCategories = ["Togo", "Décryptage", "Éducation"];

    const socialLinks = [
        {
            name: "TikTok",
            link: "https://www.tiktok.com/@briefly_infos?_r=1&_t=ZS-9685Xjk0hE5",
            path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
        },
        {
            name: "WhatsApp",
            link: "https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F",
            path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.551 4.197 1.595 6.035L0 24l6.105-1.602a11.832 11.832 0 005.94 1.6c6.632 0 12.05-5.418 12.05-12.048 0-3.213-1.252-6.234-3.525-8.508"
        },
        {
            name: "Facebook",
            link: "https://www.facebook.com/share/18RiF3NASk/",
            path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        },
        {
            name: "LinkedIn",
            link: "https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/",
            path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        },
    ];

    return (
        <>
            <div className={`${scrolled ? "h-14" : "h-20"} w-full transition-all duration-300`}></div>

            <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 border-b ${
                scrolled ? "h-14 bg-white/95 backdrop-blur-md shadow-md" : "h-20 bg-white"
            } border-slate-100`}>

                <div className="container mx-auto h-full px-4 max-w-[1200px] flex items-center justify-between">

                    <div className="md:hidden flex-1">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-slate-900 cursor-pointer"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                            aria-label="Ouvrir le menu de navigation"
                        >
                            <Menu size={28} />
                        </button>
                    </div>

                    <div className="flex-none md:flex-initial flex items-center z-10">
                        <Link href="/" className="flex items-center gap-2 group no-underline">
                            <BrieflyLogo color={B24_BLUE} />
                            <div className="flex flex-col">
                                <span className="font-serif font-black text-xl italic tracking-tighter leading-none text-slate-950 uppercase">BRIEFLY</span>
                                <p className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: B24_BLUE }}>L'essentiel de l'info</p>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-grow ml-10 gap-8">
                        {menuLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors no-underline"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-1 md:flex-none flex justify-end">
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 -mr-2 text-slate-900 cursor-pointer"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                            aria-label={isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
                        >
                            {isSearchOpen ? <X size={24} /> : <Search size={24} />}
                        </button>
                    </div>

                    {isSearchOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                            <form onSubmit={handleSearch} className="max-w-[800px] mx-auto relative flex items-center">
                                <Search className="absolute left-4 text-slate-400" size={18} aria-hidden="true" />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Rechercher sur Briefly..."
                                    className="w-full bg-slate-100 border-none py-4 pl-12 pr-20 rounded-none font-bold text-sm outline-none text-slate-900"
                                    aria-label="Champ de recherche"
                                />
                                <button type="submit" className="absolute right-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white cursor-pointer" style={{ backgroundColor: B24_BLUE }}>
                                    OK
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </nav>

            {/* MENU MOBILE LATÉRAL */}
            <div className={`fixed inset-0 z-[2000] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}>
                <div 
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}>
                    <div className="p-6 pt-10 flex flex-col h-full overflow-y-auto">

                        {/* LOGO */}
                        <div className="flex justify-between items-center mb-12">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 no-underline">
                                <BrieflyLogo color={B24_BLUE} />
                                <div className="flex flex-col">
                                    <span className="font-serif font-black text-xl italic tracking-tighter leading-none text-slate-950 uppercase">BRIEFLY</span>
                                    <p className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: B24_BLUE }}>L'essentiel de l'info</p>
                                </div>
                            </Link>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="p-2 text-slate-400 cursor-pointer"
                                aria-label="Fermer le menu"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* LIENS DE NAVIGATION */}
                        <div className="flex flex-col gap-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Navigation</span>
                            {menuLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group no-underline"
                                >
                                    <span className="text-3xl font-serif font-black italic tracking-tighter text-slate-900 group-hover:translate-x-2 transition-transform">
                                        {link.name}
                                    </span>
                                    <ChevronRight className="text-slate-200" size={20} aria-hidden="true" />
                                </Link>
                            ))}
                        </div>

                        {/* CATÉGORIES */}
                        <div className="flex flex-col gap-4 mt-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Catégories</span>
                            {menuCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryClick(cat)}
                                    className="flex items-center justify-between group w-full text-left"
                                >
                                    <span className="text-lg font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 group-hover:translate-x-2 transition-all">
                                        {cat}
                                    </span>
                                    <ChevronRight className="text-slate-200 group-hover:text-slate-400 transition-colors" size={16} aria-hidden="true" />
                                </button>
                            ))}
                        </div>

                        {/* RÉSEAUX SOCIAUX */}
                        <div className="mt-auto pt-8 border-t border-slate-100">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 mb-4">Nous suivre</p>
                            <div className="flex gap-1 items-center">
                                {socialLinks.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Suivez-nous sur ${s.name}`}
                                        className="p-2 rounded-xl bg-slate-900 hover:opacity-70 transition-opacity"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                                            <path d={s.path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-4 italic">
                                © 2026 Briefly Digital Media
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;