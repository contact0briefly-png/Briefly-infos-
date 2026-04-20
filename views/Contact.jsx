"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdBannerSquare from '../components/AdBannerSquare';

const FacebookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const WhatsAppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
            });
            if (response.ok) {
                setShowPopup(true);
                e.target.reset();
                setTimeout(() => setShowPopup(false), 4000);
            }
        } catch (error) { console.error(error); } finally { setIsSending(false); }
    };

    const socialLinks = [
        { label: "Chaîne WhatsApp", url: "https://whatsapp.com/channel/0029Vb7SpWT1noz3Vmj7PK3F", color: "#25D366", x: -150 },
        { label: "Canal Telegram", url: "https://t.me/brieflyinfos", color: "#0088cc", x: 150 },
        { label: "LinkedIn", url: "https://www.linkedin.com/company/briefly-l-info-%C3%A0-l-essentiel/", color: "#0077b5", x: -150 },
        { label: "Bot Telegram", url: "https://t.me/Briefly_infoBot", color: "#222222", x: 150 },
    ];

    return (
        <div className="relative min-h-screen flex flex-col items-center p-6 bg-white overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.05]" style={{ backgroundColor: B24_BLUE }}></div>
            </div>

            <AnimatePresence>
                {showPopup && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.7, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 text-center">
                            <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
                                <motion.svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} d="M20 6L9 17l-5-5" />
                                </motion.svg>
                            </div>
                            <h2 className="text-xl font-black uppercase italic tracking-tighter">Transmission Réussie</h2>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-50 w-full max-w-2xl mt-10 space-y-10">
                <div className="text-center space-y-6">
                    <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter" style={{ color: B24_BLUE }}>
                        Contact<span className="text-black">.</span>
                    </motion.h1>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <motion.a initial={{ x: -150, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} href="tel:+22879592717" className="text-2xl font-black italic">+228 79 59 27 17</motion.a>
                        <motion.a initial={{ x: 150, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }} href="mailto:contact0briefly@gmail.com" className="text-lg font-bold text-gray-400 border-b border-gray-100">contact0briefly@gmail.com</motion.a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialLinks.map((link, i) => (
                        <motion.a 
                            key={i}
                            initial={{ x: link.x, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ delay: 0.3 + (i * 0.1), duration: 0.6 }}
                            href={link.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all group"
                        >
                            <span className="font-black uppercase italic text-[11px] tracking-widest">{link.label}</span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: link.color }}>→</div>
                        </motion.a>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="bg-white/70 rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.1)] p-10 border border-white backdrop-blur-2xl"
                >
                    <div className="text-center mb-8 font-black uppercase italic text-[10px] tracking-widest opacity-30">Envoyer une requête</div>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <input name="name" type="text" placeholder="NOM COMPLET" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-400 transition-all font-bold text-xs" />
                        <input name="email" type="email" placeholder="ADRESSE EMAIL" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-400 transition-all font-bold text-xs" />
                        <input name="subject" type="text" placeholder="SUJET" required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-400 transition-all font-bold text-xs" />
                        <textarea name="message" placeholder="VOTRE MESSAGE..." required className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-blue-400 transition-all font-bold text-xs h-32 resize-none" />
                        <button type="submit" disabled={isSending} className="w-full py-5 text-white rounded-2xl font-black text-xs uppercase italic tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50" style={{ backgroundColor: B24_BLUE }}>
                            {isSending ? "ENVOI EN COURS..." : "ENVOYER LE MESSAGE"}
                        </button>
                    </form>
                    <div className="flex justify-center gap-10 mt-10 pt-8 border-t border-gray-50">
                        <a href="#" className="hover:scale-110 transition-transform"><FacebookIcon /></a>
                        <a href="#" className="hover:scale-110 transition-transform"><WhatsAppIcon /></a>
                    </div>
                </motion.div>

                <div className="flex justify-center py-6"><AdBannerSquare /></div>
            </div>
        </div>
    );
};

export default Contact;
