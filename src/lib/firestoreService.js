import { db } from './firebase';
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    serverTimestamp
} from 'firebase/firestore';

/**
 * Generic Firestore collection service with fallback to initial mock data if offline or Firebase not yet configured
 */
export async function getCollectionItems(collectionName, fallbackData = [], orderField = null) {
    try {
        if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_firebase_api_key_here') {
            return fallbackData;
        }

        const colRef = collection(db, collectionName);
        const q = orderField ? query(colRef, orderBy(orderField, 'desc')) : colRef;
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return fallbackData;
        }

        return snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));
    } catch (error) {
        console.warn(`Firestore get error (${collectionName}), falling back to local dataset:`, error.message);
        return fallbackData;
    }
}

export async function addCollectionItem(collectionName, itemData) {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
        ...itemData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...itemData };
}

export async function updateCollectionItem(collectionName, id, updateData) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
    });
    return { id, ...updateData };
}

export async function deleteCollectionItem(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return id;
}
