import crypto from 'node:crypto';

// Service account Firebase pour l'envoi des notifications push
// Peut être configuré via la variable d'environnement FIREBASE_SERVICE_ACCOUNT (JSON complet)
// ou utilise les identifiants configurés par défaut pour le projet bbriefly-7e3b8.
const DEFAULT_CLIENT_EMAIL = "firebase-adminsdk-fbsvc@bbriefly-7e3b8.iam.gserviceaccount.com";
const DEFAULT_PROJECT_ID = "bbriefly-7e3b8";

let cachedToken = null;
let tokenExpiresAt = 0;

function base64url(str) {
    return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(clientEmail, privateKey) {
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && tokenExpiresAt > now + 60) {
        return cachedToken;
    }

    const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/firebase.messaging',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now,
    }));

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${header}.${payload}`);
    const signature = signer.sign(privateKey, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const assertion = `${header}.${payload}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion,
        }),
    });

    if (!res.ok) {
        throw new Error(`Erreur jeton Firebase: ${res.statusText}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in || 3600);
    return cachedToken;
}

/**
 * Envoie une notification push FCM à tous les administrateurs abonnés au topic 'admin_alerts'.
 */
export async function sendFcmAdminNotification({ title, body, data = {} }) {
    try {
        let creds;
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else if (process.env.FIREBASE_PRIVATE_KEY) {
            creds = {
                client_email: process.env.FIREBASE_CLIENT_EMAIL || DEFAULT_CLIENT_EMAIL,
                project_id: process.env.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            };
        }

        if (!creds || !creds.private_key) {
            return { ok: false, error: 'Identifiants Firebase non configurés' };
        }

        const accessToken = await getAccessToken(creds.client_email, creds.private_key);
        const projectId = creds.project_id || DEFAULT_PROJECT_ID;

        const messagePayload = {
            message: {
                topic: 'admin_alerts',
                notification: {
                    title: title || 'Briefly Admin',
                    body: body || '',
                },
                data: {
                    targetTab: 'inbox',
                    ...data,
                },
                android: {
                    priority: 'high',
                    notification: {
                        channel_id: 'tg.BrieflyInfos.admin.notifications',
                        sound: 'default',
                        default_vibrate_timings: true,
                    },
                },
            },
        };

        const fcmRes = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(messagePayload),
        });

        if (!fcmRes.ok) {
            const errBody = await fcmRes.text();
            console.error('Erreur envoi FCM:', errBody);
            return { ok: false, error: errBody };
        }

        const result = await fcmRes.json();
        return { ok: true, result };
    } catch (e) {
        console.error('Exception lors de l\'envoi de la notification FCM:', e);
        return { ok: false, error: e.message };
    }
}
