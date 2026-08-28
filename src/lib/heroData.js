import { defaultHomeContent, getHomeContent, saveHomeContent } from './homeContent';

/**
 * Backwards-compatible hero data API.
 * The hero now lives inside the home page content model (see homeContent.js),
 * but these exports keep the original interface used by Hero.jsx and the
 * admin editor.
 */
export const defaultHeroContent = defaultHomeContent.hero;

export async function getHeroContent() {
    const home = await getHomeContent();
    return home.hero;
}

export async function saveHeroContent(content) {
    const home = await getHomeContent();
    return saveHomeContent({ ...home, hero: content });
}
