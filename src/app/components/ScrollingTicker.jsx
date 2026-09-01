'use client';

import { useState, useEffect } from 'react';
import { getHomeContent } from '../../lib/homeContent';
import { LoadingState, ErrorState } from './DataState';

/**
 * Data-driven scrolling ticker. Content is editable from /admin/home (Ticker tab)
 * and stored in Firestore (siteContent/home) — the single source of truth.
 */
export default function ScrollingTicker({ content: initialContent = null }) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialContent) return;
        let isMounted = true;
        getHomeContent()
            .then((home) => {
                if (isMounted) setContent(home ? home.ticker : null);
            })
            .catch((err) => {
                console.error('Failed to load ticker content:', err.message);
                if (isMounted) setError(err);
            });
        return () => {
            isMounted = false;
        };
    }, [initialContent]);

    if (error) {
        return <ErrorState label="We could not load the ticker content. Please try again." minHeight="120px" />;
    }
    if (!content) {
        return <LoadingState label="Loading ticker…" minHeight="120px" />;
    }

    const { items } = content;

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="scrolling scrolling-ticker" data-scroll-index="4">
            <div className="wrapper feather-shadow2">
                {[0, 1].map((copyIndex) => (
                    <div className="content" key={copyIndex}>
                        {items.map((item, index) => (
                            <span key={`ticker-${copyIndex}-${index}`}>
                                <i className="fa-regular fa-asterisk mr-30"></i>
                                {item}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
