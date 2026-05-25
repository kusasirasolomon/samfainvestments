// ════════════════════════════════════════════════════════════
//  Samfa Investments Limited — firebase-config.js
//  Place at:  js/firebase-config.js
// ════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDdv4XaD5L5YK9Yn1kRvvvriVqvH6oHzrY",
    authDomain: "samfainvestmentslimited.firebaseapp.com",
    projectId: "samfainvestmentslimited",
    storageBucket: "samfainvestmentslimited.firebasestorage.app",
    messagingSenderId: "620374514393",
    appId: "1:620374514393:web:69b736f494b95c1ddafcc8",
    measurementId: "G-D1G69WPGV3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

// ── getProducts — fetch all products from Firestore ──────────
export async function getProducts() {
    try {
        // First try with orderBy (requires createdAt field + index)
        const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
        const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log('🔥 firebase-config.js LOADED');
        console.log('🔥 Products from Firebase:', products);
        window._samfaProducts = products;
        return products;
    } catch (err) {
        // orderBy failed (missing createdAt or no index) — fetch without sorting
        console.warn('⚠️ orderBy failed, fetching without sort:', err.message);
        const snap = await getDocs(collection(db, 'products'));
        const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log('🔥 Products from Firebase (unsorted):', products);
        window._samfaProducts = products;
        return products;
    }
}

// ── getSampleProducts — static fallback when Firebase fails ──
export function getSampleProducts() {
    console.warn('⚠️ Using sample products — Firebase unreachable');
    const samples = [
        { id: "s1", name: "Executive Notebook Set", price: 45000, category: "Stationery", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80", badge: "Best Seller" },
        { id: "s2", name: "Premium Ballpoint Pens (12pk)", price: 18000, category: "Stationery", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80", badge: "New" },
        { id: "s3", name: "Office Filing Cabinet", price: 320000, category: "Office Supplies", image: "https://images.unsplash.com/photo-1568795437914-df7b42e4f1ff?w=400&q=80", badge: null },
        { id: "s4", name: "Ergonomic Office Chair", price: 580000, category: "Office Supplies", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&q=80", badge: "Sale" },
        { id: "s5", name: "LED Desk Lamp", price: 75000, category: "Electronics & Electrical", image: "https://images.unsplash.com/photo-1616627451515-cbc80e5eca3a?w=400&q=80", badge: null },
        { id: "s6", name: "Luxury Perfume Set", price: 165000, category: "Cosmology", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80", badge: "Premium" },
        { id: "s7", name: "Organic Maize (50kg)", price: 95000, category: "Agro Products", image: "https://images.unsplash.com/photo-1565180155942-d5a0d3e1c8e3?w=400&q=80", badge: "Fresh" },
        { id: "s8", name: "Premium Coffee Beans (1kg)", price: 42000, category: "Catering Services", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80", badge: null },
    ];
    window._samfaProducts = samples;
    return samples;
}