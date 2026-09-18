import "./globals.css";
import AdManager from "@/components/AdManager";
import { AdBanner } from "@/components/AdManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { B24_BLUE } from "@/lib/firebase";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  // ... tes métadonnées restent inchangées
  metadataBase: new URL('https://briefly-lilac.vercel.app'),
  alternates: { canonical: '/' },
  title: "Briefly | L'info à l'essentiel",
  description: "Plateforme d'actualités rapides et concises au Togo et dans le monde.",
  manifest: "/manifest.json",
  themeColor: "#0077b5",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Briefly" },
  verification: { google: "cnRndWtUxDTqXs3A21i56qGSx2DWF4jNwQVFAP0Ac_I" },
  other: { "google-adsense-account": "ca-pub-7972578599056246" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="https://bbriefly-7e3b8.web.app/apple-touch-icon.png" />
        
        {/* --- AJOUT INDISPENSABLE : SCRIPT TWITTER GLOBAL --- */}
        <Script 
          src="https://platform.twitter.com/widgets.js" 
          strategy="lazyOnload" 
        />

        <Script
          id="adsense-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage.getItem('briefly-cookie-consent') === 'true') {
                (function() {
                  var ad = document.createElement('script');
                  ad.async = true;
                  ad.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7972578599056246";
                  ad.crossOrigin = "anonymous";
                  document.head.appendChild(ad);
                })();
              }
            `,
          }}
        />
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col antialiased">
       
        <Navbar B24_BLUE={B24_BLUE} />
        <main className="flex-grow">{children}</main>
        <Footer B24_BLUE={B24_BLUE} />
        <CookieBanner B24_BLUE={B24_BLUE} />

        <Script id="webpushr-setup" strategy="afterInteractive">
          {`
            if (localStorage.getItem('briefly-cookie-consent') === 'true') {
              (function(w,d, s, id) {if(typeof(w.webpushr)!=='undefined') return;w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};var js, fjs = d.getElementsByTagName(s)[0];js = d.createElement(s); js.id = id;js.async=1;js.src = "https://cdn.webpushr.com/app.min.js";
              fjs.parentNode.appendChild(js);}(window,document, 'script', 'webpushr-jssdk'));
              webpushr('setup',{'key':'BOAI8WZjrONBOT3bQhrF6i9FfsXUnw0UmucEgSqzae8y2kAjugYPjWXnlwXV4CJ2gz82aHTMNegMuJsziHe9WMo' });
            }
          `}
        </Script>

        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
