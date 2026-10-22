export const runtime = 'nodejs';

// Formulaire de contact : envoie une alerte Telegram avec le jeton stocké sur Vercel
// (TELEGRAM_BOT_TOKEN + TELEGRAM_CONTACT_CHAT_ID). Le jeton ne passe plus jamais par le navigateur.
const hits = new Map(); // limite simple par IP (par instance serveur)
const LIMIT = 5, WINDOW = 10 * 60 * 1000;

export async function POST(request) {
    const ip = (request.headers.get('x-forwarded-for') || 'x').split(',')[0].trim();
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW);
    if (recent.length >= LIMIT) return Response.json({ ok: false, error: 'Trop de messages' }, { status: 429 });
    hits.set(ip, [...recent, now]);

    let b;
    try { b = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
    if (b.website) return Response.json({ ok: true }); // champ piège anti-robot

    const clean = (v, n) => String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, n);
    const name = clean(b.name, 120), email = clean(b.email, 160), subject = clean(b.subject, 160), message = clean(b.message, 3000);
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
        return Response.json({ ok: false, error: 'Champs invalides' }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CONTACT_CHAT_ID;
    if (!token || !chat) return Response.json({ ok: false, error: 'Configuration manquante' }, { status: 500 });

    const text = `📬 Nouveau message Briefly :\n\n👤 Nom: ${name}\n📧 Email: ${email}\n📝 Sujet: ${subject}\n💬 Message: ${message}`;
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text }),
    }).catch(() => null);
    return Response.json({ ok: !!(r && r.ok) }, { status: r && r.ok ? 200 : 502 });
}
