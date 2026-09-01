'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPagesContent } from './pagesContent';

/**
 * Loads a section of the pages-meta document from Firestore.
 * Firebase is the single source of truth — returns
 * { data, loading, error, retry } with no fallback content.
 */
export function usePageMeta(sectionId) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const load = useCallback(() => {
        let isMounted = true;
        setData(null);
        setError(null);
        getPagesContent()
            .then((pages) => {
                if (isMounted) setData(pages ? pages[sectionId] ?? null : null);
            })
            .catch((err) => {
                console.error(`Failed to load page content (${sectionId}):`, err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [sectionId]);

    useEffect(() => load(), [load, reloadKey]);

    const retry = useCallback(() => setReloadKey((k) => k + 1), []);

    return { data, loading: data === null && error === null, error, retry };
}
