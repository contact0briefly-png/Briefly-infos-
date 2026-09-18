"use client";
import React from 'react';
import { AdBanner } from "@/components/AdManager";
import { motion } from 'framer-motion';
import { Scale, Code2, Globe, ShieldAlert, Mail } from 'lucide-react';

const MentionsLegales = ({ B24_BLUE }) => {
    return (
 <AdBanner />
        <div className="bg-[#f6f6f8] min-h-screen font-sans antialiased text-slate-900 overflow-x-hidden">
            <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
                
                <header className="mb-16 text-center md:text-left">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-primary mb-5" style={{ color: B24_BLUE }}>
                        Informations Légales
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-black italic tracking-tighter leading-none mb-6">
                        Légal<span style={{ color: B24_BLUE }}>.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Publication officielle</p>
                </header>

                <div className="space-y-8">
                    {/* Édition & Dev */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <Scale className="mb-6" size={28} style={{ color: B24_BLUE }} />
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4">01. Édition du site</h2>
                            <div className="space-y-2 text-slate-600 font-medium">
                                <p>Éditeur : <span className="text-slate-900 font-black">KJ Technologies</span></p>
                                <p>Siège : Lomé, Togo</p>
                                <p>Directeur : Briefly</p>
                            </div>
                        </section>

                        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <Code2 className="mb-6" size={28} style={{ color: B24_BLUE }} />
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4">02. Développement</h2>
                            <div className="space-y-2 text-slate-600 font-medium">
                                <p>Conception & Code :</p>
                                <p className="text-slate-900 font-black text-xl italic uppercase">Josué KPLOWODOKPO</p>
                            </div>
                        </section>
                    </div>

                    {/* Hébergement */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-8">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <Globe size={30} style={{ color: B24_BLUE }} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest mb-2">03. Hébergement</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Le site est hébergé par <span className="font-bold">Google Cloud France</span>. <br/>
                                Adresse : 8 Rue de Londres, 75009 Paris, France.
                            </p>
                        </div>
                    </section>

                    {/* Propriété Intellectuelle */}
                    <section className="relative overflow-hidden bg-slate-900 p-10 md:p-16 rounded-[3rem] text-white">
                        <ShieldAlert className="absolute top-[-20px] right-[-20px] size-48 opacity-5 rotate-12" />
                        <h2 className="text-3xl font-serif italic font-black mb-6 relative z-10">Propriété Intellectuelle</h2>
                        <p className="text-slate-400 leading-relaxed text-lg relative z-10 max-w-2xl">
                            L'architecture, les textes et les créations graphiques de ce site sont la propriété exclusive de <span className="text-white font-bold text-xl uppercase italic">Briefly</span>. Toute utilisation ou reproduction non autorisée sera poursuivie conformément aux lois internationales sur le droit d'auteur.
                        </p>
                    </section>

                    {/* Contact CTA */}
                    <div className="pt-10 text-center">
                        <a 
                            href="mailto:contact0briefly@gmail.com"
                            className="inline-flex items-center gap-4 px-10 py-5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-transform hover:scale-105 active:scale-95"
                            style={{ backgroundColor: B24_BLUE }}
                        >
                            <Mail size={16} />
                            Signaler un contenu
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MentionsLegales;
