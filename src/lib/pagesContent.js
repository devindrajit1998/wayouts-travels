import { getPageContent, savePageContent } from './siteContent';

/**
 * Structured content for all core public pages, stored in Firestore
 * (siteContent/pages-meta) and edited from /admin/pages:
 * Home (via homeContent.js), About, Tours, Destinations, Services,
 * plus supporting pages: Blog, Post, Contact, FAQs, Team, Testimonials.
 */
const PAGES_DOC_ID = 'pages-meta';

/**
 * Load all page meta content from Firestore.
 * Returns null when the document does not exist; read errors propagate.
 */
export async function getPagesContent() {
    return getPageContent(PAGES_DOC_ID);
}

export async function savePagesContent(content) {
    return savePageContent(PAGES_DOC_ID, content);
}
