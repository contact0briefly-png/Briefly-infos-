const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const fs = require('fs');

// Ta configuration Firebase (ProjectId suffit pour Termux)
const firebaseConfig = {
    projectId: "bbriefly-7e3b8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importCorrectedTitles() {
    console.log("🚀 Début de la mise à jour des titres sur Firebase...");

    try {
        // Lecture du fichier CSV
        const data = fs.readFileSync('titles_to_fix.csv', 'utf8');
        const lines = data.split('\n');

        let updatedCount = 0;

        for (let i = 1; i < lines.length; i++) { // On commence à 1 pour sauter l'en-tête
            const line = lines[i].trim();
            if (!line) continue;

            // On sépare par point-virgule
            const [id, length, newTitle] = line.split(';');

            if (id && newTitle) {
                try {
                    // Chemin de ton document d'après ta structure
                    const docRef = doc(db, 'artifacts/bbriefly-7e3b8/public/data/news', id);
                    
                    await updateDoc(docRef, {
                        title: newTitle.trim()
                    });
                    
                    console.log(`✅ [${i}] Mis à jour : ${id}`);
                    updatedCount++;
                } catch (err) {
                    console.error(`❌ Erreur pour l'ID ${id} :`, err.message);
                }
            }
        }

        console.log(`\n✨ Terminé ! ${updatedCount} articles ont été optimisés pour le SEO.`);
    } catch (error) {
        console.error("❌ Erreur lors de la lecture du fichier CSV :", error.message);
    }
}

importCorrectedTitles();
