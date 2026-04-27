import { db } from "../../../lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import ArticleView from "../../../views/ArticleView";

export async function generateMetadata({ params }) {
    const { slug } = params;
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
                alternates: { canonical: articleUrl },
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

    const newsSnap = await getDocs(collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'));
    
    // CORRECTION ICI : On transforme le Timestamp Firebase en un objet simple {seconds: ...}
    // pour que Next.js accepte de le passer au composant Client
    const allNews = newsSnap.docs.map(d => {
        const data = d.data();
        const ts = data.timestamp || data.lastUpdate;
        return { 
            id: d.id, 
            ...data,
            timestamp: ts ? { seconds: ts.seconds } : null 
        };
    });

    if (!docSnap.exists()) {
        return <div className="p-10 text-center font-bold">Article introuvable</div>;
    }

    const docData = docSnap.data();
    const articleTs = docData.timestamp || docData.lastUpdate;

    const articleData = { 
        id: docSnap.id, 
        ...docData,
        timestamp: articleTs ? { seconds: articleTs.seconds } : null
    };

    return <ArticleView article={articleData} news={allNews} B24_BLUE="#0047FF" />;
}
