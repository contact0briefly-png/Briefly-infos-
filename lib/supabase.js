import { createClient } from '@supabase/supabase-js';

// Clé « publishable » : publique par conception. La sécurité repose sur les règles RLS de la base.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Pas de cache Next.js sur les requêtes : le contenu doit toujours être à jour
    global: { fetch: (u, o = {}) => fetch(u, { ...o, cache: 'no-store' }) },
});
