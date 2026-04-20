import { db, B24_BLUE } from "../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Home from "../views/Home";

// --- AJOUT DES MÉTADONNÉES POUR LE SEO ---
export async function generateMetadata({ searchParams }) {
    const cat = searchParams.cat;
    const siteTitle = "Briefly | L'actualité au Togo et à l'International";
    const description = "Retrouvez l'essentiel de l'info : sport, économie, et actualités au Togo en un clic sur Briefly.";

    return {
        title: cat ? `${cat} - ${siteTitle}` : siteTitle,
        description: description,
        openGraph: {
            title: siteTitle,
            description: description,
            url: 'https://briefly-lilac.vercel.app',
            siteName: 'Briefly',
            images: [
                {
                    url: 'https://briefly-lilac.vercel.app/logo.jpg', // Assure-toi que ton logo est là
                    width: 800,
                    height: 600,
                },
            ],
            locale: 'fr_FR',
            type: 'website',
        },
    };
}

export default async function Page({ searchParams }) {
    const cat = searchParams.cat || "";
    
    // Récupération des news
    const q = query(
        collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'), 
        orderBy('timestamp', 'desc')
    );
    const snap = await getDocs(q);
    
    // Transformation des données pour inclure les dates correctement (évite les erreurs de sérialisation)
    const news = snap.docs.map(d => {
        const data = d.data();
        return { 
            id: d.id, 
            ...data,
            // On s'assure que le timestamp ne fait pas planter le passage Client/Serveur
            timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : null 
        };
    });

    return (
        <main>
            {/* On enveloppe dans <main> pour la sémantique Google */}
            <Home 
                news={news} 
                searchTerm={cat} 
                B24_BLUE={B24_BLUE} 
            />
        </main>
    );
}