'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, X, Cookie } from 'lucide-react';

export default function CookieBanner({ B24_BLUE }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifie le choix stocké
    const consent = localStorage.getItem('briefly-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('briefly-cookie-consent', choice);
    setShowBanner(false);
    
    // Si l'utilisateur refuse, on peut forcer un rechargement pour couper les scripts actifs
    if (choice === 'false') {
      window.location.reload(); 
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-10 md:max-w-md bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 z-[9999] rounded-[2rem] animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0" style={{ color: B24_BLUE }}>
            <Cookie size={24} />
          </div>
          <div>
            <h3 className="font-serif italic font-black text-xl text-slate-900 italic">Vie privée & Cookies.</h3>
            <p className="text-[13px] leading-relaxed text-slate-500 mt-2 font-medium">
              Nous utilisons des cookies pour optimiser votre lecture et analyser notre audience. En acceptant, vous nous aidez à faire vivre <span className="font-bold text-slate-900">Briefly</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
           <button 
            onClick={() => handleConsent('false')}
            className="w-full sm:w-auto px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Refuser tout
          </button>
          <button 
            onClick={() => handleConsent('true')}
            className="w-full flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: B24_BLUE }}
          >
            <ShieldCheck size={16} />
            Accepter & Continuer
          </button>
        </div>
        
        <p className="text-[9px] text-center text-slate-300 uppercase font-bold tracking-tighter">
            Conforme au RGPD & Protection des données
        </p>
      </div>
    </div>
  );
}
