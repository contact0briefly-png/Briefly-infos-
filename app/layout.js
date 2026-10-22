import "./globals.css";
import { AdBanner } from "@/components/AdManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { B24_BLUE } from "@/lib/constants";
import ConsentScripts from "@/components/ConsentScripts";

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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col antialiased">
       
        {/* Pub : tout en haut, au-dessus de la barre de navigation */}
        <AdBanner />
        <Navbar B24_BLUE={B24_BLUE} />
        <main className="flex-grow">{children}</main>
        <Footer B24_BLUE={B24_BLUE} />
        <CookieBanner B24_BLUE={B24_BLUE} />
        <ConsentScripts />
      </body>
    </html>
  );
}
