import { db } from "../../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ArticleView from "../../../views/ArticleView";

// FONCTION CRUCIALE POUR LE SEO ET LES RÉSEAUX SOCIAUX
export async function generateMetadata({ params }) {
    const { slug } = params; // slug est l'ID de l'article

    try {
        const docRef = doc(db, 'artifacts/bbriefly-7e3b8/public/data/news', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const article = docSnap.data();
            const description = article.summary || article.content?.replace(/<[^>]*>/g, '').slice(0, 150);
            const articleUrl = `/article/${slug}`;

            return {
                title: article.title,
                description: description,
                // --- CORRECTION CANONIQUE ---
                // Cela indique à Google l'URL exacte de l'article au lieu de l'accueil
                alternates: {
                    canonical: articleUrl,
                },
                openGraph: {
                    title: article.title,
                    description: description,
                    url: `https://briefly-lilac.vercel.app${articleUrl}`,
                    images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630 }] : [],
                    type: 'article',
                    siteName: 'Briefly',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: article.title,
                    description: description,
                    images: [article.imageUrl],
                },
            };
        }
    } catch (e) {
        return { title: "Briefly | Article" };
    }
}

export default async function Page({ params }) {
    const { slug } = params;

    const docRef = doc(db, 'artifacts/bbriefly-7e3b8/public/data/news', slug);
    const docSnap = await getDoc(docRef);

    // Optimisation : On ne récupère que les docs nécessaires (ou on limite) pour alléger le chargement
    const newsSnap = await getDocs(collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'));
    const allNews = newsSnap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        // Sérialisation des dates pour éviter les erreurs Next.js
        timestamp: d.data().timestamp ? d.data().timestamp.toDate().toISOString() : null 
    }));

    if (!docSnap.exists()) {
        return <div className="p-10 text-center font-bold">Article introuvable</div>;
    }

    const articleData = { 
        id: docSnap.id, 
        ...docSnap.data(),
        timestamp: docSnap.data().timestamp ? docSnap.data().timestamp.toDate().toISOString() : null
    };

    return <ArticleView article={articleData} news={allNews} B24_BLUE="#0047FF" />;
}
