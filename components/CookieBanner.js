'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('briefly-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('briefly-cookie-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md bg-white border border-gray-200 shadow-2xl p-6 z-[9999] rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-lg text-black">Respect de votre vie privée</h3>
          <p className="text-sm text-gray-600 mt-1">
            Briefly utilise des cookies pour analyser l'audience et améliorer votre expérience sur notre plateforme d'actualités.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => setShowBanner(false)}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Plus tard
          </button>
          <button 
            onClick={acceptCookies}
            className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
          >
            Accepter tout
          </button>
        </div>
      </div>
    </div>
  );
}
