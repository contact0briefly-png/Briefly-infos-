import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOPeLjRRM88dE665rKZigk2JmA-J9YXek",
    authDomain: "bbriefly-7e3b8.firebaseapp.com",
    projectId: "bbriefly-7e3b8",
    storageBucket: "bbriefly-7e3b8.firebasestorage.app",
    messagingSenderId: "634935431290",
    appId: "1:634935431290:web:1dcb513aafc3011133ebc3"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Exportation de la base de données Firestore
export const db = getFirestore(app);

// Ta couleur principale utilisée sur tout le site
export const B24_BLUE = "#0077b5";
