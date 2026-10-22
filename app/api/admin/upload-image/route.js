import { CORS, json, preflight, verifyAdmin } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const OPTIONS = preflight;

// Envoie une image vers ImgBB avec la clé secrète stockée sur Vercel (IMGBB_KEY).
export async function POST(request) {
    if (!(await verifyAdmin(request))) return json({ success: false, error: 'Non autorisé' }, 401);
    if (!process.env.IMGBB_KEY) return json({ success: false, error: 'IMGBB_KEY manquante' }, 500);

    let file;
    try { file = (await request.formData()).get('image'); }
    catch { return json({ success: false, error: 'Requête invalide' }, 400); }
    if (!file || typeof file === 'string') return json({ success: false, error: 'Image manquante' }, 400);
    if (!String(file.type).startsWith('image/')) return json({ success: false, error: 'Fichier non image' }, 400);

    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`, { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!data.success) return json({ success: false, error: 'ImgBB a refusé l\'image' }, 502);
    return json({ success: true, url: data.data.url });
}
