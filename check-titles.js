const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Remplace par ta configuration Firebase réelle 
// (Tu peux la copier depuis ton fichier lib/firebase.js)
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.appspot.com",
    messagingSenderId: "TON_ID",
    appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkTitles() {
    console.log("🔍 Analyse des titres en cours...\n");
    
    try {
        // Utilisation du chemin exact de ta collection d'après ton sitemap
        const newsRef = collection(db, 'artifacts/bbriefly-7e3b8/public/data/news');
        const snapshot = await getDocs(newsRef);
        
        let count = 0;

        snapshot.forEach(doc => {
            const data = doc.data();
            const title = data.title || "Sans titre";
            
            if (title.length > 70) {
                count++;
                console.log(`❌ [${title.length} chars] - ID: ${doc.id}`);
                console.log(`   Titre: "${title}"`);
                console.log("---");
            }
        });

        if (count === 0) {
            console.log("✅ Félicitations ! Aucun titre ne dépasse 70 caractères.");
        } else {
            console.log(`⚠️  Total : ${count} articles à corriger pour le SEO.`);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
    }
}

checkTitles();
