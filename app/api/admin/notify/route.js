import { json, preflight, verifyAdmin } from '@/lib/adminAuth';

export const runtime = 'nodejs';
export const OPTIONS = preflight;

// Notifie Telegram + WebPushr à la publication d'un article.
// Clés lues dans les variables Vercel : TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
// WEBPUSHR_KEY_1/2 et WEBPUSHR_TOKEN_1/2.
export async function POST(request) {
    if (!(await verifyAdmin(request))) return json({ ok: false, error: 'Non autorisé' }, 401);

    let b;
    try { b = await request.json(); } catch { return json({ ok: false, error: 'Requête invalide' }, 400); }
    const title = String(b.title || '').slice(0, 200);
    const message = String(b.message || '').slice(0, 300);
    const url = String(b.url || '');
    const image = String(b.image || '');
    if (!title || !/^https:\/\//.test(url)) return json({ ok: false, error: 'Champs invalides' }, 400);

    const site = process.env.SITE_URL || 'https://briefly-lilac.vercel.app';
    const out = { telegram: false, webpush: [] };

    // ── Telegram ──
    const tgToken = process.env.TELEGRAM_BOT_TOKEN, tgChat = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChat) {
        const cap = `📢 *NOUVEL ARTICLE*\n\n🚀 *${title.toUpperCase()}*\n\n${message}\n\n🔗 ${url}`;
        const call = (method, payload) => fetch(`https://api.telegram.org/bot${tgToken}/${method}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
        let r = image
            ? await call('sendPhoto', { chat_id: tgChat, photo: image, caption: cap, parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [[{ text: "📖 LIRE L'ARTICLE", url }]] } }).catch(() => null)
            : null;
        if (!r || !r.ok) r = await call('sendMessage', { chat_id: tgChat, text: cap, parse_mode: 'Markdown' }).catch(() => null);
        out.telegram = !!(r && r.ok);
    }

    // ── WebPushr (deux canaux) ──
    const channels = [
        [process.env.WEBPUSHR_KEY_1, process.env.WEBPUSHR_TOKEN_1],
        [process.env.WEBPUSHR_KEY_2, process.env.WEBPUSHR_TOKEN_2],
    ].filter(([k, t]) => k && t);
    out.webpush = await Promise.all(channels.map(([k, t]) =>
        fetch('https://api.webpushr.com/v1/notification/send/all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', webpushrKey: k, webpushrAuthToken: t },
            body: JSON.stringify({ title, message, target_url: url, icon: `${site}/logo.jpg`, image }),
        }).then(r => r.ok).catch(() => false)
    ));

    return json({ ok: true, ...out });
}
