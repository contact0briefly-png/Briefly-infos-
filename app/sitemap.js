import { supabase } from "../lib/supabase";

// Cette ligne force Next.js à régénérer le sitemap au moins toutes les heures
// pour éviter que les robots ne voient une version périmée.
export const revalidate = 3600; 

export default async function sitemap() {
  const baseUrl = "https://briefly-lilac.vercel.app";

  try {
    // 1. Récupération des articles depuis Supabase (hors brouillons)
    const { data: rows, error } = await supabase
      .from('news')
      .select('id,created_at,updated_at')
      .neq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) throw error;

    const articleEntries = (rows || []).map(r => ({
      url: `${baseUrl}/article/${r.id}`,
      lastModified: new Date(r.updated_at || r.created_at),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

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
        url: `${baseUrl}/a-propos`,
        lastModified: new Date('2026-10-23'),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date('2026-10-23'),
        changeFrequency: 'monthly',
        priority: 0.4,
      },
      {
        url: `${baseUrl}/mentionslegales`,
        lastModified: new Date('2026-04-22'),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    return [...staticPages, ...articleEntries];

  } catch (error) {
    console.error("Erreur lors de la génération du sitemap :", error);
    // En cas d'erreur de base de données, on renvoie au moins l'accueil pour éviter une page 404
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
