import { B24_BLUE } from "../lib/constants";
import { getNewsList } from "../lib/news";
import Home from "../views/Home";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- AJOUT DES MÉTADONNÉES POUR LE SEO ---
export async function generateMetadata({ searchParams }) {
    const cat = searchParams.cat;
    const siteTitle = "Briefly | L'actualité au Togo et à l'International";
    const description = "Retrouvez l'essentiel de l'info : sport, économie, et actualités au Togo en un clic sur Briefly.";
    const logoUrl = 'https://briefly-lilac.vercel.app/apple-touch-icon.png';

    return {
        title: cat ? `${cat} - ${siteTitle}` : siteTitle,
        description: description,
        // Balise Canonique dynamique (importante pour Google)
        alternates: {
            canonical: cat ? `/?cat=${cat}` : '/',
        },
        openGraph: {
            title: cat ? `${cat} - Briefly` : siteTitle,
            description: description,
            url: 'https://briefly-lilac.vercel.app',
            siteName: 'Briefly',
            images: [
                {
                    url: logoUrl,
                    width: 512,
                    height: 512,
                    alt: 'Briefly Logo',
                },
            ],
            locale: 'fr_FR',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: cat ? `${cat} - Briefly` : siteTitle,
            description: description,
            images: [logoUrl],
        },
    };
}

export default async function Page({ searchParams }) {
    const cat = searchParams.cat || "";

    // Récupération des news
    const news = await getNewsList();

    return (
        <main>
            <Home 
                news={news} 
                searchTerm={cat} 
                B24_BLUE={B24_BLUE} 
            />
        </main>
    );
}
