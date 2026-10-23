// Vérifie qu'une requête vient d'un admin Briefly connecté (jeton Supabase + profil dans « profiles »).
// Aucune clé secrète : on s'appuie sur le jeton de l'utilisateur et sur les règles RLS.

export const CORS = {
    'Access-Control-Allow-Origin': '*', // protégé par le jeton Bearer, pas par les cookies
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
};

export const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS } });

export const preflight = () => new Response(null, { status: 204, headers: CORS });

export async function verifyAdmin(request) {
    const h = request.headers.get('authorization') || '';
    const token = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!token || !url || !key) return null;

    const headers = { apikey: key, Authorization: `Bearer ${token}` };
    // 1) Le jeton est-il valide ?
    const u = await fetch(`${url}/auth/v1/user`, { headers });
    if (!u.ok) return null;
    const user = await u.json();
    if (!user?.id) return null;
    // 2) Cet utilisateur a-t-il un profil admin ? (lecture publique, filtrée par user_id)
    const p = await fetch(`${url}/rest/v1/profiles?user_id=eq.${encodeURIComponent(user.id)}&select=role`, { headers });
    if (!p.ok) return null;
    const row = (await p.json())[0];
    if (!row || !['admin_general', 'redacteur'].includes(row.role)) return null;
    return { uid: user.id, role: row.role };
}
