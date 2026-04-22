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

    // Effet de scroll pour réduire la barre de nav
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

    const menuLinks = [
        { name: "Accueil", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "Confidentialité", href: "/confidentialite" },
        { name: "Mentions Légales", href: "/mentionslegales" },
    ];

    return (
        <>
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 border-b ${
                scrolled ? "h-14 bg-white/95 backdrop-blur-md shadow-md" : "h-20 bg-white"
            } border-slate-100`}>
                
                <div className="container mx-auto h-full px-4 max-w-[1200px] flex items-center justify-between relative">
                    
                    {/* --- MOBILE: MENU À GAUCHE --- */}
                    <div className="md:hidden flex-1">
                        <button 
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-slate-900 active:scale-90 transition-transform"
                            aria-label="Menu"
                        >
                            <Menu size={24} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* --- LOGO: CENTRE SUR MOBILE / GAUCHE SUR PC --- */}
                    <div className="flex-none md:flex-initial flex items-center">
                        <Link href="/" className="flex items-center gap-2 group no-underline">
                            <BrieflyLogo color={B24_BLUE} />
                            <div className="flex flex-col">
                                <span className="font-serif font-[1000] text-xl italic tracking-tighter leading-none text-slate-950 uppercase">BRIEFLY</span>
                                <p className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: B24_BLUE }}>L'essentiel de l'info</p>
                            </div>
                        </Link>
                    </div>

                    {/* --- PC: LINKS AU MILIEU (À CÔTÉ DU LOGO) --- */}
                    <div className="hidden md:flex flex-grow ml-10 gap-8">
                        {menuLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* --- RECHERCHE À DROITE --- */}
                    <div className="flex-1 md:flex-none flex justify-end">
                        <button 
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 -mr-2 text-slate-900 hover:opacity-70 transition-opacity"
                            aria-label="Search"
                        >
                            {isSearchOpen ? <X size={22} /> : <Search size={22} strokeWidth={2.5} />}
                        </button>
                    </div>

                    {/* BARRE DE RECHERCHE DÉROULANTE */}
                    {isSearchOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                            <form onSubmit={handleSearch} className="max-w-[800px] mx-auto relative flex items-center">
                                <Search className="absolute left-4 text-slate-400" size={18} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Rechercher sur Briefly..."
                                    className="w-full bg-slate-100 border-none py-4 pl-12 pr-20 rounded-none font-bold text-sm outline-none text-slate-900 focus:bg-slate-200 transition-colors"
                                />
                                <button type="submit" className="absolute right-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: B24_BLUE }}>
                                    GO
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- MENU MOBILE (LATÉRAL) --- */}
            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isMenuOpen ? "visible" : "invisible"}`}>
                <div 
                    className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="p-6 pt-10 flex flex-col h-full">
                        
                        <div className="flex justify-between items-center mb-12">
                            <BrieflyLogo color={B24_BLUE} />
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Sommaire</span>
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
                                    <ChevronRight className="text-slate-200" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto border-t border-slate-100 pt-8 pb-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Suivez-nous</p>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                                <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                            </div>
                            <p className="text-[8px] font-bold text-slate-300 mt-8 uppercase tracking-widest text-center italic">© 2026 Briefly Digital Media</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
