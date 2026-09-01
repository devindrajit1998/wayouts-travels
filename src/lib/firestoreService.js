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
 * Generic Firestore collection service.
 * Firebase is the single source of truth: an empty collection returns [],
 * and any read error is thrown to the caller (no fallback data).
 */
export async function getCollectionItems(collectionName, orderField = null) {
    const colRef = collection(db, collectionName);
    const q = orderField ? query(colRef, orderBy(orderField, 'desc')) : colRef;
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
    }));
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
