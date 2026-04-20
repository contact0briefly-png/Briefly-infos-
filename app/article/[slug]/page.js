import { db } from "../../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ArticleView from "../../../views/ArticleView";

// FONCTION CRUCIALE POUR WHATSAPP/FACEBOOK
export async function generateMetadata({ params }) {
    const { slug } = params; // slug est l'ID de l'article
    
    try {
        const docRef = doc(db, 'artifacts/bbriefly-7e3b8/public/data/news', slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const article = docSnap.data();
            const description = article.summary || article.content?.replace(/<[^>]*>/g, '').slice(0, 150);

            return {
                title: article.title,
                description: description,
                openGraph: {
                    title: article.title,
                    description: description,
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

    const newsSnap = await getDocs(collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'));
    const allNews = newsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (!docSnap.exists()) {
        return <div className="p-10 text-center font-bold">Article introuvable</div>;
    }

    const articleData = { id: docSnap.id, ...docSnap.data() };
    return <ArticleView article={articleData} news={allNews} B24_BLUE="#0047FF" />;
}
