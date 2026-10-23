"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cookie, Share2, Mail, Lock } from 'lucide-react';

const Confidentialite = ({ B24_BLUE }) => {
    return (
        <div className="bg-[#f6f6f8] min-h-screen font-sans antialiased text-slate-900 overflow-x-hidden">
            <main className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
                <header className="mb-16 text-center md:text-left">
                    <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-primary mb-5" style={{ color: B24_BLUE }}>
                        Protection des données
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-black italic tracking-tighter leading-none mb-6">
                        Privacy<span style={{ color: B24_BLUE }}>.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Dernière mise à jour : 23 Octobre 2026</p>
                </header>

                <div className="space-y-10">
                    {/* Section 01 */}
                    <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: B24_BLUE }}>
                                <Lock size={20} />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-widest">01. Collecte</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed border-l-4 pl-6" style={{ borderColor: B24_BLUE }}>
                            Nous collectons les données que vous nous transmettez volontairement via le formulaire de contact (Nom, Email, Sujet, Message). Ces informations sont utilisées exclusivement pour répondre à vos demandes et ne sont jamais partagées avec des tiers.
                        </p>
                    </section>

                    {/* Section 02 */}
                    <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: B24_BLUE }}>
                                <Cookie size={20} />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-widest">02. Cookies</h2>
                        </div>
                        <div className="text-slate-600 leading-relaxed mb-6 space-y-4 text-sm">
                            <p>
                                Briefly utilise des cookies et technologies similaires. Les cookies <strong>essentiels</strong> sont nécessaires au fonctionnement du site. Les autres (mesure d'audience, fonctionnalités, publicité) ne sont déposés qu'<strong>après votre consentement</strong>, que vous pouvez modifier à tout moment via le bandeau cookies.
                            </p>
                            <p>
                                <strong>Publicité (Google AdSense).</strong> Des fournisseurs tiers, dont Google, utilisent des cookies pour diffuser des annonces en fonction de vos visites sur ce site et sur d'autres sites. L'utilisation de cookies publicitaires permet à Google et à ses partenaires de diffuser des annonces basées sur votre navigation. Vous pouvez désactiver la publicité personnalisée dans les <a className="underline" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Paramètres des annonces Google</a>, ou consulter <a className="underline" href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">aboutads.info</a>. Pour en savoir plus : <a className="underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">comment Google utilise les données des sites partenaires</a>.
                            </p>
                            <p>
                                <strong>Mesure d'audience.</strong> Vercel Analytics et Speed Insights mesurent la fréquentation et les performances de manière anonymisée, uniquement si vous l'acceptez.
                            </p>
                            <p>
                                <strong>Notifications.</strong> Si vous activez les notifications, le service WebPushr enregistre un identifiant technique de votre navigateur pour vous envoyer les alertes.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-500 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div> Essentiels (Sécurité)
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-500 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div> Publicitaires (Tracking)
                            </div>
                        </div>
                    </section>

                    {/* Grid Droits & Sécurité */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white">
                            <ShieldCheck className="mb-6 opacity-50" size={32} />
                            <h3 className="font-serif italic font-black text-2xl mb-4">Vos Droits (RGPD)</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Contactez-nous à : <span className="text-white">contact0briefly@gmail.com</span>.
                            </p>
                        </div>
                        <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <Share2 className="mb-6" size={32} style={{ color: B24_BLUE }} />
                            <h3 className="font-serif italic font-black text-2xl mb-4">Hébergement des données</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Les articles et messages du formulaire de contact sont stockés dans une base Supabase, et le site est hébergé par Vercel. Les échanges sont chiffrés (SSL/TLS). Un message de contact peut aussi être transmis à l'équipe via Telegram.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="mt-20 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">© 2026 Briefly - infos. Tous droits réservés.</p>
                </footer>
            </main>
        </div>
    );
};

export default Confidentialite;
