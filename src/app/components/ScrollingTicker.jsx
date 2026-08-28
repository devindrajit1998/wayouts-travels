'use client';

import { defaultHomeContent } from '../../lib/homeContent';

/**
 * Data-driven scrolling ticker. Content is editable from /admin/home (Ticker tab).
 */
export default function ScrollingTicker({ content = defaultHomeContent.ticker }) {
    const { items } = content;

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
