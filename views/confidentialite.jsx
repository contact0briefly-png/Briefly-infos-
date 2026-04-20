"use client";
import React from 'react';
import { motion } from 'framer-motion';

const Confidentialite = ({ B24_BLUE }) => {
    const sectionStyle = "mb-12";
    const titleStyle = "text-black font-[1000] uppercase text-xs tracking-[0.3em] mb-4";
    const textStyle = "text-gray-500 font-medium text-sm leading-relaxed border-l-2 border-gray-100 pl-6";

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none" style={{ color: B24_BLUE }}>
                        Privacy<span className="text-black">.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mt-4">Politique de confidentialité</p>
                </header>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}>01. Collecte des données</h2>
                    <div className={textStyle}>
                        <p>Nous collectons les données que vous nous transmettez volontairement via le formulaire de contact (Nom, Email, Sujet, Message). Ces informations ne sont jamais partagées avec des tiers.</p>
                    </div>
                </div>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}>02. Traitement via Telegram</h2>
                    <div className={textStyle}>
                        <p>Vos messages sont acheminés via l'API sécurisée de Telegram vers notre canal de réception privé. Ce processus garantit une notification instantanée et une sécurité de transfert via le protocole SSL/TLS.</p>
                    </div>
                </div>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}>03. Vos Droits (RGPD)</h2>
                    <div className={textStyle}>
                        <p>Conformément aux lois en vigueur, vous disposez d'un droit d'accès et de suppression de vos données personnelles. Pour toute demande, veuillez nous contacter à l'adresse suivante : contact0briefly@gmail.com .</p>
                    </div>
                </div>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}>04. Cookies</h2>
                    <div className={textStyle}>
                        <p>Ce site utilise des cookies techniques nécessaires à la navigation et au pistage publicitaire (tracking).</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Confidentialite;
