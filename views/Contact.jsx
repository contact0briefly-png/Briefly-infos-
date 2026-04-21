"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdBannerSquare from '../components/AdBannerSquare';
// Import Firebase pour l'envoi en Inbox
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};

// Initialisation sécurisée
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const appId = 'bbriefly-7e3b8';

// --- LOGOS OFFICIELS ---
const FacebookIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const WhatsAppIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);
const TelegramIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.83 8.12l-2.008 9.475c-.15.674-.551.84-.112.592l-3.056-2.253-1.474 1.418c-.163.163-.3.3-.614.3l.219-3.111 5.662-5.116c.246-.22-.054-.341-.378-.125l-7.001 4.409-3.013-.942c-.656-.205-.669-.656.137-.97l11.776-4.537c.545-.205 1.022.122.862.83z"/></svg>
);
const LinkedInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
);

const Contact = ({ B24_BLUE }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const TOKEN = "8575032027:AAFjP34vggDXwthT_OUZvjfCTUFogtV0G2M";
    const CHAT_ID = "7048661353";

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        const data = {
            name: e.target.name.value,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value
        };

        const text = `📬 Nouveau message Briefly :\n\n👤 Nom: ${data.name}\n📧 Email: ${data.email}\n📝 Sujet: ${data.subject}\n💬 Message: ${data.message}`;

        try {
            // 1. ENVOI VERS TELEGRAM
            const telegramPromise = fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
            });

            // 2. ENVOI VERS FIRESTORE (INBOX ADMIN)
            const firestorePromise = addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
                name: data.name,
                email: data.email,
                message: data.message,
                subject: data.subject,
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

    const socialLinks = [
        { label: "Chaîne WhatsApp", url: "https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F", color: "#25D366", x: -150, icon: <WhatsAppIcon /> },
        { label: "Canal Telegram", url: "https://t.me/brieflyinfos", color: "#0088cc", x: 150, icon: <TelegramIcon /> },
        { label: "LinkedIn", url: "https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/", color: "#0077b5", x: -150, icon: <LinkedInIcon /> },
        { label: "Bot Telegram", url: "https://t.me/Briefly_infoBot", color: "#222222", x: 150, icon: <TelegramIcon /> },
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center p-6 bg-white overflow-x-hidden selection:bg-indigo-100">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]" 
                    style={{ backgroundColor: B24_BLUE }}
                />
            </div>

            <AnimatePresence>
                {showPopup && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, y: 100, rotate: -5 }} 
                            animate={{ scale: 1, y: 0, rotate: 0 }} 
                            transition={{ type: "spring", damping: 15 }}
                            className="bg-white p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-6 text-center border-4 border-indigo-50"
                        >
                            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                                <motion.svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} d="M20 6L9 17l-5-5" />
                                </motion.svg>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Message Envoyé</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nous vous répondrons sous peu.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-50 w-full max-w-2xl mt-10 space-y-10">
                <div className="text-center space-y-6">
                    <motion.h1 
                        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
                        transition={{ type: "spring", stiffness: 100 }}
                        className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter" style={{ color: B24_BLUE }}
                    >
                        Contact<span className="text-black">.</span>
                    </motion.h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <motion.a 
                            whileHover={{ scale: 1.05 }}
                            initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            href="tel:+22879592717" className="text-2xl font-black italic hover:text-indigo-600 transition-colors"
                        >+228 79 59 27 17</motion.a>
                        <motion.a 
                            whileHover={{ y: -2 }}
                            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            href="mailto:contact0briefly@gmail.com" className="text-lg font-bold text-slate-400 border-b-2 border-slate-100 hover:border-indigo-400 transition-all"
                        >contact0briefly@gmail.com</motion.a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialLinks.map((link, i) => (
                        <motion.a 
                            key={i}
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                            transition={{ delay: 0.3 + (i * 0.1), type: "spring" }}
                            href={link.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all group overflow-hidden relative"
                        >
                            <div className="flex items-center gap-4 z-10">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: link.color }}>
                                    {link.icon}
                                </div>
                                <span className="font-black uppercase italic text-[11px] tracking-widest text-slate-800">{link.label}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm group-hover:bg-black group-hover:text-white transition-all z-10">→</div>
                        </motion.a>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: "spring" }}
                    className="bg-white/80 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] p-12 border border-white backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><WhatsAppIcon /></div>
                    
                    <div className="text-center mb-10">
                        <span className="font-black uppercase italic text-[10px] tracking-[0.3em] text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full">Envoyer une requête</span>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="name" type="text" placeholder="VOTRE NOM" required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-indigo-400 focus:bg-white transition-all font-bold text-xs uppercase tracking-widest" />
                            <input name="email" type="email" placeholder="VOTRE EMAIL" required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-indigo-400 focus:bg-white transition-all font-bold text-xs uppercase tracking-widest" />
                        </div>
                        <input name="subject" type="text" placeholder="SUJET DU MESSAGE" required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-indigo-400 focus:bg-white transition-all font-bold text-xs uppercase tracking-widest" />
                        <textarea name="message" placeholder="COMMENT POUVONS-NOUS VOUS AIDER ?" required className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent outline-none focus:border-indigo-400 focus:bg-white transition-all font-bold text-xs uppercase tracking-widest h-40 resize-none" />
                        
                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit" disabled={isSending} 
                            className="w-full py-6 text-white rounded-[2rem] font-black text-xs uppercase italic tracking-[0.3em] shadow-2xl shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3" 
                            style={{ backgroundColor: B24_BLUE }}
                        >
                            {isSending ? (
                                <span className="animate-pulse">TRANSMISSION...</span>
                            ) : (
                                <>PROPULSER LE MESSAGE <span className="text-lg">⚡</span></>
                            )}
                        </motion.button>
                    </form>

                    <div className="flex justify-center gap-12 mt-12 pt-10 border-t border-slate-50">
                        <motion.a whileHover={{ y: -5, rotate: 5 }} href="#" className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100"><FacebookIcon /></motion.a>
                        <motion.a whileHover={{ y: -5, rotate: -5 }} href="#" className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100"><WhatsAppIcon /></motion.a>
                    </div>
                </motion.div>

                <div className="flex justify-center py-6"><AdBannerSquare /></div>
            </div>
        </div>
    );
};

export default Contact;
