// Vérifie qu'une requête vient d'un admin Briefly connecté (jeton Firebase + document admins/{uid}).
// Aucune clé secrète ici : on utilise le jeton de l'utilisateur lui-même.

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
    const idToken = h.startsWith('Bearer ') ? h.slice(7).trim() : '';
    if (!idToken) return null;

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!apiKey || !projectId) return null;

    // 1) Le jeton est-il valide ?
    const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
    });
    if (!r.ok) return null;
    const user = (await r.json()).users?.[0];
    if (!user?.localId) return null;

    // 2) Cet utilisateur est-il bien dans la collection « admins » ?
    const d = await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${user.localId}`,
        { headers: { Authorization: `Bearer ${idToken}` } }
    );
    if (!d.ok) return null;
    const doc = await d.json();
    return { uid: user.localId, role: doc.fields?.role?.stringValue || null };
}
