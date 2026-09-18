"use client";
import React, { useState } from 'react';
import { AdBanner } from "@/components/AdManager";
import { motion, AnimatePresence } from 'framer-motion';
import AdBannerSquare from '../components/AdBannerSquare';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, MapPin, Mail, Phone, ExternalLink, Navigation } from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const appId = 'bbriefly-7e3b8';

 <AdBanner />

// --- LOGOS OFFICIELS (SVG STRICTS) ---
const OfficialIcons = {
    WhatsApp: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    ),
    Telegram: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.357.265-.546.265l.182-2.58 4.68-4.23c.203-.18-.047-.28-.312-.104l-5.786 3.64-2.502-.78c-.544-.17-.554-.544.114-.81l9.76-3.76c.452-.164.847.108.71.79z"/></svg>
    ),
    LinkedIn: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.98 0 1.775-.773 1.775-1.729V1.729C24 .774 23.205 0 22.225 0z"/></svg>
    )
};

const Contact = ({ B24_BLUE }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const TOKEN = "8575032027:AAFjP34vggDXwthT_OUZvjfCTUFogtV0G2M";
    const CHAT_ID = "7048661353";

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        const text = `📬 Nouveau message Briefly :\n\n👤 Nom: ${data.name}\n📧 Email: ${data.email}\n📝 Sujet: ${data.subject}\n💬 Message: ${data.message}`;

        try {
            await Promise.all([
                fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
                }),
                addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
                    ...data,
                    timestamp: serverTimestamp()
                })
            ]);
            setShowPopup(true);
            e.target.reset();
            setTimeout(() => setShowPopup(false), 4000);
        } catch (error) {
            alert("Erreur lors de l'envoi.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-[#f6f6f8] min-h-screen font-sans antialiased text-slate-900 w-full overflow-x-hidden">
            
            <AnimatePresence>
                {showPopup && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm w-full"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                <Send size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif italic font-black">Message envoyé !</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Nous revenons vers vous très vite.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* SECTION GAUCHE : FORMULAIRE */}
                    <div className="order-2 lg:order-1">
                        <div className="mb-10 text-center lg:text-left">
                            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-primary mb-5" style={{ color: B24_BLUE }}>
                                Support Center
                            </span>
                            <h1 className="font-serif text-4xl md:text-6xl font-black leading-tight tracking-tighter italic">
                                Parlons de votre <br className="hidden md:block"/><span style={{ color: B24_BLUE }}>projet.</span>
                            </h1>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-5 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom</label>
                                    <input name="name" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:bg-white focus:border-primary transition-all" placeholder="Votre nom" type="text"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <input name="email" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:bg-white focus:border-primary transition-all" placeholder="email@exemple.com" type="email"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sujet</label>
                                <select name="subject" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:bg-white focus:border-primary transition-all appearance-none cursor-pointer">
                                    <option>Demande Générale</option>
                                    <option>Partenariats</option>
                                    <option>Rédaction / Presse</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                <textarea name="message" required rows="4" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm outline-none focus:bg-white focus:border-primary transition-all resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button 
                                disabled={isSending}
                                type="submit" 
                                className="w-full flex items-center justify-center gap-3 rounded-2xl py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: B24_BLUE }}
                            >
                                {isSending ? "ENVOI..." : "ENVOYER LE MESSAGE"}
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                    {/* SECTION DROITE : INFOS & RESEAUX */}
                    <div className="order-1 lg:order-2 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <MapPin className="mb-4" size={24} style={{ color: B24_BLUE }} />
                                <h3 className="font-serif italic font-black text-lg mb-1">Bureau</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
                                    Lomé, Sanguéra<br/>Togo
                                </p>
                            </div>
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <Mail className="mb-4" size={24} style={{ color: B24_BLUE }} />
                                <h3 className="font-serif italic font-black text-lg mb-1">Contact</h3>
                                <p className="text-slate-500 text-xs font-bold lowercase leading-relaxed">
                                    contact0briefly@gmail.com<br/>+228 79 59 27 17
                                </p>
                            </div>
                        </div>

                        {/* CARTE / VISUEL INTERACTIF (SANGUÉRA) */}
<div className="relative h-60 md:h-72 rounded-[2.5rem] overflow-hidden border border-white shadow-lg group">
    {/* Remplacement de l'image par Google Maps */}
    <iframe
        title="Localisation Sanguéra"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15860.852358826!2d1.1097593!3d6.228453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102390314c4fab2f%3A0x8670b358d3631bc1!2sSangu%C3%A9ra%2C%20Lom%C3%A9!5e0!3m2!1sfr!2stg!4v1715328000000!5m2!1sfr!2stg"
        className="absolute inset-0 w-full h-full border-0 transition-all duration-700"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
    ></iframe>

    {/* Overlay interactif */}
    <div className="absolute inset-0 bg-slate-900/10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
    
    <a 
        href="https://www.google.com/maps/search/?api=1&query=Sanguéra,Lomé,Togo" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between hover:bg-white transition-all"
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#0052FF' }}>
                <Navigation size={14} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Nous localiser</span>
                <span className="text-[9px] text-slate-500 font-medium">Sanguéra, Lomé - Togo</span>
            </div>
        </div>
        <ExternalLink size={14} className="text-slate-400" />
    </a>
</div>

                        {/* RESEAUX SOCIAUX (LOGOS OFFICIELS) */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center lg:text-left">Réseaux Officiels</h4>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { name: 'WhatsApp', icon: <OfficialIcons.WhatsApp />, url: 'https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F', color: '#25D366' },
                                    { name: 'Telegram', icon: <OfficialIcons.Telegram />, url: 'https://t.me/brieflyinfos', color: '#0088cc' },
                                    { name: 'LinkedIn', icon: <OfficialIcons.LinkedIn />, url: 'https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/', color: '#0077b5' }
                                ].map((social) => (
                                    <a 
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="transition-transform group-hover:scale-110" style={{ color: social.color }}>
                                            {social.icon}
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                                            {social.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center w-full overflow-hidden rounded-2xl">
                            <AdBannerSquare />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Contact;
