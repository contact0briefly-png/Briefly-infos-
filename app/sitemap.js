import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

// Cette ligne force Next.js à régénérer le sitemap au moins toutes les heures
// pour éviter que les robots ne voient une version périmée.
export const revalidate = 3600; 

export default async function sitemap() {
  const baseUrl = "https://briefly-lilac.vercel.app";

  try {
    // 1. Récupération optimisée depuis Firebase
    const q = query(
      collection(db, 'artifacts/bbriefly-7e3b8/public/data/news'), 
      orderBy('timestamp', 'desc'),
      limit(1000) 
    );

    const newsSnap = await getDocs(q);

    const articleEntries = newsSnap.docs.map(doc => {
      const data = doc.data();
      
      // Sécurité : conversion du Timestamp Firebase en Date ISO
      let lastMod = new Date();
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        lastMod = data.timestamp.toDate();
      } else if (data.date) {
        lastMod = new Date(data.date);
      }

      return {
        url: `${baseUrl}/article/${doc.id}`,
        lastModified: lastMod,
        changeFrequency: 'daily',
        priority: 0.9,
      };
    });

    // 2. Détermination de la date de l'accueil (indexée sur le dernier article)
    const latestNewsDate = articleEntries.length > 0 ? articleEntries[0].lastModified : new Date();

    const staticPages = [
      {
        url: baseUrl,
        lastModified: latestNewsDate,
        changeFrequency: 'always', 
        priority: 1.0,
      },
      {
        url: `${baseUrl}/confidentialite`,
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

  } catch (error) {
    console.error("Erreur lors de la génération du sitemap :", error);
    // En cas d'erreur Firebase, on renvoie au moins l'accueil pour éviter une page 404
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1.0,
      },
    ];
  }
}
