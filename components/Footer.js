"use client";
import React from 'react';
import Link from 'next/link';
import { BrieflyLogo } from "./Navbar";

const Footer = ({ B24_BLUE }) => {
    // Composant SocialIcon optimisé pour l'accessibilité
    const SocialIcon = ({ path, link, name }) => (
        <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={`Suivez-nous sur ${name}`}
            className="hover:opacity-70 transition-opacity p-2" // p-2 agrandit la zone de clic pour le SEO
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d={path} />
            </svg>
        </a>
    );

    const icons = {
        whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.551 4.197 1.595 6.035L0 24l6.105-1.602a11.832 11.832 0 005.94 1.6c6.632 0 12.05-5.418 12.05-12.048 0-3.213-1.252-6.234-3.525-8.508",
        linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z",
        telegram: "M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.891 8.146l-1.97 9.28c-.148.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.307.28-.595.28l.213-3.033 5.518-4.985c.24-.213-.054-.33-.373-.12l-6.82 4.295-2.946-.92c-.64-.203-.654-.64.135-.954l11.503-4.435c.533-.193 1 .127.868.891z"
    };

    const linkStyle = "hover:opacity-70 transition-opacity cursor-pointer p-1";

    return (
        <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-10 px-6 text-white mt-auto no-print">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                
                {/* LOGO & COPYRIGHT */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <a href="/" className="flex items-center gap-2 cursor-pointer no-underline group">
                        <BrieflyLogo color={B24_BLUE} />
                        <span className="font-[1000] text-xl italic tracking-tighter uppercase text-white">BRIEFLY</span>
                    </a>
                    <p className="text-[8px] opacity-40 font-black uppercase tracking-[0.3em]">© 2026 Briefly Media</p>
                </div>

                {/* NAVIGATION - Utilisation de Link pour le SEO */}
                <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] font-black uppercase italic tracking-widest">
                    <a href="/" className={linkStyle}>Accueil</a>
                    <a href="/contact" className={linkStyle}>Contact</a>
                    <a href="/mentionslegales" className={linkStyle}>Mentions Légales</a>
                    <a href="/privacy" className={linkStyle}>Confidentialité</a>
                </nav>

                {/* RESEAUX SOCIAUX */}
                <div className="flex gap-3 items-center">
                    <SocialIcon name="WhatsApp" path={icons.whatsapp} link="https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F" />
                    <SocialIcon name="LinkedIn" path={icons.linkedin} link="https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/" />
                    <SocialIcon name="Telegram" path={icons.telegram} link="https://t.me/brieflyinfos" />
                </div>

            </div>
        </footer>
    );
};

export default Footer;