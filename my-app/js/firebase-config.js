// ============================================================
// Samfa Investments Limited — Firebase Configuration
// Final Production Setup (Modular Firebase v10+)
// File: js/firebase-config.js
// ============================================================
console.log("🔥 firebase-config.js LOADED");
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔥 Firebase Project Config (REAL VALUES)
const firebaseConfig = {
    apiKey: "AIzaSyDdv4XaD5L5YK9Yn1kRvvvriVqvH6oHzrY",
    authDomain: "samfainvestmentslimited.firebaseapp.com",
    projectId: "samfainvestmentslimited",
    storageBucket: "samfainvestmentslimited.firebasestorage.app",
    messagingSenderId: "620374514393",
    appId: "1:620374514393:web:69b736f494b95c1ddafcc8",
    measurementId: "G-D1G69WPGV3"
};

// 🚀 Initialize Firebase App (ONLY ONCE)
const app = initializeApp(firebaseConfig);


import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function getProducts() {
    const snap = await getDocs(collection(db, "products"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
// 🔗 Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Default export (optional but useful)
export default app;