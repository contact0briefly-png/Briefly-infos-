"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const BrieflyLogo = ({ color = "#0077b5" }) => (
    <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="30" cy="50" r="28" fill={color} opacity="0.15"/>
        <rect x="20" y="20" width="60" height="60" rx="10" fill={color}/>
        <path d="M40 35H53C58 35 62 38 62 43C62 46 60 49 56 50C61 51 64 55 64 60C64 66 59 71 52 71H40V35ZM46 41V50H52C55 50 56 48 56 45C56 42 55 41 52 41H46ZM46 56V65H53C56 65 58 63 58 60C58 57 56 56 53 56H46Z" fill="white"/>
        <circle cx="82" cy="50" r="6" fill={color}/>
    </svg>
);

const Navbar = ({ B24_BLUE }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
            setIsSearchOpen(false);
            setSearchValue("");
        }
    };

    const handleCategoryClick = (cat) => {
        router.push(`/?search=${encodeURIComponent(cat)}`);
        setIsMenuOpen(false);
    };

    const menuLinks = [
        { name: "Accueil", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "Confidentialité", href: "/privacy" },
        { name: "Mentions Légales", href: "/mentionslegales" },
    ];

    const categories = ["Politique", "Économie", "Sport", "Culture", "Technologie"];

    return (
        <>
            <nav className="fixed top-0 w-full z-[100] border-b h-16 flex items-center px-4 justify-between backdrop-blur-md bg-white/90 border-black/10">
                {/* Remplacement du H1 par une DIV pour ne pas perturber le SEO des articles */}
                <a href="/" className="flex items-center gap-2 cursor-pointer no-underline group">
                    <BrieflyLogo color={B24_BLUE} />
                    <div className="flex flex-col">
                        <span className="font-[1000] text-lg md:text-xl italic tracking-tighter leading-none text-black uppercase">BRIEFLY</span>
                        <p className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.1em]" style={{ color: B24_BLUE }}>L'info à l'essentiel</p>
                    </div>
                </a>

                <div className="flex items-center gap-3">
                    {/* Bouton de recherche agrandi pour l'audit SEO (Tap Target) */}
                    <button 
                        onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }} 
                        aria-label="Ouvrir la recherche"
                        className="text-white w-10 h-10 flex items-center justify-center rounded-full transition-transform active:scale-90 shadow-sm" 
                        style={{ backgroundColor: B24_BLUE }}
                    >
                        {isSearchOpen ? '✕' : '🔍'}
                    </button>

                    <button 
                        onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); }}
                        aria-label="Ouvrir le menu"
                        className="flex flex-col justify-center items-center w-10 h-10 gap-1 rounded-sm border-2 transition-all active:scale-90" 
                        style={{ borderColor: B24_BLUE }}
                    >
                        {isMenuOpen ? (
                            <span className="font-bold text-xs" style={{ color: B24_BLUE }}>✕</span>
                        ) : (
                            <>
                                <span className="w-5 h-[2px]" style={{ backgroundColor: B24_BLUE }}></span>
                                <span className="w-5 h-[2px]" style={{ backgroundColor: B24_BLUE }}></span>
                            </>
                        )}
                    </button>
                </div>

                {isSearchOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white border-b p-4 shadow-xl animate-in slide-in-from-top duration-300">
                        <form onSubmit={handleSearch} className="max-w-7xl mx-auto flex gap-2">
                            <input 
                                autoFocus
                                type="text" 
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Rechercher une actualité..."
                                className="flex-1 bg-gray-100 border-none p-3 rounded-lg text-sm outline-none text-black"
                            />
                            <button type="submit" className="bg-black text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">OK</button>
                        </form>
                    </div>
                )}
            </nav>

            <div className={`fixed inset-0 z-[90] transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}>
                <div 
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                <div className={`absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-8 pt-24 flex flex-col h-full">
                        <div className="flex flex-col gap-6 mb-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Navigation</span>
                            {menuLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-2xl font-[1000] uppercase italic tracking-tighter hover:opacity-50 transition text-black no-underline"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        <div className="h-[1px] w-full bg-gray-100 mb-8"></div>

                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Rubriques</span>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button 
                                        key={cat}
                                        onClick={() => handleCategoryClick(cat)}
                                        className="px-4 py-2 border text-[10px] font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition"
                                        style={{ color: B24_BLUE, borderColor: B24_BLUE }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pb-4 text-center">
                            <p className="text-[8px] font-black uppercase opacity-20 italic">Briefly v2.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;