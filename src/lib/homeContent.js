import { getPageContent, savePageContent } from './siteContent';

export const HOME_PAGE_ID = 'home';

/**
 * Load the home page content from Firestore (siteContent/home).
 * Returns null when the document does not exist; read errors propagate.
 */
export async function getHomeContent() {
    return getPageContent(HOME_PAGE_ID);
}

/**
 * Persist the home page content.
 */
export async function saveHomeContent(content) {
    return savePageContent(HOME_PAGE_ID, content);
}
