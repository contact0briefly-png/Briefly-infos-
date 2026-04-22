"use client";
import React, { useState } from 'react';
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
            const telegramPromise = fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
            });

            const firestorePromise = addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
                ...data,
                timestamp: serverTimestamp()
            });

            await Promise.all([telegramPromise, firestorePromise]);

            setShowPopup(true);
            e.target.reset();
            setTimeout(() => setShowPopup(false), 4000);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-[#f6f6f8] min-h-screen font-sans antialiased text-slate-900">
            {/* Popup Succès */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 text-center max-w-sm"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif italic font-black text-slate-900">Message envoyé !</h2>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Merci, nous revenons vers vous très vite.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* Colonne Gauche : Formulaire */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="mb-12">
                            <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                                Centre de Support
                            </span>
                            <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight tracking-tighter text-slate-900 italic">
                                Commençons une <br/><span style={{ color: B24_BLUE }}>conversation.</span>
                            </h1>
                            <p className="mt-6 text-lg text-slate-500 font-medium max-w-md">
                                Des questions sur notre processus éditorial ou envie de collaborer ? Notre équipe répond généralement en moins de 24h.
                            </p>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nom Complet</label>
                                    <input name="name" required className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4" placeholder="Votre nom..." type="text"/>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                                    <input name="email" required className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4" placeholder="email@exemple.com" type="email"/>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Sujet</label>
                                <select name="subject" className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 appearance-none">
                                    <option>Demande Générale</option>
                                    <option>Presse & Média</option>
                                    <option>Partenariats</option>
                                    <option>Support Technique</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                <textarea name="message" required rows="5" className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button 
                                disabled={isSending}
                                type="submit" 
                                className="flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50"
                                style={{ backgroundColor: B24_BLUE, shadowColor: `${B24_BLUE}40` }}
                            >
                                {isSending ? "Transmission..." : "Envoyer le message"}
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>

                    {/* Colonne Droite : Infos & Map */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="rounded-[2rem] border border-white bg-white p-8 shadow-sm transition-all hover:shadow-md">
                                <MapPin className="mb-4 text-primary" size={32} style={{ color: B24_BLUE }} />
                                <h3 className="font-serif italic font-black text-xl mb-2">Notre Bureau</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    Lomé, Sanguéra<br/>République Togolaise
                                </p>
                            </div>
                            <div className="rounded-[2rem] border border-white bg-white p-8 shadow-sm transition-all hover:shadow-md">
                                <Mail className="mb-4 text-primary" size={32} style={{ color: B24_BLUE }} />
                                <h3 className="font-serif italic font-black text-xl mb-2">Contact Direct</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    contact0briefly@gmail.com<br/>+228 79 59 27 17
                                </p>
                            </div>
                        </div>

                        {/* Fausse Map / Image d'illustration Localisation */}
                        <div className="overflow-hidden rounded-[2.5rem] border border-white bg-slate-200 h-[300px] relative group shadow-lg">
                            <div 
                                className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" 
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=2000')" }}
                            />
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                            <a 
                                href="https://maps.google.com" target="_blank" rel="noreferrer"
                                className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-white/90 p-4 backdrop-blur-md hover:bg-white transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: B24_BLUE }}>
                                        <Navigation size={16} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest">Voir sur la carte</span>
                                </div>
                                <ExternalLink size={16} className="text-slate-400" />
                            </a>
                        </div>

                        <div>
                            <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Rejoignez la communauté</h4>
                            <div className="flex gap-4">
                                {[
                                    { name: 'WhatsApp', url: 'https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F' },
                                    { name: 'Telegram', url: 'https://t.me/brieflyinfos' },
                                    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/' }
                                ].map((social) => (
                                    <a 
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex h-14 px-6 items-center justify-center rounded-2xl bg-white text-xs font-black uppercase tracking-widest text-slate-600 shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all"
                                    >
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        
                        <div className="py-4">
                            <AdBannerSquare />
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
