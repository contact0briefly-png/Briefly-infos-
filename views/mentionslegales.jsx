"use client";
import React from 'react';
import { motion } from 'framer-motion';

const MentionsLegales = ({ B24_BLUE }) => {
    const sectionStyle = "mb-10";
    const titleStyle = "text-black font-[1000] uppercase text-xs tracking-[0.3em] mb-4 flex items-center gap-2";
    const textStyle = "text-gray-500 font-medium text-sm leading-relaxed ml-6";

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none" style={{ color: B24_BLUE }}>
                        Légal<span className="text-black">.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mt-4">Informations obligatoires</p>
                </header>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}><span className="w-8 h-[2px] bg-black"></span> 01. Édition du site</h2>
                    <div className={textStyle}>
                        <p>Le site <strong>Briefly</strong> est édité par : KJ Technologies</p>
                        <p>Siège social : Lomé, Togo</p>
                        <p>Directeur de la publication : Briefly</p>
                        <p>Contact : contact0briefly@gmail.com</p>
                    </div>
                </div>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}><span className="w-8 h-[2px] bg-black"></span> 02. Hébergement</h2>
                    <div className={textStyle}>
                        <p>Le site est hébergé par : Google Cloud France</p>
                        <p>Adresse : 8 Rue de Londres, 75009 Paris, France </p>
                    </div>
                </div>

                <div className={sectionStyle}>
                    <h2 className={titleStyle}><span className="w-8 h-[2px] bg-black"></span> 03. Propriété</h2>
                    <div className={textStyle}>
                        <p>L'architecture, les textes et les créations graphiques de ce site sont la propriété exclusive de Briefly. Toute utilisation non autorisée sera poursuivie.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MentionsLegales;
