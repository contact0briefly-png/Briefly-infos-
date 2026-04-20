const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

// Ton fichier de clé
const KEY_FILE = './bbriefly-7e3b8-firebase-adminsdk-fbsvc-7a753c048c.json';
const PROJECT_ID = 'bbriefly-7e3b8';

async function run() {
    console.log("🚀 [REST MODE] Démarrage de la mise à jour...");

    // Authentification
    const auth = new GoogleAuth({
        keyFile: KEY_FILE,
        scopes: ['https://www.googleapis.com/auth/datastore'],
    });
    const client = await auth.getClient();
    const token = (await client.getAccessToken()).token;

    // Lecture du CSV
    const csvData = fs.readFileSync('titles_to_fix.csv', 'utf8');
    const lines = csvData.split('\n').slice(1);

    let count = 0;
    for (let line of lines) {
        if (!line.trim()) continue;
        const [id, length, newTitle] = line.split(';');

        // URL de l'API REST Firestore
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/artifacts/${PROJECT_ID}/public/data/news/${id}?updateMask.fieldPaths=title`;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        title: { stringValue: newTitle.trim() }
                    }
                })
            });

            if (response.ok) {
                console.log(`✅ Mis à jour : ${id}`);
                count++;
            } else {
                const err = await response.json();
                console.error(`❌ Erreur ${id}:`, err.error.message);
            }
        } catch (e) {
            console.error(`❌ Erreur réseau pour ${id}:`, e.message);
        }
    }
    console.log(`\n✨ Terminé ! ${count} articles mis à jour.`);
}

run();
