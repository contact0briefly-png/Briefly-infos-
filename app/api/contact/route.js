export const runtime = 'nodejs';

import { supabase } from '@/lib/supabase';
import { sendFcmAdminNotification } from '@/lib/fcm';

// Formulaire de contact : 
// 1. Enregistre la demande dans la table Supabase requests (accessible dans l'admin)
// 2. Envoie une alerte Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CONTACT_CHAT_ID)
// 3. Déclenche une notification push instantanée sur l'application mobile Android Briefly Admin
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

    // 1. Enregistrement dans Supabase (table requests)
    try {
        await supabase.from('requests').insert({
            name,
            email,
            subject: subject || 'Sans sujet',
            message,
            replied: false,
        });
    } catch (dbErr) {
        console.error('Erreur insertion Supabase requests:', dbErr);
    }

    // 2. Notification push FCM pour l'application mobile Android Briefly Admin
    try {
        await sendFcmAdminNotification({
            title: `📬 Message de ${name}`,
            body: subject ? `${subject} : ${message.slice(0, 80)}…` : message.slice(0, 100),
            data: {
                senderName: name,
                senderEmail: email,
                subject: subject || '',
            },
        });
    } catch (fcmErr) {
        console.error('Erreur notification push FCM:', fcmErr);
    }

    // 3. Alerte Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CONTACT_CHAT_ID;
    if (token && chat) {
        const text = `📬 Nouveau message Briefly :\n\n👤 Nom: ${name}\n📧 Email: ${email}\n📝 Sujet: ${subject}\n💬 Message: ${message}`;
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chat, text }),
        }).catch(() => null);
    }

    return Response.json({ ok: true });
}
