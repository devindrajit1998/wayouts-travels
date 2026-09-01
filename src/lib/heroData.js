import { getHomeContent, saveHomeContent } from './homeContent';

/**
 * Hero data API. The hero lives inside the home page content document
 * (siteContent/home) in Firestore; these exports keep the interface
 * used by Hero.jsx and the admin editor.
 */
export async function getHeroContent() {
    const home = await getHomeContent();
    return home ? home.hero : null;
}

export async function saveHeroContent(content) {
    const home = await getHomeContent();
    return saveHomeContent({ ...home, hero: content });
}
