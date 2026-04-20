import React, { useEffect, useRef } from 'react';

const AdBannerSquare = () => {
    const bannerRef = useRef(null);

    useEffect(() => {
        // On vérifie si le script n'est pas déjà chargé dans ce conteneur
        if (bannerRef.current && !bannerRef.current.firstChild) {
            const conf = document.createElement('script');
            const script = document.createElement('script');
            
            conf.innerHTML = `
                atOptions = {
                    'key' : '39557b33b1efb3a6d60c7362edb2d5f4',
                    'format' : 'iframe',
                    'height' : 250,
                    'width' : 300,
                    'params' : {}
                };
            `;
            
            script.src = "https://www.highperformanceformat.com/39557b33b1efb3a6d60c7362edb2d5f4/invoke.js";
            
            bannerRef.current.appendChild(conf);
            bannerRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="flex flex-col items-center my-8">
            <span className="text-[9px] opacity-30 uppercase tracking-widest mb-2 italic font-bold">Publicité</span>
            <div 
                ref={bannerRef} 
                className="bg-gray-50 min-h-[250px] min-w-[300px] flex items-center justify-center border border-gray-100 shadow-sm"
            >
                {/* La bannière Adsterra s'affichera ici */}
            </div>
        </div>
    );
};

export default AdBannerSquare;
