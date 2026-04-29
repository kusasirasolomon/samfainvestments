// ============================================================
// SAMFA INVESTMENTS LIMITED - Firebase Configuration
// Replace with your actual Firebase project credentials
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// ============================================================
// PRODUCTS API
// ============================================================
export async function getProducts(filters = {}) {
    try {
        const productsRef = collection(db, "products");
        let q = query(productsRef, orderBy("createdAt", "desc"));
        if (filters.category && filters.category !== "all") {
            q = query(productsRef, where("category", "==", filters.category), orderBy("createdAt", "desc"));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error fetching products:", e);
        return getSampleProducts();
    }
}

export async function addProduct(productData) {
    const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: new Date()
    });
    return docRef.id;
}

export async function updateProduct(id, data) {
    await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));
}

export async function uploadProductImage(file) {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

export { signInWithEmailAndPassword, signOut, onAuthStateChanged };

// ============================================================
// SAMPLE PRODUCTS (fallback when Firebase not configured)
// ============================================================
export function getSampleProducts() {
    return [
        { id: "1", name: "Executive Notebook Set", price: 45000, category: "Stationery", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80", badge: "Best Seller" },
        { id: "2", name: "Premium Ballpoint Pens (12pk)", price: 18000, category: "Stationery", image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80", badge: "New" },
        { id: "3", name: "Office Filing Cabinet", price: 320000, category: "Office Supplies", image: "https://images.unsplash.com/photo-1568795437914-df7b42e4f1ff?w=400&q=80", badge: null },
        { id: "4", name: "Ergonomic Office Chair", price: 580000, category: "Office Supplies", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=400&q=80", badge: "Sale" },
        { id: "5", name: "LED Desk Lamp", price: 75000, category: "Electronics & Electrical", image: "https://images.unsplash.com/photo-1616627451515-cbc80e5eca3a?w=400&q=80", badge: null },
        { id: "6", name: "Power Extension Board", price: 35000, category: "Electronics & Electrical", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", badge: null },
        { id: "7", name: "Organic Maize (50kg)", price: 95000, category: "Agro Products", image: "https://images.unsplash.com/photo-1565180155942-d5a0d3e1c8e3?w=400&q=80", badge: "Fresh" },
        { id: "8", name: "Premium Coffee Beans (1kg)", price: 42000, category: "Catering Services", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&q=80", badge: null },
        { id: "9", name: "Luxury Perfume Set", price: 165000, category: "Cosmology", image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80", badge: "Premium" },
        { id: "10", name: "Facial Skincare Kit", price: 88000, category: "Cosmology", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80", badge: null },
        { id: "11", name: "Sticky Notes Combo Pack", price: 12000, category: "Stationery", image: "https://images.unsplash.com/photo-1584476843779-c3b6f84be3a4?w=400&q=80", badge: null },
        { id: "12", name: "Rice (25kg bag)", price: 78000, category: "Agro Products", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", badge: null },
    ];
}