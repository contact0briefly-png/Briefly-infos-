import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function sitemap() {
  const baseUrl = "https://briefly-lilac.vercel.app";

  // 1. On récupère tous les articles depuis Firebase
  const newsSnap = await getDocs(collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'));
  
  const articleEntries = newsSnap.docs.map(doc => {
    const data = doc.data();
    
    // On essaie de récupérer une vraie date de modification
    // Si data.timestamp existe (Firebase Timestamp), on l'utilise, sinon Date du jour
    const lastMod = data.timestamp ? new Date(data.timestamp.seconds * 1000) : new Date();

    return {
      url: `${baseUrl}/article/${doc.id}`,
      lastModified: lastMod,
      // 'weekly' est bien mieux pour le SEO d'un site de news que 'monthly'
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  // 2. On ajoute les pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always', // L'accueil change tout le temps
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3, // Le contact est moins prioritaire que les news
    },
  ];

  return [...staticPages, ...articleEntries];
}