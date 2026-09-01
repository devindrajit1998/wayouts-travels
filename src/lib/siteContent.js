import { db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'siteContent';

/**
 * Load a page's content document from Firestore.
 * Firebase is the single source of truth: returns the raw document data,
 * or null when the document does not exist. Read errors are thrown to
 * the caller — there is no fallback content.
 */
export async function getPageContent(pageId) {
    const snap = await getDoc(doc(db, COLLECTION, pageId));
    if (!snap.exists()) {
        return null;
    }
    return snap.data();
}

/**
 * Persist a page's content document (merged write).
 */
export async function savePageContent(pageId, content) {
    await setDoc(
        doc(db, COLLECTION, pageId),
        { ...content, updatedAt: serverTimestamp() },
        { merge: true }
    );
    return content;
}
