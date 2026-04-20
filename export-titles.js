const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');

// Configuration extraite de tes logs précédents
const firebaseConfig = {
    projectId: "bbriefly-7e3b8",
    // Note : Pour un export simple via Firestore Admin ou Client sans authentification 
    // particulière, le projectId suffit souvent si les règles le permettent.
    // Si cela échoue, ajoute ton apiKey et ton appId ici.
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function exportForCorrection() {
    console.log("⏳ Connexion à Firebase et extraction des titres...");
    
    try {
        const newsRef = collection(db, 'artifacts/bbriefly-7e3b8/public/data/news');
        const snapshot = await getDocs(newsRef);
        
        // Utilisation du point-virgule comme séparateur pour une ouverture facile dans Excel/Sheets
        let csvContent = "id;length;title\n";
        let count = 0;

        snapshot.forEach(doc => {
            const title = doc.data().title || "";
            if (title.length > 70) {
                // On remplace les éventuels points-virgules dans le titre pour ne pas casser le CSV
                const cleanTitle = title.replace(/;/g, ',');
                csvContent += `${doc.id};${title.length};${cleanTitle}\n`;
                count++;
            }
        });

        fs.writeFileSync('titles_to_fix.csv', csvContent);
        console.log(`\n✅ Succès ! ${count} titres exportés dans 'titles_to_fix.csv'.`);
        console.log("Tu peux maintenant éditer ce fichier pour raccourcir les titres.");
    } catch (error) {
        console.error("❌ Erreur lors de l'export :", error);
    }
}

exportForCorrection();
