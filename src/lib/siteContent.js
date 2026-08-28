import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'siteContent';

/**
 * Deep-merge saved content over defaults.
 * Plain objects merge recursively; arrays and primitives replace the default.
 */
export function deepMerge(defaults, saved) {
    if (Array.isArray(defaults) || Array.isArray(saved)) {
        return saved !== undefined ? saved : defaults;
    }
    if (
        defaults &&
        saved &&
        typeof defaults === 'object' &&
        typeof saved === 'object'
    ) {
        const result = { ...defaults };
        for (const key of Object.keys(saved)) {
            result[key] = key in defaults ? deepMerge(defaults[key], saved[key]) : saved[key];
        }
        return result;
    }
    return saved !== undefined ? saved : defaults;
}

function isFirebaseConfigured() {
    return Boolean(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_firebase_api_key_here'
    );
}

/**
 * Load a page's content document and deep-merge it over the defaults.
 * Falls back to the defaults when Firebase is not configured, the document
 * does not exist yet, or the read fails.
 */
export async function getPageContent(pageId, defaults) {
    try {
        if (!isFirebaseConfigured()) {
            return defaults;
        }

        const snap = await getDoc(doc(db, COLLECTION, pageId));
        if (!snap.exists()) {
            return defaults;
        }
        return deepMerge(defaults, snap.data());
    } catch (error) {
        console.warn(`Firestore get error (${COLLECTION}/${pageId}), falling back to default content:`, error.message);
        return defaults;
    }
}

/**
 * Persist a page's content document (merged write).
 */
export async function savePageContent(pageId, defaults, content) {
    const merged = deepMerge(defaults, content);
    await setDoc(
        doc(db, COLLECTION, pageId),
        { ...merged, updatedAt: serverTimestamp() },
        { merge: true }
    );
    return merged;
}
