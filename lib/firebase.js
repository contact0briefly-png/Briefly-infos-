import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuration lue depuis les variables d'environnement (Vercel → Settings → Environment Variables).
// Important : chaque variable doit être référencée en toutes lettres pour que Next.js l'injecte.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Évite la double initialisation (hot reload, plusieurs imports)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// Ta couleur principale utilisée sur tout le site
export const B24_BLUE = "#0077b5";
