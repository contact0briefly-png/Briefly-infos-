import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default async function sitemap() {
  const baseUrl = "https://briefly-lilac.vercel.app";

  // 1. Récupération optimisée : on trie par date et on peut limiter si besoin (ex: 500 derniers)
  const q = query(
    collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'), 
    orderBy('timestamp', 'desc'),
    limit(1000) 
  );
  
  const newsSnap = await getDocs(q);

  const articleEntries = newsSnap.docs.map(doc => {
    const data = doc.data();
    // Utilisation d'une méthode plus propre pour le timestamp Firebase
    const lastMod = data.timestamp?.toDate() || new Date();

    return {
      url: `${baseUrl}/article/${doc.id}`,
      lastModified: lastMod,
      // 'daily' est le standard pour l'actualité
      changeFrequency: 'daily',
      priority: 0.9, // Très haute priorité pour les articles
    };
  });

  // 2. Détermination de la date de l'accueil (doit correspondre à la news la plus récente)
  const latestNewsDate = articleEntries.length > 0 ? articleEntries[0].lastModified : new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: latestNewsDate, // L'accueil est considéré "modifié" quand une news sort
      changeFrequency: 'always', 
      priority: 1.0,
    },
    {
      url: `${baseUrl}/confidentialite`, // N'oublie pas tes nouvelles pages !
      lastModified: new Date('2026-04-22'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date('2026-04-22'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticPages, ...articleEntries];
}
